require('dotenv').config();
const twilio = require('twilio');

async function testWhatsApp() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error('❌ Missing Twilio environment variables in .env');
    process.exit(1);
  }

  console.log(`🔄 Initializing Twilio with account SID: ${accountSid}`);
  const client = twilio(accountSid, authToken);

  try {
    // We will send a test message to a verified number.
    // NOTE: In the Twilio Sandbox, you must first send a message like "join <sandbox-keyword>"
    // to the sandbox number from your WhatsApp account before it can receive messages.
    
    // For this test script, you need to provide your personal WhatsApp number below
    // in E.164 format (e.g. 'whatsapp:+12345678900')
    const toTestNumber = 'whatsapp:+12345678900'; // REPLACE THIS WITH YOUR NUMBER

    console.log(`🚀 Sending test message from ${fromNumber} to ${toTestNumber}...`);
    
    const message = await client.messages.create({
      body: 'Hello from Chandhan Nilayam Investments! This is a test WhatsApp message to verify the Twilio setup.',
      from: fromNumber,
      to: toTestNumber,
    });

    console.log('✅ Message sent successfully!');
    console.log(`📝 Message SID: ${message.sid}`);
    console.log(`📊 Status: ${message.status}`);
  } catch (error) {
    console.error('❌ Failed to send WhatsApp message:');
    console.error(error.message);
    if (error.code) {
      console.error(`Error Code: ${error.code}`);
      console.error(`More Info: https://www.twilio.com/docs/api/errors/${error.code}`);
    }
  }
}

testWhatsApp();
