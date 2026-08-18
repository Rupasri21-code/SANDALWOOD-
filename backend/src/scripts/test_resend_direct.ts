import { Resend } from 'resend';
import { env } from '../config/env';

async function testDirectKey() {
  const key = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  if (!key) {
    console.error('❌ RESEND_API_KEY is not defined in env');
    return;
  }
  console.log('Testing Key directly via SDK:', key.substring(0, 10) + '...');
  
  const resend = new Resend(key);
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'delivered@resend.dev',
      subject: 'Resend SDK Direct Test',
      html: '<p>Direct test</p>'
    });
    console.log('SDK Response Data:', data);
    console.log('SDK Response Error:', error);
  } catch (err: any) {
    console.error('SDK Exception:', err.message || err);
  }

  console.log('\nTesting Key directly via HTTP fetch to Resend REST API...');
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['delivered@resend.dev'],
        subject: 'HTTP Fetch Direct Test',
        html: '<p>HTTP test</p>'
      })
    });
    const status = res.status;
    const body = await res.json();
    console.log('HTTP Status:', status);
    console.log('HTTP Body:', JSON.stringify(body, null, 2));
  } catch (err: any) {
    console.error('HTTP Exception:', err.message || err);
  }
}

testDirectKey();
