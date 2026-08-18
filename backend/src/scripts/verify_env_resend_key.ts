import { Resend } from 'resend';
import { env } from '../config/env';

async function checkEnvKey() {
  const key = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  console.log('🔍 Checking RESEND_API_KEY from .env...');
  if (!key) {
    console.error('❌ RESEND_API_KEY is not set in .env');
    return;
  }
  console.log('Found Key in .env:', key.substring(0, 10) + '...');

  const resend = new Resend(key);
  try {
    const from = process.env.SMTP_FROM || 'Chandhan Nilayam Investments <noreply@chandannilayam.com>';
    console.log(`📤 Testing send from: ${from} to: rupasrigopidesi33@gmail.com`);

    const { data, error } = await resend.emails.send({
      from,
      to: ['rupasrigopidesi33@gmail.com'],
      subject: 'Verified Domain Test - Chandhan Nilayam',
      html: '<h1>Verified Domain Active!</h1><p>Your verified Resend API Key is working perfectly!</p>'
    });

    if (error) {
      console.log('⚠️ Primary From Address Error:', error);
      console.log('🔄 Retrying with onboarding@resend.dev...');
      const retry = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ['rupasrigopidesi33@gmail.com'],
        subject: 'Resend API Key Test (Onboarding)',
        html: '<p>Testing Key via onboarding@resend.dev</p>'
      });
      console.log('Retry Data:', retry.data);
      console.log('Retry Error:', retry.error);
    } else {
      console.log('🎉 SUCCESS! Resend Data:', data);
    }
  } catch (err: any) {
    console.error('❌ SDK Error:', err.message || err);
  }
}

checkEnvKey()
  .catch(console.error)
  .finally(() => process.exit(0));
