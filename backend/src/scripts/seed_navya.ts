import { db } from '../config/database';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'navya.lakku@gmail.com';
  const username = 'navya.lakku';
  const plainPassword = 'Navya@123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 1. Check or create User record
  let user = await db.user.findFirst({
    where: {
      OR: [
        { email: { equals: email, mode: 'insensitive' } },
        { username: { equals: username, mode: 'insensitive' } }
      ]
    }
  });

  if (!user) {
    user = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: 'INVESTOR'
      }
    });
    console.log('✅ Created User record for Navya Lakku:', user.id);
  } else {
    user = await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        username,
        email
      }
    });
    console.log('✅ Updated User password for Navya Lakku:', user.id);
  }

  // 2. Check or create InvestorProfile
  let profile = await db.investorProfile.findFirst({
    where: {
      OR: [
        { email: { equals: email, mode: 'insensitive' } },
        { user_id: user.id }
      ]
    }
  });

  if (!profile) {
    profile = await db.investorProfile.create({
      data: {
        user_id: user.id,
        first_name: 'Navya',
        last_name: 'Lakku',
        full_name: 'Navya Lakku',
        email,
        phone: '+91 98765 43211',
        address_line1: 'Chandhan Nilayam Estates, Plot 88',
        district: 'Prakasam',
        state: 'Andhra Pradesh',
        country: 'India',
        status: 'ACTIVE',
        investor_type: 'Individual'
      }
    });
    console.log('✅ Created InvestorProfile for Navya Lakku:', profile.id);
  } else {
    if (!profile.user_id) {
      await db.investorProfile.update({
        where: { id: profile.id },
        data: { user_id: user.id }
      });
      console.log('✅ Linked existing InvestorProfile for Navya Lakku');
    }
  }

  console.log('🎉 Navya Lakku account ready with username "navya.lakku" and password "Navya@123"!');
}

main()
  .catch((err) => console.error('❌ Error seeding Navya account:', err))
  .finally(() => process.exit(0));
