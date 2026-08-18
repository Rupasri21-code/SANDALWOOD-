import { db } from '../config/database';

async function main() {
  console.log('🧪 Querying profiles and users for Rajitha...');

  const profiles = await db.investorProfile.findMany({
    where: {
      OR: [
        { email: { contains: 'gopidesirupasri8@gmail.com', mode: 'insensitive' } },
        { full_name: { contains: 'Rajitha', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`Found ${profiles.length} investor profiles:`);
  for (const p of profiles) {
    console.log(`- ID: ${p.id}, Name: ${p.full_name}, Email: ${p.email}, User ID: ${p.user_id}`);
  }

  const users = await db.user.findMany({
    where: {
      email: { contains: 'gopidesirupasri8@gmail.com', mode: 'insensitive' }
    }
  });

  console.log(`\nFound ${users.length} user records:`);
  for (const u of users) {
    console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}`);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
