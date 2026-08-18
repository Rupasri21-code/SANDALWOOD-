import { db } from '../config/database';

async function main() {
  console.log('🧪 Checking details of Rajitha Nathani profiles...');

  const profiles = await db.investorProfile.findMany({
    where: {
      full_name: { contains: 'Rajitha', mode: 'insensitive' }
    },
    include: {
      user: true,
      landPlots: true,
      investments: true,
      payments: true
    }
  });

  for (const p of profiles) {
    console.log(`\n========================================`);
    console.log(`Profile Name: ${p.full_name}`);
    console.log(`Profile ID: ${p.id}`);
    console.log(`Email: ${p.email}`);
    console.log(`User ID: ${p.user_id}`);
    console.log(`User Table Email: ${p.user?.email || 'None'}`);
    
    console.log(`Plots (${p.landPlots.length}):`);
    for (const plot of p.landPlots) {
      console.log(`- Plot ID: ${plot.id}, Name: ${plot.title}, Location: ${plot.location}`);
    }

    console.log(`Investments (${p.investments.length}):`);
    for (const inv of p.investments) {
      console.log(`- Inv ID: ${inv.id}, Amount: ${inv.amount}, Status: ${inv.status}`);
    }

    console.log(`Payments (${p.payments.length}):`);
    for (const pm of p.payments) {
      console.log(`- PM ID: ${pm.id}, Amount: ${pm.amount}, Status: ${pm.status}, Method: ${pm.payment_method}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
