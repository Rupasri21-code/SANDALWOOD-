import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { db } from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export const getAdminStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [
      investorsCount,
      plotsCount,
      cropsCount,
      inquiriesCount,
      investments,
      recentPayments,
      recentInvestors,
      inquiryDistribution,
      monthlyInvestments,
    ] = await Promise.all([
      db.investorProfile.count({ where: { status: 'ACTIVE' } }),
      db.landPlot.count(),
      db.crop.count(),
      db.inquiry.count({ where: { status: 'NEW' } }),
      db.investment.findMany({ select: { amount: true, status: true } }),
      db.payment.findMany({
        orderBy: { payment_date: 'desc' },
        take: 5,
        include: { investor: { select: { full_name: true } } },
      }),
      db.investorProfile.findMany({
        orderBy: { created_at: 'desc' },
        take: 5,
      }),
      db.inquiry.groupBy({
        by: ['status'],
        _count: true,
      }),
      // Simple aggregation of payments by month
      db.payment.findMany({
        select: { amount: true, payment_date: true },
        orderBy: { payment_date: 'asc' },
      }),
    ]);

    const totalAum = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const activeInvestmentsCount = investments.filter((i) => i.status === 'ACTIVE').length;

    // Format charts data
    const chartPayments = monthlyInvestments.reduce((acc: any[], payment) => {
      const monthYear = payment.payment_date.toLocaleString('default', { month: 'short', year: '2-digit' });
      const existing = acc.find((item) => item.month === monthYear);
      if (existing) {
        existing.amount += payment.amount;
      } else {
        acc.push({ month: monthYear, amount: payment.amount });
      }
      return acc;
    }, []).slice(-6); // Last 6 months

    res.status(200).json(
      new ApiResponse(200, {
        summary: {
          totalInvestors: investorsCount,
          totalPlots: plotsCount,
          totalCrops: cropsCount,
          pendingInquiries: inquiriesCount,
          totalAum,
          activeInvestments: activeInvestmentsCount,
        },
        recentInvestors,
        recentPayments,
        charts: {
          paymentsOverTime: chartPayments,
          inquiries: inquiryDistribution,
        },
      }, 'Admin dashboard statistics compiled successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getInvestorStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const investor = await db.investorProfile.findUnique({
      where: { user_id: req.user.id },
    });

    if (!investor) {
      throw new ApiError(404, 'Investor profile associated with this account not found');
    }

    const [
      plots,
      investments,
      payments,
      documentsCount,
      recentUpdates,
      recentNotifications,
    ] = await Promise.all([
      db.landPlot.findMany({
        where: { investor_id: investor.id },
        include: { crops: true },
      }),
      db.investment.findMany({
        where: { investor_id: investor.id },
        orderBy: { investment_date: 'desc' },
      }),
      db.payment.findMany({
        where: { investor_id: investor.id },
        orderBy: { payment_date: 'desc' },
        take: 5,
      }),
      db.document.count({
        where: { investor_id: investor.id },
      }),
      db.plantationUpdate.findMany({
        where: { land: { investor_id: investor.id } },
        orderBy: { update_date: 'desc' },
        take: 4,
      }),
      db.notification.findMany({
        where: { recipient_id: req.user.id },
        orderBy: { created_at: 'desc' },
        take: 3,
      }),
    ]);

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalTrees = plots.reduce((sum, plot) => {
      const cropSum = plot.crops.reduce((s, c) => s + c.surviving_plants, 0);
      return sum + cropSum;
    }, 0);

    res.status(200).json(
      new ApiResponse(200, {
        investor,
        summary: {
          totalPlots: plots.length,
          totalTrees,
          totalInvested,
          documentsCount,
          paymentsCount: payments.length,
        },
        plots,
        recentUpdates,
        recentNotifications,
        recentPayments: payments,
      }, 'Investor portal overview loaded')
    );
  } catch (error) {
    next(error);
  }
};
