import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Clear existing database
  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.investment.deleteMany({});
  await prisma.plantationUpdate.deleteMany({});
  await prisma.crop.deleteMany({});
  await prisma.landPlot.deleteMany({});
  await prisma.investorProfile.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.galleryItem.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Passwords
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const customerPasswordHash = await bcrypt.hash('Investor@123', 10);

  // 3. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@sandalwood.com',
      username: 'admin',
      password: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'investor@gmail.com',
      username: 'investor',
      password: customerPasswordHash,
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Users created.');

  // 4. Create Admin and Customer Profiles
  const adminProfile = await prisma.investorProfile.create({
    data: {
      user_id: adminUser.id,
      first_name: 'Chandan',
      last_name: 'Nilayam',
      full_name: 'Chandan Nilayam Administrator',
      email: 'admin@sandalwood.com',
      phone: '+91 98765 43210',
      address_line1: '42, Green Valley Estate, Mysore Road',
      district: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      id_type: 'PAN',
      id_number: 'ABCDE1234F',
      status: 'ACTIVE',
      notes: 'Super Admin Account',
    },
  });

  const investorProfile = await prisma.investorProfile.create({
    data: {
      user_id: customerUser.id,
      first_name: 'Rajesh',
      last_name: 'Patel',
      full_name: 'Rajesh Patel',
      email: 'investor@gmail.com',
      phone: '+91 98989 89898',
      address_line1: '702, Highrise Apartments, SG Road',
      district: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      id_type: 'AADHAAR',
      id_number: '123456789012',
      status: 'ACTIVE',
      notes: 'High-net-worth individual interested in multiple plots.',
    },
  });

  console.log('✅ Customer Profiles created.');

  // 5. Create Premium Land Plots (Dornala area)
  const plot1 = await prisma.landPlot.create({
    data: {
      investor_id: investorProfile.id,
      title: 'Dornala Valley Phase 1 - Plot 405',
      description: 'Premium red-soil plot high in organic matter, ideal for Santalum album development. Features drip irrigation and security access.',
      location: 'Dornala, Near Srisailam Highway',
      district: 'Prakasam',
      state: 'Andhra Pradesh',
      survey_number: '84/A/2',
      total_area: 0.5,
      unit: 'Acres',
      latitude: 15.9012,
      longitude: 79.1234,
      purchase_date: new Date('2024-05-10'),
      purchase_price: 1200000,
      current_value: 1450000,
      status: 'SOLD',
      images: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600,https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=600',
      documents: 'Sale_Deed_Plot405.pdf,EC_Plot405.pdf',
    },
  });

  const plot2 = await prisma.landPlot.create({
    data: {
      title: 'Dornala Valley Phase 1 - Plot 406',
      description: 'Excellent red soil plantation block with direct road access and underground water line pipeline connections.',
      location: 'Dornala, Near Srisailam Highway',
      district: 'Prakasam',
      state: 'Andhra Pradesh',
      survey_number: '84/A/3',
      total_area: 0.5,
      unit: 'Acres',
      purchase_price: 1250000,
      current_value: 1250000,
      status: 'AVAILABLE',
      images: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
    },
  });

  console.log('✅ Land Plots created.');

  // 6. Create Crops (Sandalwood Saplings)
  const crop = await prisma.crop.create({
    data: {
      land_id: plot1.id,
      name: 'East Indian Sandalwood',
      variety: 'Santalum Album (Grade A)',
      planted_date: new Date('2024-06-15'),
      total_plants: 120,
      surviving_plants: 118,
      growth_stage: 'SAPLING',
      expected_harvest_date: new Date('2039-06-15'),
      height_avg: 1.8, // in meters
      health_status: 'EXCELLENT',
      notes: 'Initial sapling survival rate is excellent. Highly responsive to drip fertigation.',
    },
  });

  console.log('✅ Crops created.');

  // 7. Create Investment Contract
  const investment = await prisma.investment.create({
    data: {
      investor_id: investorProfile.id,
      land_id: plot1.id,
      investment_type: 'Sandalwood Managed Plot',
      amount: 1200000,
      currency: 'INR',
      investment_date: new Date('2024-05-10'),
      maturity_date: new Date('2039-05-10'),
      expected_returns: 9600000, // 8x capital appreciation
      roi_percentage: 18.5,
      status: 'ACTIVE',
      contract_number: 'AV-DOR-2024-405',
      notes: 'Managed plantation service included. High yield projection.',
    },
  });

  console.log('✅ Investments created.');

  // 8. Create Payment Records
  await prisma.payment.create({
    data: {
      investment_id: investment.id,
      investor_id: investorProfile.id,
      amount: 1200000,
      currency: 'INR',
      payment_type: 'Down Payment',
      payment_method: 'NEFT Transfer',
      transaction_id: 'TXN84917491024',
      payment_date: new Date('2024-05-10'),
      status: 'COMPLETED',
      notes: 'Received full plot cost down payment.',
    },
  });

  console.log('✅ Payments created.');

  // 9. Create Plantation Updates
  const update = await prisma.plantationUpdate.create({
    data: {
      crop_id: crop.id,
      land_id: plot1.id,
      update_type: 'Fertigation & Growth Check',
      title: 'Quarterly Maintenance and Growth Report',
      description: 'All 118 surviving saplings have shown an average height increase of 15cm this quarter. Bio-fertilizer application and weed clearing are fully completed. Soil health indicators are pristine.',
      images: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
      recorded_by: 'Dr. A. K. Raju (Chief Agronomist)',
      update_date: new Date('2026-05-01'),
    },
  });

  console.log('✅ Plantation Updates created.');

  // 10. Create Notification
  await prisma.notification.create({
    data: {
      recipient_id: customerUser.id,
      investor_id: investorProfile.id,
      title: 'New Plantation Growth Update',
      message: 'Chief Agronomist has posted the quarterly growth report for Plot 405. Average height is now 1.8m!',
      type: 'UPDATE',
      link: `/portal/plantation`,
      is_read: false,
    },
  });

  // 11. Create Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Rajesh Patel',
        location: 'Ahmedabad, Gujarat',
        text: "I invested in Arbor Vest 2 years ago. The transparency of the investor portal and direct agronomical reports gave me absolute peace of mind. My plots are growing exceptionally well.",
        rating: 5,
        image_url: 'https://images.pexels.com/photos/8937582/pexels-photo-8937582.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
      {
        name: 'Priya Krishnamurthy',
        location: 'Chennai, Tamil Nadu',
        text: "The dedicated customer portal is standard-setting. Having single-point access to view soil reports, sapling health indicators, and payment logs is truly luxury land investment.",
        rating: 5,
        image_url: 'https://images.pexels.com/photos/3777567/pexels-photo-3777567.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
      {
        name: 'Amit Sharma',
        location: 'Mumbai, Maharashtra',
        text: "Sandalwood offers stellar physical asset hedging. Arbor Vest's complete managed services take care of land clearance, plantation, legal checks, and growth tracking seamlessly.",
        rating: 5,
        image_url: 'https://images.pexels.com/photos/9363120/pexels-photo-9363120.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
    ],
  });

  // 12. Create Gallery Items
  await prisma.galleryItem.createMany({
    data: [
      {
        title: 'Sandalwood Rows at Dawn',
        category: 'Land',
        image_url: 'https://images.pexels.com/photos/32849312/pexels-photo-32849312.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'Pristine landscape view of our managed estate near Dornala.',
      },
      {
        title: 'Healthy Sandalwood Leaves',
        category: 'Leaves',
        image_url: 'https://images.pexels.com/photos/15124451/pexels-photo-15124451.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'Rich dark green leaves exhibiting excellent health and vigor.',
      },
      {
        title: 'Sandalwood logs ready for oil extraction',
        category: 'Crop growth',
        image_url: 'https://images.pexels.com/photos/17052523/pexels-photo-17052523.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'Matured logs showcase high concentration of core heartwood.',
      },
    ],
  });

  // 13. Create Inquiry
  await prisma.inquiry.create({
    data: {
      full_name: 'Suresh Kumar',
      email: 'suresh.k@gmail.com',
      phone: '+91 99999 88888',
      investment_interest: 'Multiple Plot Ownership',
      budget_range: '₹25 Lakhs - ₹50 Lakhs',
      plot_size: '1.0 - 2.0 Acres',
      message: 'Please send across the detailed brochure and investment prospectus for the Dornala Valley project.',
      status: 'NEW',
    },
  });

  console.log('✅ Seed Data completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
