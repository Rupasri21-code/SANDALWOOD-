import twilio from 'twilio';
import { env } from '../config/env';

let client: twilio.Twilio | null = null;

const getWhatsAppClient = () => {
  if (!client && env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
    client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  }
  return client;
};

/**
 * Resolves the correct phone number to use for WhatsApp from an investor profile.
 * Prefers `whatsapp_number` over `phone`. Returns null if notifications are disabled.
 */
export const getInvestorWhatsAppNumber = (investor: {
  phone: string;
  whatsapp_number?: string | null;
  send_whatsapp?: boolean | null;
}): string | null => {
  if (investor.send_whatsapp === false) return null; // Investor opted out
  return investor.whatsapp_number?.trim() || investor.phone?.trim() || null;
};

/**
 * Reusable WhatsApp message sender.
 * Standardizes recipient and sender numbers, catches Twilio sandbox errors, and logs outcomes.
 */
export const sendWhatsAppMessage = async (toPhone: string, messageBody: string) => {
  const twilioClient = getWhatsAppClient();
  
  if (!twilioClient) {
    console.warn('⚠️ Twilio credentials missing. Logging WhatsApp message instead:');
    console.warn(`[WhatsApp to ${toPhone}]:\n${messageBody}`);
    return null;
  }

  try {
    // Strip "whatsapp:" prefix if already present
    let rawNumber = env.TWILIO_TESTING_NUMBER ? env.TWILIO_TESTING_NUMBER.trim() : toPhone.trim();
    if (rawNumber.startsWith('whatsapp:')) {
      rawNumber = rawNumber.replace('whatsapp:', '');
    }

    // Ensure E.164 format. Default to India (+91) if no country code starts with '+'
    let formattedPhone = rawNumber.startsWith('+') ? rawNumber : `+91${rawNumber}`;
    // Remove formatting characters (spaces, hyphens, parentheses)
    formattedPhone = formattedPhone.replace(/[\s\-()]/g, '');

    const recipient = `whatsapp:${formattedPhone}`;
    const sender = `whatsapp:${env.TWILIO_WHATSAPP_NUMBER}`;

    const message = await twilioClient.messages.create({
      body: messageBody,
      from: sender,
      to: recipient,
    });

    console.log(`💬 WhatsApp message sent successfully! SID: ${message.sid}`);
    return message;
  } catch (error: any) {
    console.error('❌ Failed to send WhatsApp message:', error);
    
    // Map Twilio Sandbox join code error (63012)
    if (error.code === 63012 || (error.message && error.message.includes('sandbox'))) {
      throw new Error("WhatsApp number is not connected to Twilio Sandbox. Please send join code first.");
    }
    throw error;
  }
};

/**
 * Existing login credential message (MUST NOT BE DELETED OR BROKEN)
 */
export const sendWhatsAppCredentials = async (phone: string, fullName: string, email: string, passwordPlain: string) => {
  const messageBody = `*Welcome to Arbor Vest Sandalwood Investments!* 🌿\n\nDear ${fullName},\n\nYour secure investor portal account has been created by the Administration.\n\nYou can access your portal to monitor plot details, crop growth, investments, and documents.\n\n*Portal URL:* http://localhost:3000/login\n*Username:* ${email}\n*Temporary Password:* ${passwordPlain}\n\n⚠️ _Please change your password immediately after logging in for the first time._\n\nFor support, please reply to this message.\n\nRegards,\nArbor Vest Team`;

  return sendWhatsAppMessage(phone, messageBody);
};

/**
 * 1. Investor Account Created (New template specified by prompt)
 */
export const sendWhatsAppAccountCreated = async (phone: string, email: string, passwordPlain: string) => {
  const messageBody = `Welcome to Chandan Nilayam 🌱\nYour investor account has been created.\n\nEmail: ${email}\nPassword: ${passwordPlain}\n\nLogin: http://localhost:3000/login`;

  return sendWhatsAppMessage(phone, messageBody);
};

/**
 * 2. Plot Assigned
 */
export const sendWhatsAppPlotAssigned = async (phone: string, plotName: string, location: string, area: string) => {
  const messageBody = `🏞️ Plot Assigned Successfully\nPlot: ${plotName}\nLocation: ${location}\nArea: ${area}\n\nLogin to your investor portal to view details.`;

  return sendWhatsAppMessage(phone, messageBody);
};

/**
 * 3. Payment Received
 */
export const sendWhatsAppPaymentReceived = async (phone: string, amount: string, transactionId: string, status: string) => {
  const messageBody = `💰 Payment Received\nAmount: ₹${amount}\nTransaction ID: ${transactionId}\nStatus: ${status}\n\nThank you for your investment.`;

  return sendWhatsAppMessage(phone, messageBody);
};

/**
 * 4. Plantation Update
 */
export const sendWhatsAppPlantationUpdate = async (
  phone: string, 
  cropName: string, 
  growthStage: string, 
  healthStatus: string, 
  survivingPlants: number, 
  totalPlants: number
) => {
  const messageBody = `🌳 Plantation Update\nCrop: ${cropName}\nGrowth Stage: ${growthStage}\nHealth: ${healthStatus}\nSurviving Plants: ${survivingPlants}/${totalPlants}\n\nLogin to view full update.`;

  return sendWhatsAppMessage(phone, messageBody);
};

/**
 * 5. New Document Uploaded
 */
export const sendWhatsAppDocumentUploaded = async (phone: string, documentName: string, category: string) => {
  const messageBody = `📄 New Document Uploaded\nDocument: ${documentName}\nCategory: ${category}\n\nLogin to your portal to view/download.`;

  return sendWhatsAppMessage(phone, messageBody);
};

/**
 * 6. KYC Status Update
 */
export const sendWhatsAppKYCStatusUpdate = async (phone: string, status: string) => {
  const messageBody = `✅ KYC Status Update\nYour document verification status is: ${status}`;

  return sendWhatsAppMessage(phone, messageBody);
};

/**
 * 7. Admin Notification / Broadcast
 */
export const sendWhatsAppAdminBroadcast = async (phone: string, title: string, message: string) => {
  const messageBody = `📢 ${title}\n${message}\n\n- Chandan Nilayam Team`;

  return sendWhatsAppMessage(phone, messageBody);
};

/**
 * 8. Investment Created
 */
export const sendWhatsAppInvestmentCreated = async (
  phone: string,
  investorName: string,
  investmentType: string,
  amount: number,
  contractNumber: string,
  roiPercentage: number
) => {
  const formattedAmount = new Intl.NumberFormat('en-IN').format(amount);
  const messageBody = [
    `💼 *Investment Confirmed - Chandan Nilayam*`,
    ``,
    `Dear ${investorName},`,
    `Your investment has been successfully recorded.`,
    ``,
    `*Type:* ${investmentType}`,
    `*Amount:* ₹${formattedAmount}`,
    `*Contract No:* ${contractNumber}`,
    `*Expected ROI:* ${roiPercentage}%`,
    ``,
    `Login to your portal to view full details.`,
    `http://localhost:3000/login`,
    ``,
    `- Chandan Nilayam Team`,
  ].join('\n');

  return sendWhatsAppMessage(phone, messageBody);
};

/**
 * 9. Investment Status Updated
 */
export const sendWhatsAppInvestmentStatusUpdated = async (
  phone: string,
  investorName: string,
  contractNumber: string,
  oldStatus: string,
  newStatus: string
) => {
  const statusEmoji: Record<string, string> = {
    ACTIVE: '✅',
    MATURED: '🎉',
    WITHDRAWN: '🔄',
    PENDING: '⏳',
  };
  const emoji = statusEmoji[newStatus] || '📊';
  const messageBody = [
    `${emoji} *Investment Status Update - Chandan Nilayam*`,
    ``,
    `Dear ${investorName},`,
    `Your investment status has been updated.`,
    ``,
    `*Contract No:* ${contractNumber}`,
    `*Previous Status:* ${oldStatus}`,
    `*New Status:* ${newStatus}`,
    ``,
    `Login to your portal to view full details.`,
    `http://localhost:3000/login`,
    ``,
    `- Chandan Nilayam Team`,
  ].join('\n');

  return sendWhatsAppMessage(phone, messageBody);
};

/**
 * 10. Payment Status Updated (for updatePayment)
 */
export const sendWhatsAppPaymentStatusUpdated = async (
  phone: string,
  investorName: string,
  amount: number,
  transactionId: string,
  oldStatus: string,
  newStatus: string
) => {
  const formattedAmount = new Intl.NumberFormat('en-IN').format(amount);
  const statusEmoji: Record<string, string> = {
    COMPLETED: '✅',
    PENDING: '⏳',
    FAILED: '❌',
    REFUNDED: '🔄',
  };
  const emoji = statusEmoji[newStatus] || '💰';
  const messageBody = [
    `${emoji} *Payment Status Update - Chandan Nilayam*`,
    ``,
    `Dear ${investorName},`,
    `Your payment status has been updated.`,
    ``,
    `*Amount:* ₹${formattedAmount}`,
    `*Transaction ID:* ${transactionId}`,
    `*Previous Status:* ${oldStatus}`,
    `*New Status:* ${newStatus}`,
    ``,
    `Login to your portal to view payment history.`,
    `http://localhost:3000/login`,
    ``,
    `- Chandan Nilayam Team`,
  ].join('\n');

  return sendWhatsAppMessage(phone, messageBody);
};

/**
 * 11. Inquiry Received Confirmation
 */
export const sendWhatsAppInquiryConfirmation = async (
  phone: string,
  fullName: string
) => {
  const messageBody = [
    `👋 *Thank you for your interest!*`,
    ``,
    `Dear ${fullName},`,
    `We have received your inquiry for Chandan Nilayam Investments.`,
    ``,
    `Our investment advisor will contact you within 24 hours to guide you through our sandalwood plots and long-term growth opportunities.`,
    ``,
    `- Chandan Nilayam Team`
  ].join('\n');

  return sendWhatsAppMessage(phone, messageBody);
};

