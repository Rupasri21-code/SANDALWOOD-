import { sendEmail } from '../services/email.service';

async function testMultipleRecipients() {
  const testEmails = [
    'rupasrigopidesi33@gmail.com',
    'navya.lakku@gmail.com',
    'investor@gmail.com',
    'sanjana.garnepudi@gmail.com',
    'hema.gopidesi@gmail.com'
  ];

  console.log('🧪 Testing Resend dispatch to multiple real investor email addresses...\n');

  for (const email of testEmails) {
    console.log(`📤 Sending test email to: ${email}...`);
    const res = await sendEmail(
      email,
      'Chandhan Nilayam - Investor Notification Test',
      `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #12372A; background-color: #F7F0E4; border-radius: 12px;">
        <h2 style="color: #12372A; border-bottom: 2px solid #C49A5A; padding-bottom: 8px;">Chandhan Nilayam Investments</h2>
        <p>Dear Valued Investor,</p>
        <p>This is an automated notification testing multi-investor email delivery using verified domain <strong>chandhannilayam.com</strong>.</p>
        <p>Regards,<br/><strong>Chandhan Nilayam Team</strong></p>
      </div>
      `
    );
    console.log(`Response for ${email}:`, res, '\n');
  }
}

testMultipleRecipients()
  .catch(console.error)
  .finally(() => process.exit(0));
