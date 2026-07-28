import { db } from '../config/database';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🔄 Checking all InvestorProfiles and syncing User accounts...');

  const investors = await db.investorProfile.findMany({
    include: { user: true }
  });

  const defaultPassword = await bcrypt.hash('Investor@123', 10);
  const sanjanaPassword = await bcrypt.hash('Sanjana@123', 10);

  const credentialsList: Array<{ name: string; email: string; username: string; defaultPass: string }> = [];

  for (const inv of investors) {
    let user = inv.user;

    // Check if user exists by email or phone
    if (!user) {
      user = await db.user.findFirst({
        where: {
          OR: [
            { email: { equals: inv.email, mode: 'insensitive' } },
            { username: { equals: inv.email.split('@')[0], mode: 'insensitive' } }
          ]
        }
      });
    }

    const isSanjana = inv.email.toLowerCase().includes('sanjana') || inv.full_name.toLowerCase().includes('sanjana');
    const passToUse = isSanjana ? sanjanaPassword : defaultPassword;
    const plainPass = isSanjana ? 'Sanjana@123' : 'Investor@123';
    const username = inv.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g, '');

    if (!user) {
      user = await db.user.create({
        data: {
          email: inv.email.toLowerCase(),
          username: username,
          password: passToUse,
          role: 'INVESTOR'
        }
      });
      console.log(`✅ Created User account for ${inv.full_name} (${inv.email})`);
    } else {
      // Ensure role is INVESTOR if not ADMIN
      if (user.role !== 'ADMIN') {
        await db.user.update({
          where: { id: user.id },
          data: {
            role: 'INVESTOR',
            password: passToUse
          }
        });
      }
    }

    // Link investor profile
    if (inv.user_id !== user.id) {
      await db.investorProfile.update({
        where: { id: inv.id },
        data: { user_id: user.id }
      });
      console.log(`🔗 Linked InvestorProfile for ${inv.full_name} to User ID ${user.id}`);
    }

    credentialsList.push({
      name: inv.full_name,
      email: inv.email,
      username: user.username,
      defaultPass: plainPass
    });
  }

  console.log('\n=== ALL INVESTOR PORTAL CREDENTIALS ===');
  console.table(credentialsList);
}

main()
  .catch((err) => console.error('❌ Sync error:', err))
  .finally(() => process.exit(0));
