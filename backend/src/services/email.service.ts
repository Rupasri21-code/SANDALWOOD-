import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY || 're_placeholder');

export const sendEmail = async (to: string, subject: string, html: string, text?: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Chandan Nilayam Investments <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      return { success: false, error };
    }

    console.log(`📧 Email sent successfully! Message ID: ${data?.id}`);
    return { success: true, data };
  } catch (error) {
    // Catch block ensures failure does not crash the calling function
    console.error('❌ Failed to send email via Resend:', error);
    return { success: false, error };
  }
};

export const sendCredentials = async (email: string, fullName: string, passwordPlain: string) => {
  const subject = 'Welcome to Chandan Nilayam - Your Investor Portal Credentials';
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #1F1B16; background-color: #F7F0E3; border-radius: 12px;">
      <h2 style="color: #062E1F;">Welcome to Chandan Nilayam Sandalwood Investments!</h2>
      <p>Dear ${fullName},</p>
      <p>We are excited to partner with you in your sandalwood investment journey. A secure investor account has been created for you.</p>
      <p>You can access your portal to monitor plot details, crop growth, investments, payments, and documents.</p>
      <div style="background-color: #FFF8ED; border: 1px solid #C99A3A; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Portal URL:</strong> <a href="http://localhost:3000/login" style="color: #9A6A2F;">http://localhost:3000/login</a></p>
        <p style="margin: 5px 0;"><strong>Username / Email:</strong> ${email}</p>
        <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${passwordPlain}</p>
      </div>
      <p style="font-size: 13px; color: #9A6A2F;">*Please change your password immediately after logging in for the first time.</p>
      <hr style="border: 0; border-top: 1px solid #E7D7BC; margin: 20px 0;" />
      <p style="font-size: 12px; color: #1F1B16; opacity: 0.7;">This email was automatically generated. If you did not request this, please contact support.</p>
    </div>
  `;
  return sendEmail(email, subject, html);
};

export const sendInquiryConfirmation = async (email: string, fullName: string) => {
  const subject = 'Thank you for your interest in Chandan Nilayam Investments';
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #1F1B16; background-color: #F7F0E3; border-radius: 12px;">
      <p>Dear ${fullName},</p>
      <p>Thank you for showing interest in Chandan Nilayam Investments.</p>
      <p>Our investment advisor will contact you within 24 hours to guide you through our sandalwood plots, investment process, documentation, and long-term growth opportunities.</p>
      <p>Regards,<br/>Chandan Nilayam Investments Team</p>
    </div>
  `;
  return sendEmail(email, subject, html);
};

export const sendUpdateNotification = async (email: string, fullName: string, updateTitle: string, updateDescription: string) => {
  const subject = 'New Plantation Update - Chandan Nilayam';
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #1F1B16; background-color: #F7F0E3; border-radius: 12px;">
      <h2 style="color: #062E1F;">New Plantation Update Available</h2>
      <p>Dear ${fullName},</p>
      <p>A new status report has been uploaded for your sandalwood plot: <strong>${updateTitle}</strong></p>
      <blockquote style="background-color: #FFF8ED; border-left: 4px solid #C99A3A; padding: 10px 15px; margin: 15px 0; color: #1F1B16;">
        ${updateDescription}
      </blockquote>
      <p>Please log in to your investor portal to view complete gallery items, growth measurements, and reports.</p>
      <div style="margin: 20px 0;">
        <a href="http://localhost:3000/login" style="background-color: #062E1F; color: #FFF8ED; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Portal</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #E7D7BC; margin: 20px 0;" />
      <p style="font-size: 12px; color: #1F1B16; opacity: 0.7;">Chandan Nilayam Sandalwood Investments</p>
    </div>
  `;
  return sendEmail(email, subject, html);
};

export const sendDocumentAlert = async (email: string, fullName: string, docTitle: string) => {
  const subject = 'New Document Uploaded to Your Portal - Chandan Nilayam';
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #1F1B16; background-color: #F7F0E3; border-radius: 12px;">
      <h2 style="color: #062E1F;">New Document Shared</h2>
      <p>Dear ${fullName},</p>
      <p>A new document has been added to your secure investor portal: <strong>${docTitle}</strong></p>
      <p>You can view and download this document from the "My Documents" tab in the portal.</p>
      <div style="margin: 20px 0;">
        <a href="http://localhost:3000/login" style="background-color: #9A6A2F; color: #FFF8ED; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Documents</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #E7D7BC; margin: 20px 0;" />
      <p style="font-size: 12px; color: #1F1B16; opacity: 0.7;">Chandan Nilayam Sandalwood Investments</p>
    </div>
  `;
  return sendEmail(email, subject, html);
};

export const sendPaymentNotification = async (email: string, fullName: string, amount: string, date: string) => {
  const subject = 'Payment Received - Chandan Nilayam Investments';
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #1F1B16; background-color: #F7F0E3; border-radius: 12px;">
      <h2 style="color: #062E1F;">Payment Confirmation</h2>
      <p>Dear ${fullName},</p>
      <p>We have successfully received your payment of <strong>${amount}</strong> on <strong>${date}</strong>.</p>
      <p>You can view the payment details and download the receipt from your investor portal.</p>
      <div style="margin: 20px 0;">
        <a href="http://localhost:3000/login" style="background-color: #062E1F; color: #FFF8ED; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Payments</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #E7D7BC; margin: 20px 0;" />
      <p style="font-size: 12px; color: #1F1B16; opacity: 0.7;">Chandan Nilayam Sandalwood Investments</p>
    </div>
  `;
  return sendEmail(email, subject, html);
};

export const sendGeneralNotification = async (email: string, fullName: string, subjectLine: string, messageBody: string) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #1F1B16; background-color: #F7F0E3; border-radius: 12px;">
      <p>Dear ${fullName},</p>
      <p>${messageBody}</p>
      <div style="margin: 20px 0;">
        <a href="http://localhost:3000/login" style="background-color: #062E1F; color: #FFF8ED; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Portal</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #E7D7BC; margin: 20px 0;" />
      <p style="font-size: 12px; color: #1F1B16; opacity: 0.7;">Chandan Nilayam Sandalwood Investments</p>
    </div>
  `;
  return sendEmail(email, subjectLine, html);
};
