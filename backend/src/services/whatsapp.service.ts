import twilio from 'twilio';
import { env } from '../config/env';

let client: twilio.Twilio | null = null;

const getWhatsAppClient = () => {
  if (!client && env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
    client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  }
  return client;
};

export const sendWhatsAppMessage = async (toPhone: string, messageBody: string) => {
  const twilioClient = getWhatsAppClient();
  
  if (!twilioClient) {
    console.warn('⚠️ Twilio credentials missing. Logging WhatsApp message instead:');
    console.warn(`[WhatsApp to ${toPhone}]:\n${messageBody}`);
    return null;
  }

  try {
    // Format the phone number (ensure it has country code, fallback to India +91 if missing)
    let formattedPhone = toPhone.startsWith('+') ? toPhone : `+91${toPhone}`;

    const message = await twilioClient.messages.create({
      body: messageBody,
      from: `whatsapp:${env.TWILIO_WHATSAPP_NUMBER}`, // The Twilio sandbox or registered WA number
      to: `whatsapp:${formattedPhone}`
    });

    console.log(`💬 WhatsApp message sent successfully! SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('❌ Failed to send WhatsApp message:', error);
    throw error;
  }
};

export const sendWhatsAppCredentials = async (phone: string, fullName: string, email: string, passwordPlain: string) => {
  const messageBody = `*Welcome to Arbor Vest Sandalwood Investments!* 🌿\n\nDear ${fullName},\n\nYour secure investor portal account has been created by the Administration.\n\nYou can access your portal to monitor plot details, crop growth, investments, and documents.\n\n*Portal URL:* http://localhost:3000/login\n*Username:* ${email}\n*Temporary Password:* ${passwordPlain}\n\n⚠️ _Please change your password immediately after logging in for the first time._\n\nFor support, please reply to this message.\n\nRegards,\nArbor Vest Team`;

  return sendWhatsAppMessage(phone, messageBody);
};
