const app = require('c:\\Users\\RupasriGopidesi\\OneDrive\\Desktop\\SANDLEWOOD\\backend\\dist\\app');
const { db } = require('c:\\Users\\RupasriGopidesi\\OneDrive\\Desktop\\SANDLEWOOD\\backend\\dist\\config\\database');
const env = require('c:\\Users\\RupasriGopidesi\\OneDrive\\Desktop\\SANDLEWOOD\\backend\\dist\\config\\env');

db.$connect()
  .then(() => {
    console.log('Connected successfully with wrong order!');
  })
  .catch(err => {
    console.error('Failed to connect with wrong order:', err.message);
  })
  .finally(() => db.$disconnect());
