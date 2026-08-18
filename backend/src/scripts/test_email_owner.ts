import { sendEmail } from '../services/email.service';

async function testEmailToOwner() {
  console.log('🧪 Testing Email dispatch directly to Resend account owner (chandhannilayam@gmail.com)...');
  const res = await sendEmail(
    'chandhannilayam@gmail.com',
    'Chandhan Nilayam - Direct Email Alert',
    `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #12372A; background-color: #F7F0E4; border-radius: 12px;">
      <h2 style="color: #12372A; border-bottom: 2px solid #C49A5A; padding-bottom: 8px;">Admin Dashboard Update Alert</h2>
      <p>Dear Investor,</p>
      <p>This is an automated notification confirming that admin updates trigger instant email dispatches.</p>
    </div>
    `
  );
  console.log('Result:', res);
}

testEmailToOwner()
  .catch(console.error)
  .finally(() => process.exit(0));
