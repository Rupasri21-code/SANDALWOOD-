import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { createInvestorSchema, updateInvestorSchema } from '../validators/investor.validator';
import { sendCredentials } from '../services/email.service';
import { sendWhatsAppCredentials, sendWhatsAppAccountCreated, sendWhatsAppKYCStatusUpdate } from '../services/whatsapp.service';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const listInvestors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const investors = await db.investorProfile.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        landPlots: true,
        investments: true,
      },
    });

    res.status(200).json(
      new ApiResponse(200, investors, 'Investors retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getInvestor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const investor = await db.investorProfile.findUnique({
      where: { id },
      include: {
        landPlots: {
          include: { crops: true },
        },
        investments: {
          include: { payments: true },
        },
        payments: true,
        documents: true,
        media: true,
      },
    });

    if (!investor) {
      throw new ApiError(404, 'Investor profile not found');
    }

    res.status(200).json(
      new ApiResponse(200, investor, 'Investor profile retrieved')
    );
  } catch (error) {
    next(error);
  }
};

const mapToPrisma = (data: any) => ({
  first_name: data.firstName,
  middle_name: data.middleName,
  last_name: data.lastName,
  full_name: data.fullName || `${data.firstName} ${data.lastName}`,
  gender: data.gender,
  dob: data.dob ? new Date(data.dob) : undefined,
  age: data.age,
  profile_photo_url: data.profilePhotoUrl,
  investor_type: data.investorType,
  marital_status: data.maritalStatus,
  father_name: data.fatherName,
  spouse_name: data.spouseName,
  
  email: data.email,
  alt_email: data.altEmail,
  phone: data.phone,
  alt_phone: data.altPhone,
  whatsapp_number: data.whatsappNumber,
  pref_communication: data.prefCommunication,
  best_time_to_contact: data.bestTimeToContact,
  
  address_line1: data.addressLine1 || '',
  address_line2: data.addressLine2,
  landmark: data.landmark,
  village: data.village,
  mandal: data.mandal,
  district: data.district,
  state: data.state || '',
  country: data.country || '',
  pincode: data.pincode,
  address_type: data.addressType,
  same_as_permanent: data.sameAsPermanent,
  
  current_address_line1: data.currentAddressLine1,
  current_village: data.currentVillage,
  current_district: data.currentDistrict,
  current_state: data.currentState,
  current_country: data.currentCountry,
  current_pincode: data.currentPincode,
  
  occupation: data.occupation,
  job_title: data.jobTitle,
  company_name: data.companyName,
  company_type: data.companyType,
  industry: data.industry,
  work_experience: data.workExperience,
  monthly_income: data.monthlyIncome,
  annual_income: data.annualIncome,
  pan_number: data.panNumber,
  gst_number: data.gstNumber,
  company_address: data.companyAddress,
  
  investment_interest: data.investmentInterest,
  budget_range: data.budgetRange,
  investment_purpose: data.investmentPurpose,
  investment_source: data.investmentSource,
  holding_period: data.holdingPeriod,
  risk_preference: data.riskPreference,
  expected_return_notes: data.expectedReturnNotes,
  lead_source: data.leadSource,
  assigned_advisor: data.assignedAdvisor,
  
  nominee_name: data.nomineeName,
  nominee_relation: data.nomineeRelation,
  nominee_phone: data.nomineePhone,
  nominee_email: data.nomineeEmail,
  nominee_aadhaar: data.nomineeAadhaar,
  nominee_address: data.nomineeAddress,
  nominee_id_url: data.nomineeIdUrl,
  
  passbook_photo_url: data.passbookPhotoUrl,
  land_document_url: data.landDocumentUrl,
  payment_proof_url: data.paymentProofUrl,
  aadhaar_url: data.aadhaarUrl,
  pan_url: data.panUrl,
  agreement_url: data.agreementUrl,
  nominee_document_url: data.nomineeDocumentUrl,
  passbook_verification_status: data.passbookVerificationStatus,
  
  id_number: data.aadhaarNumber,
  id_type: data.aadhaarNumber ? 'Aadhaar' : data.idType,

  send_welcome_email: data.sendWelcomeEmail,
  send_whatsapp: data.sendWhatsapp,
  send_sms: data.sendSms,
  monthly_updates: data.monthlyUpdates,
  payment_reminders: data.paymentReminders,
  document_updates: data.documentUpdates,
  
  follow_up_date: data.followUpDate ? new Date(data.followUpDate) : undefined,
  follow_up_status: data.followUpStatus,
  priority: data.priority,
  assigned_employee: data.assignedEmployee,
  
  status: data.status,
  notes: data.notes,
});

export const createInvestor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createInvestorSchema.parse(req.body);

    // Verify unique email
    const existing = await db.investorProfile.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      throw new ApiError(400, 'Investor email already registered');
    }

    if (validated.passbookNumber) {
      const existingPassbook = await db.landPlot.findFirst({
        where: { passbook_number: validated.passbookNumber }
      });
      if (existingPassbook) {
        throw new ApiError(400, 'Passbook Number is already registered to another plot');
      }
    }

    const investor = await db.investorProfile.create({
      data: mapToPrisma(validated),
    });

    // If plot details are provided, create a land plot linked to the investor
    if (validated.passbookNumber || validated.plotSize || validated.plotConfiguration) {
      await db.landPlot.create({
        data: {
          investor_id: investor.id,
          title: `Plot for ${investor.full_name}`,
          description: validated.plotConfiguration || 'Plot purchased by investor',
          location: validated.district || 'TBD',
          district: validated.district || 'TBD',
          state: validated.state || 'TBD',
          survey_number: validated.passbookNumber || 'TBD',
          total_area: parseFloat(validated.plotSize || '0') || 0,
          purchase_price: 0,
          current_value: 0,
          status: 'RESERVED',
          passbook_number: validated.passbookNumber,
          plot_size: validated.plotSize,
          plot_configuration: validated.plotConfiguration,
          images: validated.plotPhotos || '',
        }
      });
    }

    res.status(201).json(
      new ApiResponse(201, investor, 'Investor created successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const updateInvestor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = updateInvestorSchema.parse(req.body);

    const existing = await db.investorProfile.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Investor profile not found');
    }

    const updated = await db.investorProfile.update({
      where: { id },
      data: mapToPrisma(validated),
    });

    if (
      updated.passbook_verification_status &&
      existing.passbook_verification_status !== updated.passbook_verification_status
    ) {
      try {
        if (updated.phone) {
          await sendWhatsAppKYCStatusUpdate(updated.phone, updated.passbook_verification_status);
        }
      } catch (waErr: any) {
        console.error('⚠️ Failed to send WhatsApp KYC status update notification:', waErr.message || waErr);
      }
    }

    res.status(200).json(
      new ApiResponse(200, updated, 'Investor updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteInvestor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await db.investorProfile.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Investor profile not found');
    }

    // Delete associated User as well if it exists
    if (existing.user_id) {
      await db.user.delete({ where: { id: existing.user_id } });
    } else {
      await db.investorProfile.delete({ where: { id } });
    }

    res.status(200).json(
      new ApiResponse(200, null, 'Investor deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const generatePortalCredentials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const investor = await db.investorProfile.findUnique({ where: { id } });
    if (!investor) {
      throw new ApiError(404, 'Investor profile not found');
    }

    if (investor.user_id) {
      throw new ApiError(400, 'Investor already has portal credentials');
    }

    // Generate random 10 character temporary password
    const tempPassword = crypto.randomBytes(5).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create User record
    const user = await db.user.create({
      data: {
        email: investor.email,
        username: investor.email.split('@')[0],
        password: hashedPassword,
        role: 'INVESTOR',
      },
    });

    // Update Investor profile connection
    await db.investorProfile.update({
      where: { id },
      data: { user_id: user.id },
    });

    // Send credentials by email
    await sendCredentials(investor.email, investor.full_name, tempPassword);
    
    // Send credentials via WhatsApp
    try {
      if (investor.phone) {
        await sendWhatsAppAccountCreated(investor.phone, investor.email, tempPassword);
      }
    } catch (waErr: any) {
      console.error('⚠️ Failed to send WhatsApp account created notification:', waErr.message || waErr);
    }

    res.status(200).json(
      new ApiResponse(200, { email: investor.email, tempPassword }, 'Credentials generated and sent via WhatsApp successfully')
    );
  } catch (error) {
    next(error);
  }
};
