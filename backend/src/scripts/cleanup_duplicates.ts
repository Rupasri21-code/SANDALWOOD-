import { db } from '../config/database';

async function mergeAndCleanup(duplicateEmail: string, properEmail: string) {
  console.log(`\n========================================`);
  console.log(`Merging [${duplicateEmail}] -> [${properEmail}]...`);
  
  // Find profiles
  const duplicateProfile = await db.investorProfile.findUnique({
    where: { email: duplicateEmail }
  });
  const properProfile = await db.investorProfile.findUnique({
    where: { email: properEmail }
  });

  if (!duplicateProfile) {
    console.log(`⚠️ Duplicate profile [${duplicateEmail}] not found. Skipping.`);
    return;
  }
  if (!properProfile) {
    console.log(`⚠️ Proper profile [${properEmail}] not found. Skipping.`);
    return;
  }

  console.log(`- Duplicate Profile ID: ${duplicateProfile.id}, User ID: ${duplicateProfile.user_id}`);
  console.log(`- Proper Profile ID: ${properProfile.id}, User ID: ${properProfile.user_id}`);

  // Update landPlots
  const updatedPlots = await db.landPlot.updateMany({
    where: { investor_id: duplicateProfile.id },
    data: { investor_id: properProfile.id }
  });
  console.log(`- Moved ${updatedPlots.count} land plots.`);

  // Update investments
  const updatedInvestments = await db.investment.updateMany({
    where: { investor_id: duplicateProfile.id },
    data: { investor_id: properProfile.id }
  });
  console.log(`- Moved ${updatedInvestments.count} investments.`);

  // Update payments
  const updatedPayments = await db.payment.updateMany({
    where: { investor_id: duplicateProfile.id },
    data: { investor_id: properProfile.id }
  });
  console.log(`- Moved ${updatedPayments.count} payments.`);

  // Update media
  const updatedMedia = await db.media.updateMany({
    where: { investor_id: duplicateProfile.id },
    data: { investor_id: properProfile.id }
  });
  console.log(`- Moved ${updatedMedia.count} media items.`);

  // Update documents
  const updatedDocs = await db.document.updateMany({
    where: { investor_id: duplicateProfile.id },
    data: { investor_id: properProfile.id }
  });
  console.log(`- Moved ${updatedDocs.count} documents.`);

  // Update notifications
  if (duplicateProfile.user_id && properProfile.user_id) {
    const updatedNotifs = await db.notification.updateMany({
      where: { recipient_id: duplicateProfile.user_id },
      data: { 
        recipient_id: properProfile.user_id,
        investor_id: properProfile.id
      }
    });
    console.log(`- Moved ${updatedNotifs.count} notifications.`);
  }

  // Delete duplicate profile
  await db.investorProfile.delete({
    where: { id: duplicateProfile.id }
  });
  console.log(`- Deleted duplicate investor profile.`);

  // Delete duplicate user
  if (duplicateProfile.user_id) {
    try {
      await db.user.delete({
        where: { id: duplicateProfile.user_id }
      });
      console.log(`- Deleted duplicate user account.`);
    } catch (e: any) {
      console.error(`- Failed to delete user: ${e.message}`);
    }
  }
  
  console.log(`✅ Merge of [${duplicateEmail}] into [${properEmail}] completed successfully!`);
}

async function main() {
  console.log('🚀 Starting Database Investor Profile Cleanup...');
  
  // 1. Rajitha Nathani: Merge gopidesirupasri8@gmail.com into rajitha.nathani@gmail.com
  await mergeAndCleanup('gopidesirupasri8@gmail.com', 'rajitha.nathani@gmail.com');

  // 2. Sanjana Garnepudi: Merge garnepudisanjana@gmail.com into sanjana.garnepudi@gmail.com
  await mergeAndCleanup('garnepudisanjana@gmail.com', 'sanjana.garnepudi@gmail.com');

  // 3. Hema Gopidesi: Merge hema.gopidesi@gmail.com into rupasrigopidesi@gmail.com
  await mergeAndCleanup('hema.gopidesi@gmail.com', 'rupasrigopidesi@gmail.com');

  console.log('\n🎉 All duplicate profile cleaning operations completed!');
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
