import { db } from '../config/database';

async function main() {
  console.log('🧪 Inspecting all investor profiles in database...');
  const investors = await db.investorProfile.findMany({
    include: {
      user: true,
      landPlots: true,
      investments: true,
      payments: true
    }
  });

  console.log(`Total investor profiles: ${investors.length}`);
  for (const inv of investors) {
    console.log(`\nName: ${inv.full_name}`);
    console.log(`- ID: ${inv.id}`);
    console.log(`- Email: ${inv.email}`);
    console.log(`- User ID: ${inv.user_id}`);
    console.log(`- LandPlots assigned: ${inv.landPlots.length}`);
    console.log(`- Investments: ${inv.investments.length}`);
    console.log(`- Payments: ${inv.payments.length}`);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
