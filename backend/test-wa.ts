import { env } from './src/config/env';

async function test() {
  try {
    const client = require('twilio')(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    const message = await client.messages('SM22a45050b3789215d2c77578c80413ab').fetch();
    console.log('Message Status:', message.status, message.errorMessage);
  } catch (e) {
    console.error('Failed:', e);
  }
}
test();
