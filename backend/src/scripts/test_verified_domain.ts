import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testVerifiedDomainSend() {
  const key = process.env.RESEND_API_KEY;
  const resend = new Resend(key);

  const fromAddresses = [
    'Chandhan Nilayam Investments <noreply@chandhannilayam.com>',
    'Chandhan Nilayam <info@chandhannilayam.com>',
    'invest@chandhannilayam.com',
  ];

  for (const from of fromAddresses) {
    console.log(`\n📤 Testing send from verified domain: "${from}" to: rupasrigopidesi33@gmail.com`);
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: ['rupasrigopidesi33@gmail.com'],
        subject: 'Verified Domain Live Test - Chandhan Nilayam',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #12372A; background-color: #F7F0E4; border-radius: 12px;">
            <h2 style="color: #12372A; border-bottom: 2px solid #C49A5A; padding-bottom: 8px;">Chandhan Nilayam Investments</h2>
            <p>Dear Investor,</p>
            <p>This is a live test email sent using your verified domain <strong>chandhannilayam.com</strong> via Resend API.</p>
            <p>Admin notifications will now deliver directly to all investor email inboxes!</p>
          </div>
        `
      });

      if (error) {
        console.error('❌ Error for', from, ':', error);
      } else {
        console.log('🎉 SUCCESS! Message ID:', data?.id);
      }
    } catch (err: any) {
      console.error('❌ SDK Exception:', err.message || err);
    }
  }
}

testVerifiedDomainSend()
  .catch(console.error)
  .finally(() => process.exit(0));
