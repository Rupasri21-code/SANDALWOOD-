import { sendEmail } from '../services/email.service';
import { db } from '../config/database';
import { createNotification } from '../services/notification.service';

async function testMediaUploadNotification() {
  console.log('🧪 Testing Media Upload Email & In-App Notification Trigger...');

  // Fetch an investor profile to test with
  const investor = await db.investorProfile.findFirst();

  if (!investor) {
    console.error('❌ No investor profile found in database.');
    process.exit(1);
  }

  console.log(`👤 Found target investor: ${investor.full_name} (${investor.email})`);

  // Trigger media upload email notification via createNotification
  const notification = await createNotification({
    recipientId: investor.user_id || undefined,
    investorId: investor.id,
    title: 'New Media Asset Uploaded',
    message: 'A new media asset "Plantation_Photo_Plot_88.jpg" (Plantation Photos) has been added to your media gallery.',
    type: 'INFO',
    link: '/portal/documents',
    sendEmailAlert: true,
  });

  console.log('✅ Notification created in DB:', notification?.id);
  console.log('🎉 Test completed!');
}

testMediaUploadNotification()
  .catch(console.error)
  .finally(() => process.exit(0));
