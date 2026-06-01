import { db } from '../config/database';
import { sendEmail, sendUpdateNotification, sendDocumentAlert } from './email.service';

export const createNotification = async (params: {
  recipientId: string;
  customerId?: string;
  title: string;
  message: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT' | 'UPDATE';
  link?: string;
  sendEmailAlert?: boolean;
}) => {
  try {
    const { recipientId, customerId, title, message, type = 'INFO', link, sendEmailAlert = false } = params;

    // Create DB notification
    const notification = await db.notification.create({
      data: {
        recipient_id: recipientId,
        customer_id: customerId,
        title,
        message,
        type,
        link,
      },
    });

    // Send email alert if requested
    if (sendEmailAlert) {
      // Find the user to get their email and name
      const user = await db.user.findUnique({
        where: { id: recipientId },
        include: { profile: true },
      });

      if (user && user.profile) {
        if (type === 'UPDATE') {
          await sendUpdateNotification(user.email, user.profile.full_name, title, message);
        } else if (type === 'ALERT' && link?.includes('documents')) {
          await sendDocumentAlert(user.email, user.profile.full_name, title);
        } else {
          const emailSubject = `Arbor Vest Notification: ${title}`;
          const emailHtml = `
            <div style="font-family: sans-serif; padding: 20px; color: #1F1B16; background-color: #F7F0E3; border-radius: 12px;">
              <h2 style="color: #062E1F;">${title}</h2>
              <p>Dear ${user.profile.full_name},</p>
              <p>${message}</p>
              ${link ? `<p><a href="http://localhost:3000${link}" style="color: #9A6A2F; font-weight: bold;">Click here to view details</a></p>` : ''}
              <hr style="border: 0; border-top: 1px solid #E7D7BC; margin: 20px 0;" />
              <p style="font-size: 12px; color: #1F1B16; opacity: 0.7;">Arbor Vest Sandalwood Investments</p>
            </div>
          `;
          await sendEmail(user.email, emailSubject, emailHtml);
        }
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
