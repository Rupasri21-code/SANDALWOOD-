import { z } from 'zod';
import { sanitizedString, sanitizedEmail, sanitizedAlphaNum } from './sanitization';

export const baseInvestorSchema = z.object({
  // Section 1: Basic Details
  profilePhotoUrl: sanitizedString().min(1, 'Profile photo is required'),
  firstName: sanitizedString().min(2, 'First name must be at least 2 characters'),
  middleName: sanitizedString().optional(),
  lastName: sanitizedString().min(1, 'Last name is required'),
  fullName: sanitizedString().optional(),
  gender: sanitizedString().optional(),
  dob: sanitizedString().optional(),
  age: z.number().optional(),
  investorType: sanitizedString().optional(),
  maritalStatus: sanitizedString().optional(),
  fatherName: sanitizedString().optional(),
  spouseName: sanitizedString().optional(),
  
  // Section 2: Contact Details
  email: sanitizedEmail().min(1, 'Email is required').email('Invalid email address'),
  altEmail: sanitizedEmail().email('Invalid email address').optional().or(z.literal('')),
  phone: sanitizedString().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  altPhone: sanitizedString().optional(),
  whatsappNumber: sanitizedString().optional(),
  prefCommunication: sanitizedString().optional(),
  bestTimeToContact: sanitizedString().optional(),
  
  // Section 3: Address Details (Permanent)
  country: sanitizedString().min(1, 'Permanent Country is required'),
  state: sanitizedString().optional(),
  district: sanitizedString().optional(),
  village: sanitizedString().optional(),
  addressLine1: sanitizedString().optional(),
  addressLine2: sanitizedString().optional(),
  landmark: sanitizedString().optional(),
  pincode: sanitizedString().regex(/^\d{6}$/, 'Permanent Pincode must be exactly 6 digits').optional().or(z.literal('')),
  mandal: sanitizedString().optional(),
  addressType: sanitizedString().optional(),
  sameAsPermanent: z.boolean().optional(),
  
  // Section 3: Current Address Details
  currentCountry: sanitizedString().min(1, 'Current Country is required'),
  currentState: sanitizedString().optional(),
  currentDistrict: sanitizedString().optional(),
  currentVillage: sanitizedString().optional(),
  currentAddressLine1: sanitizedString().optional(),
  currentPincode: sanitizedString().regex(/^\d{6}$/, 'Current Pincode must be exactly 6 digits').optional().or(z.literal('')),
  
  // Section 4: Professional Details
  occupation: sanitizedString().optional(),
  jobTitle: sanitizedString().optional(),
  companyName: sanitizedString().optional(),
  companyType: sanitizedString().optional(),
  industry: sanitizedString().optional(),
  workExperience: sanitizedString().optional(),
  monthlyIncome: sanitizedString().optional(),
  annualIncome: sanitizedString().optional(),
  panNumber: sanitizedAlphaNum().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').optional().or(z.literal('')),
  gstNumber: sanitizedAlphaNum().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST format').optional().or(z.literal('')),
  companyAddress: sanitizedString().optional(),
  
  // Section 5: Investment Profile
  investmentInterest: sanitizedString().min(1, 'Investment Interest is required'),
  budgetRange: sanitizedString().min(1, 'Budget Range is required'),
  investmentPurpose: sanitizedString().optional(),
  investmentSource: sanitizedString().optional(),
  holdingPeriod: sanitizedString().optional(),
  riskPreference: sanitizedString().optional(),
  expectedReturnNotes: sanitizedString().optional(),
  leadSource: sanitizedString().optional(),
  assignedAdvisor: sanitizedString().optional(),

  // Section 6: Land / Plot Details
  passbookNumber: sanitizedString().min(1, 'Passbook number is required'),
  plotConfiguration: sanitizedString().min(1, 'Plot configuration is required'),
  plotSize: sanitizedString().optional(),
  plotPhotos: sanitizedString().optional(),
  plotPhotosUrls: z.array(sanitizedString()).min(1, 'At least 1 Plot Photo is mandatory').max(4, 'Maximum of 4 Plot Photos allowed').optional(),
  
  // Section 7: Payment Details
  totalInvestment: z.union([sanitizedString(), z.number()]).optional(),
  paidAmount: z.union([sanitizedString(), z.number()]).optional(),
  paymentStatus: sanitizedString().min(1, 'Payment Status is required'),
  paymentMode: sanitizedString().optional(),
  
  // Section 8: Document Management
  aadhaarNumber: sanitizedString().regex(/^\d{12}$/, 'Aadhaar Number must be exactly 12 digits').optional().or(z.literal('')),
  aadhaarUrl: sanitizedString().min(1, 'Aadhaar Upload is required'),
  panUrl: sanitizedString().min(1, 'PAN Upload is required'),
  passbookPhotoUrl: sanitizedString().min(1, 'Passbook Upload is required'),
  paymentProofUrl: sanitizedString().optional(),
  agreementUrl: sanitizedString().optional(),
  landDocumentUrl: sanitizedString().optional(),
  nomineeDocumentUrl: sanitizedString().optional(),
  passbookVerificationStatus: sanitizedString().optional(),
  
  // Section 9: Nominee Details
  nomineeName: sanitizedString().min(2, 'Nominee Name must be at least 2 characters'),
  nomineeRelation: sanitizedString().min(1, 'Nominee Relationship is required'),
  nomineePhone: sanitizedString().regex(/^[6-9]\d{9}$/, 'Nominee Phone must be a valid 10-digit Indian mobile number'),
  nomineeEmail: sanitizedEmail().email('Invalid nominee email address').optional().or(z.literal('')),
  nomineeAadhaar: sanitizedString().regex(/^\d{12}$/, 'Nominee Aadhaar Number must be exactly 12 digits').optional().or(z.literal('')),
  nomineeAddress: sanitizedString().min(5, 'Nominee Address must be at least 5 characters').optional().or(z.literal('')),
  nomineeIdUrl: sanitizedString().optional(),
  
  // Section 10: Communication
  sendWelcomeEmail: z.boolean().optional(),
  sendWhatsapp: z.boolean().optional(),
  sendSms: z.boolean().optional(),
  monthlyUpdates: z.boolean().optional(),
  paymentReminders: z.boolean().optional(),
  documentUpdates: z.boolean().optional(),
  
  // Admin Notes & Other
  followUpDate: sanitizedString().optional(),
  followUpStatus: sanitizedString().optional(),
  priority: sanitizedString().optional(),
  assignedEmployee: sanitizedString().optional(),
  idType: sanitizedString().optional(),
  idNumber: sanitizedString().optional(),
  status: sanitizedString().optional(),
  notes: sanitizedString().optional(),
});

export const createInvestorSchema = baseInvestorSchema.superRefine((data, ctx) => {
  // Personal Info Logic
  if (data.maritalStatus === 'Single' && !data.fatherName) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Father Name is required for Single status", path: ["fatherName"] });
  }
  if (data.maritalStatus === 'Married' && !data.spouseName) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Husband/Wife Name is required for Married status", path: ["spouseName"] });
  }
  if (['Divorced', 'Widowed'].includes(data.maritalStatus || '') && (!data.fatherName || !data.spouseName)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Both Father Name and Husband/Wife Name are required", path: ["maritalStatus"] });
  }
  
  // Address Logic
  if (data.currentCountry === 'India' && (!data.currentState || !data.currentDistrict)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "State and District are required for India (Current Address)", path: ["currentCountry"] });
  }
  if (data.country === 'India' && (!data.state || !data.district)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "State and District are required for India (Permanent Address)", path: ["country"] });
  }
  
  // Payment Proof Logic
  if (data.paymentStatus === 'Paid' && !data.paymentProofUrl) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Payment Proof Upload is required for completed payments", path: ["paymentProofUrl"] });
  }
});

export const updateInvestorSchema = baseInvestorSchema.partial();

