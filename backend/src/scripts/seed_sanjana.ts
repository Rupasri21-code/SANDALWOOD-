import { db } from '../config/database';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'sanjana.garnepudi@gmail.com';
  const username = 'sanjana.garnepudi';
  const plainPassword = 'Sanjana@123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 1. Check if user exists by username or email
  let existingUser = await db.user.findFirst({
    where: {
      OR: [
        { email: { equals: email, mode: 'insensitive' } },
        { username: { equals: username, mode: 'insensitive' } }
      ]
    }
  });

  if (!existingUser) {
    existingUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: 'INVESTOR'
      }
    });
    console.log('✅ Created User record for Sanjana Garnepudi:', existingUser.id);
  } else {
    // Update password to Sanjana@123
    existingUser = await db.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
        username,
        email
      }
    });
    console.log('✅ Updated User password for Sanjana Garnepudi:', existingUser.id);
  }

  // 2. Check or create InvestorProfile
  let profile = await db.investorProfile.findFirst({
    where: {
      OR: [
        { email: { equals: email, mode: 'insensitive' } },
        { user_id: existingUser.id }
      ]
    }
  });

  if (!profile) {
    profile = await db.investorProfile.create({
      data: {
        user_id: existingUser.id,
        first_name: 'Sanjana',
        last_name: 'Garnepudi',
        full_name: 'Sanjana Garnepudi',
        email,
        phone: '+91 98765 12345',
        address_line1: 'Chandhan Nilayam Estates, Plot 45',
        district: 'Prakasam',
        state: 'Andhra Pradesh',
        country: 'India',
        status: 'ACTIVE',
        investor_type: 'Individual'
      }
    });
    console.log('✅ Created InvestorProfile for Sanjana Garnepudi:', profile.id);
  } else {
    if (!profile.user_id) {
      await db.investorProfile.update({
        where: { id: profile.id },
        data: { user_id: existingUser.id }
      });
      console.log('✅ Linked existing InvestorProfile to User for Sanjana Garnepudi');
    }
  }

  console.log('🎉 Sanjana Garnepudi account ready with username "sanjana.garnepudi" and password "Sanjana@123"!');
}

main()
  .catch((err) => console.error('❌ Error seeding Sanjana account:', err))
  .finally(() => process.exit(0));
