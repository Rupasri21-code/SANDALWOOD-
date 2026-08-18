import { db } from '../config/database';
import { sendEmail, sendUpdateNotification, sendDocumentAlert } from './email.service';

export const createNotification = async (params: {
  recipientId?: string;
  investorId?: string;
  title: string;
  message: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT' | 'UPDATE';
  link?: string;
  sendEmailAlert?: boolean;
}) => {
  try {
    const { recipientId: initialRecipientId, investorId, title, message, type = 'INFO', link, sendEmailAlert = false } = params;

    let recipientId = initialRecipientId;
    let investor: any = null;
    let user: any = null;

    // Fetch investor profile if investorId is provided
    if (investorId) {
      investor = await db.investorProfile.findUnique({
        where: { id: investorId },
        include: { user: true },
      });
      if (investor?.user_id && !recipientId) {
        recipientId = investor.user_id;
      }
    }

    // Fetch user or investor profile if recipientId is provided
    if (recipientId) {
      user = await db.user.findUnique({
        where: { id: recipientId },
        include: { profile: true },
      });
      if (!investor && user?.profile) {
        investor = user.profile;
      }
    }

    // Create DB notification if recipientId is available
    let notification = null;
    if (recipientId) {
      notification = await db.notification.create({
        data: {
          recipient_id: recipientId,
          investor_id: investorId || investor?.id || null,
          title,
          message,
          type,
          link,
        },
      });
    }

    // Send email alert if requested
    if (sendEmailAlert) {
      const email = investor?.email || user?.email || (investorId ? (await db.investorProfile.findUnique({ where: { id: investorId } }))?.email : null);
      const fullName = investor?.full_name || user?.profile?.full_name || user?.username || 'Valued Investor';

      if (email) {
        try {
          if (type === 'UPDATE') {
            await sendUpdateNotification(email, fullName, title, message);
          } else if (type === 'ALERT' && title.toLowerCase().includes('document')) {
            await sendDocumentAlert(email, fullName, title);
          } else {
            const emailSubject = `Chandan Nilayam Notification: ${title}`;
            const emailHtml = `
              <div style="font-family: sans-serif; padding: 25px; color: #1F1B16; background-color: #F7F0E3; border-radius: 12px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #062E1F; margin-top: 0;">${title}</h2>
                <p style="font-size: 15px;">Dear ${fullName},</p>
                <p style="font-size: 15px; line-height: 1.5;">${message}</p>
                ${link ? `<p style="margin-top: 20px;"><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}${link}" style="background-color: #062E1F; color: #FFF8ED; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; inline-block;">View in Investor Portal</a></p>` : ''}
                <hr style="border: 0; border-top: 1px solid #E7D7BC; margin: 25px 0 15px 0;" />
                <p style="font-size: 13px; color: #1F1B16; opacity: 0.7; margin: 0;">Chandan Nilayam Sandalwood Investments</p>
              </div>
            `;
            await sendEmail(email, emailSubject, emailHtml);
          }
        } catch (mailErr: any) {
          console.error(`❌ Failed to send email alert for notification "${title}":`, mailErr.message || mailErr);
        }
      } else {
        console.warn(`⚠️ Cannot send email alert for notification "${title}": No email address found for recipient.`);
      }
    }

    return notification;
  } catch (error) {
    console.error('❌ Failed to create notification:', error);
  }
};

export const logActivity = async (userId: string | null, action: string, details?: string, ipAddress?: string) => {
  try {
    await db.activityLog.create({
      data: {
        user_id: userId,
        action,
        details,
        ip_address: ipAddress,
      },
    });
  } catch (error) {
    console.error('❌ Failed to log activity:', error);
  }
};
