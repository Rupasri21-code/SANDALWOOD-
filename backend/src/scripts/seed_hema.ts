import { db } from '../config/database';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'hema.gopidesi@gmail.com';
  const username = 'hema.gopidesi';
  const plainPassword = 'Ht#5900@766';
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
    console.log('✅ Created User record for Hema Gopidesi:', user.id);
  } else {
    user = await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        username,
        email
      }
    });
    console.log('✅ Updated User password for Hema Gopidesi:', user.id);
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
        first_name: 'Hema',
        last_name: 'Gopidesi',
        full_name: 'Hema Gopidesi',
        email,
        phone: '+91 98765 43213',
        address_line1: 'Chandhan Nilayam Estates, Plot 02',
        district: 'Prakasam',
        state: 'Andhra Pradesh',
        country: 'India',
        status: 'ACTIVE',
        investor_type: 'Individual'
      }
    });
    console.log('✅ Created InvestorProfile for Hema Gopidesi:', profile.id);
  } else {
    if (!profile.user_id) {
      await db.investorProfile.update({
        where: { id: profile.id },
        data: { user_id: user.id }
      });
      console.log('✅ Linked existing InvestorProfile for Hema Gopidesi');
    }
  }

  console.log('🎉 Hema Gopidesi account ready with username "hema.gopidesi" and password "Ht#5900@766"!');
}

main()
  .catch((err) => console.error('❌ Error seeding Hema account:', err))
  .finally(() => process.exit(0));
