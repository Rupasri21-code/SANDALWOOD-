import { sendEmail } from '../services/email.service';

async function testEmail() {
  console.log('🧪 Testing Email dispatch to rupasrigopidesi33@gmail.com...');
  const res = await sendEmail(
    'rupasrigopidesi33@gmail.com',
    'Chandhan Nilayam - Admin Update Notification Test',
    `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #12372A; background-color: #F7F0E4; border-radius: 12px;">
      <h2 style="color: #12372A; border-bottom: 2px solid #C49A5A; padding-bottom: 8px;">Admin Dashboard Update Alert</h2>
      <p>Dear Investor,</p>
      <p>This is a test email confirming that updates made by the administrator in the Admin Dashboard automatically dispatch email notifications to your inbox.</p>
      <div style="background-color: #FFFFFF; border-left: 4px solid #C49A5A; padding: 12px 16px; margin: 16px 0;">
        <p style="margin: 0; font-weight: bold;">Status: Active & Verified</p>
        <p style="margin: 4px 0 0 0; color: #555;">All admin updates (Land Plots, Plantation Growth Reports, Documents, Payments, and Investments) are live.</p>
      </div>
      <p>Regards,<br/><strong>Chandhan Nilayam Investments</strong></p>
    </div>
    `
  );
  console.log('Result:', res);
}

testEmail()
  .catch(console.error)
  .finally(() => process.exit(0));
