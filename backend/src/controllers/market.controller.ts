import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get the latest market price
export const getMarketPrice = async (req: Request, res: Response) => {
  try {
    let marketPrice = await prisma.marketPrice.findFirst({
      orderBy: { last_updated: 'desc' }
    });

    if (!marketPrice) {
      // Seed default if none exists
      marketPrice = await prisma.marketPrice.create({
        data: {
          market_price: 15000000,
          grade: "A-Grade Indian Red Sandalwood",
          unit: "Ton",
          source: "Government Auction & Verified Industry Reports",
          last_updated: new Date(),
          verified: true
        }
      });
    }

    res.status(200).json({
      marketPrice: marketPrice.market_price,
      grade: marketPrice.grade,
      unit: marketPrice.unit,
      source: marketPrice.source,
      lastUpdated: marketPrice.last_updated.toISOString(),
      verified: marketPrice.verified
    });
  } catch (error) {
    console.error('Error fetching market price:', error);
    res.status(500).json({ message: 'Internal server error fetching market price' });
  }
};

// Update market price (Admin only)
export const updateMarketPrice = async (req: Request, res: Response) => {
  try {
    const { marketPrice, grade, unit, source, lastUpdated, verified } = req.body;

    const existing = await prisma.marketPrice.findFirst({
      orderBy: { last_updated: 'desc' }
    });

    let updated;
    if (existing) {
      updated = await prisma.marketPrice.update({
        where: { id: existing.id },
        data: {
          market_price: parseFloat(marketPrice),
          grade,
          unit,
          source,
          last_updated: new Date(lastUpdated),
          verified: Boolean(verified)
        }
      });
    } else {
      updated = await prisma.marketPrice.create({
        data: {
          market_price: parseFloat(marketPrice),
          grade,
          unit,
          source,
          last_updated: new Date(lastUpdated),
          verified: Boolean(verified)
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Market price updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating market price:', error);
    res.status(500).json({ message: 'Internal server error updating market price' });
  }
};
