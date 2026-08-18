const path = require('path');
const dotenv = require('c:\\Users\\RupasriGopidesi\\OneDrive\\Desktop\\SANDLEWOOD\\backend\\node_modules\\dotenv');

console.log('--- Raw process.env before dotenv ---');
printUrl(process.env.DATABASE_URL);

const dotenvPath = 'c:\\Users\\RupasriGopidesi\\OneDrive\\Desktop\\SANDLEWOOD\\backend\\.env';
console.log('Loading dotenv from:', dotenvPath);
const result = dotenv.config({ path: dotenvPath });
if (result.error) {
  console.log('dotenv load error:', result.error);
}

console.log('--- process.env after dotenv ---');
printUrl(process.env.DATABASE_URL);

function printUrl(url) {
  if (!url) {
    console.log('DATABASE_URL is undefined');
    return;
  }
  try {
    const parsed = new URL(url);
    console.log({
      protocol: parsed.protocol,
      host: parsed.host,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
      search: parsed.search,
    });
  } catch (err) {
    const masked = url.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
    console.log('Masked raw:', masked);
  }
}
