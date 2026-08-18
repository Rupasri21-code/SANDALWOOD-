import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function listDomainsAndTest() {
  const key = process.env.RESEND_API_KEY;
  console.log('🔑 Testing with Key:', key ? key.substring(0, 10) + '...' : 'NONE');

  if (!key) return;

  const resend = new Resend(key);

  console.log('\n--- 1. Listing Domains on Resend Account ---');
  try {
    const domains = await resend.domains.list();
    console.log('Domains list output:', JSON.stringify(domains, null, 2));
  } catch (err: any) {
    console.error('Failed to list domains:', err.message || err);
  }

  console.log('\n--- 2. Trying Test Email Dispatch ---');
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['rupasrigopidesi33@gmail.com'],
      subject: 'Resend Test Email',
      html: '<p>Testing resend</p>'
    });
    console.log('Result Data:', data);
    console.log('Result Error:', error);
  } catch (err: any) {
    console.error('Send Error:', err.message || err);
  }
}

listDomainsAndTest()
  .catch(console.error)
  .finally(() => process.exit(0));
