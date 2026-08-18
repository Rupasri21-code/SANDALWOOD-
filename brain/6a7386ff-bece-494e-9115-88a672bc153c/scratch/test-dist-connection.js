const env = require('c:\\Users\\RupasriGopidesi\\OneDrive\\Desktop\\SANDLEWOOD\\backend\\dist\\config\\env');
const { db } = require('c:\\Users\\RupasriGopidesi\\OneDrive\\Desktop\\SANDLEWOOD\\backend\\dist\\config\\database');

console.log('Env loaded:', !!env.env);
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

db.$connect()
  .then(() => {
    console.log('Success connecting to DB from dist/config/database');
  })
  .catch(err => {
    console.error('Error connecting to DB from dist/config/database:', err);
  })
  .finally(() => db.$disconnect());
