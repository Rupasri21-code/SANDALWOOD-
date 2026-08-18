import { db } from '../config/database';
import { sendGeneralNotification } from '../services/email.service';
import { sendWhatsAppAdminBroadcast, getInvestorWhatsAppNumber } from '../services/whatsapp.service';

async function main() {
  console.log('🧪 Debugging Notification System...');
  
  // Find the investor profile
  const investor = await db.investorProfile.findFirst({
    where: { email: 'gopidesirupasri8@gmail.com' }
  });

  if (!investor) {
    console.error('❌ Could not find investor with email gopidesirupasri8@gmail.com');
    return;
  }

  console.log(`👤 Found Investor: ${investor.full_name} (ID: ${investor.id}, User ID: ${investor.user_id})`);

  if (!investor.user_id) {
    console.error('❌ Investor does not have a user_id linked.');
    return;
  }

  // Find user record
  const user = await db.user.findUnique({
    where: { id: investor.user_id }
  });

  if (!user) {
    console.error(`❌ User record with ID ${investor.user_id} not found in user table!`);
    return;
  }

  console.log(`👤 Found User Record: ${user.email} (Role: ${user.role})`);

  // Try Database Insert
  try {
    console.log('Inserting notification into database...');
    const notif = await db.notification.create({
      data: {
        recipient_id: investor.user_id,
        investor_id: investor.id,
        title: 'hi all hello all',
        message: 'hi every onehpow are you',
        type: 'SUCCESS',
      }
    });
    console.log('✅ Notification created in DB:', notif.id);
  } catch (dbErr: any) {
    console.error('❌ Database insertion failed:', dbErr);
  }

  // Try Email Send
  try {
    console.log(`Sending email to ${user.email}...`);
    const emailRes = await sendGeneralNotification(user.email, investor.full_name, 'hi all hello all', 'hi every onehpow are you');
    console.log('✅ Email service response:', emailRes);
  } catch (emailErr: any) {
    console.error('❌ Email dispatch failed:', emailErr);
  }

  // Try WhatsApp Send
  const waPhone = getInvestorWhatsAppNumber(investor);
  console.log('WhatsApp Phone Number:', waPhone);
  if (waPhone) {
    try {
      console.log(`Sending WhatsApp message to ${waPhone}...`);
      const waRes = await sendWhatsAppAdminBroadcast(waPhone, 'hi all hello all', 'hi every onehpow are you');
      console.log('✅ WhatsApp service response:', waRes);
    } catch (waErr: any) {
      console.error('❌ WhatsApp dispatch failed:', waErr);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
