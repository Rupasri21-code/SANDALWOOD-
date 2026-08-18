

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('--- Mail Environment Variable Key Names Check ---');
const keys = Object.keys(process.env).filter(
  (k) =>
    k.toLowerCase().includes('mail') ||
    k.toLowerCase().includes('smtp') ||
    k.toLowerCase().includes('resend') ||
    k.toLowerCase().includes('api_key')
);

for (const k of keys) {
  const val = process.env[k];
  console.log(`Key: "${k}" | Configured: ${Boolean(val)} | Length: ${val ? val.length : 0}`);
}
