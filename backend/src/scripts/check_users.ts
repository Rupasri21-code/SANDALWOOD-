import { db } from '../config/database';

async function main() {
  const allInvestors = await db.investorProfile.findMany();
  console.log('=== ALL INVESTORS (' + allInvestors.length + ') ===');
  for (const inv of allInvestors) {
    console.log(`ID: ${inv.id}, FullName: ${inv.full_name}, Email: ${inv.email}, Phone: ${inv.phone}, UserId: ${inv.user_id}`);
  }
}

main()
  .catch((err) => console.error(err))
  .finally(() => process.exit(0));
