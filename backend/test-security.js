const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

const prisma = new PrismaClient();

// Helper to sign mock tokens
function signToken(userId, role, expired = false) {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'secret';
  return jwt.sign(
    { id: userId, role, type: 'access' },
    secret,
    { expiresIn: expired ? '-1s' : '1h' }
  );
}

async function testSecurity() {
  console.log('🧪 Starting Comprehensive Security Verification Suite...\n');

  // 1. Database Connection & Seed Validation
  let investorA, investorB, adminUser;
  try {
    // Clean up test records
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['non-existent-user@gmail.com', 'or11@gmail.com', "' OR '1'='1@gmail.com"]
        }
      }
    });

    // Find or create Admin
    adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!adminUser) {
      const safeAdminHash = await bcrypt.hash('AdminPass123!', 10);
      adminUser = await prisma.user.create({
        data: {
          email: 'admin_test_sec@sandalwood.com',
          username: 'admin_test_sec',
          password: safeAdminHash,
          role: 'ADMIN',
        }
      });
    }

    // Find or create Investor A
    let userA = await prisma.user.findFirst({ where: { role: 'INVESTOR', email: 'investora@test.com' } });
    if (!userA) {
      const safeHash = await bcrypt.hash('correctpassword123', 10);
      userA = await prisma.user.create({
        data: {
          email: 'investora@test.com',
          username: 'investora',
          password: safeHash,
          role: 'INVESTOR',
        },
      });
    }

    investorA = await prisma.investorProfile.findUnique({ where: { user_id: userA.id } });
    if (!investorA) {
      investorA = await prisma.investorProfile.create({
        data: {
          user_id: userA.id,
          first_name: 'Investor',
          last_name: 'A',
          full_name: 'Investor A',
          email: 'investora@test.com',
          phone: '+91 99999 11111',
          address_line1: 'Estate A',
          state: 'AP',
          country: 'India',
        },
      });
    }

    // Find or create Investor B
    let userB = await prisma.user.findFirst({ where: { role: 'INVESTOR', email: 'investorb@test.com' } });
    if (!userB) {
      const safeHash = await bcrypt.hash('correctpassword123', 10);
      userB = await prisma.user.create({
        data: {
          email: 'investorb@test.com',
          username: 'investorb',
          password: safeHash,
          role: 'INVESTOR',
        },
      });
    }
    investorB = await prisma.investorProfile.findUnique({ where: { user_id: userB.id } });
    if (!investorB) {
      investorB = await prisma.investorProfile.create({
        data: {
          user_id: userB.id,
          first_name: 'Investor',
          last_name: 'B',
          full_name: 'Investor B',
          email: 'investorb@test.com',
          phone: '+91 99999 22222',
          address_line1: 'Estate B',
          state: 'AP',
          country: 'India',
        },
      });
    }

    console.log(`✅ Loaded Admin User: ${adminUser.email}`);
    console.log(`✅ Loaded Investor A: ${investorA.email}`);
    console.log(`✅ Loaded Investor B: ${investorB.email}`);
  } catch (err) {
    console.error('❌ Failed database setup:', err);
    process.exit(1);
  }

  // 2. Target resources for IDOR testing
  let landB, cropB, investmentB, paymentB, updateB, notificationB;
  try {
    landB = await prisma.landPlot.findFirst({ where: { investor_id: investorB.id } });
    if (!landB) {
      landB = await prisma.landPlot.create({
        data: {
          investor_id: investorB.id,
          title: 'Plot B',
          description: 'Plot B details',
          location: 'Dornala',
          district: 'Prakasam',
          state: 'AP',
          survey_number: 'SURB_123',
          total_area: 0.5,
          purchase_price: 100000,
          current_value: 120000,
        },
      });
    }

    cropB = await prisma.crop.findFirst({ where: { land_id: landB.id } });
    if (!cropB) {
      cropB = await prisma.crop.create({
        data: {
          land_id: landB.id,
          name: 'Sandalwood',
          variety: 'Red',
          total_plants: 100,
          surviving_plants: 98,
        },
      });
    }

    investmentB = await prisma.investment.findFirst({ where: { investor_id: investorB.id } });
    if (!investmentB) {
      investmentB = await prisma.investment.create({
        data: {
          investor_id: investorB.id,
          land_id: landB.id,
          investment_type: 'Sandalwood',
          amount: 100000,
          expected_returns: 150000,
          roi_percentage: 15,
          contract_number: 'CONB_123',
        },
      });
    }

    paymentB = await prisma.payment.findFirst({ where: { investor_id: investorB.id } });
    if (!paymentB) {
      paymentB = await prisma.payment.create({
        data: {
          investor_id: investorB.id,
          investment_id: investmentB.id,
          amount: 50000,
          payment_type: 'INSTALLMENT',
          payment_method: 'Bank Transfer',
          transaction_id: 'TXNB_99999',
        },
      });
    }

    updateB = await prisma.plantationUpdate.findFirst({ where: { land_id: landB.id } });
    if (!updateB) {
      updateB = await prisma.plantationUpdate.create({
        data: {
          land_id: landB.id,
          crop_id: cropB.id,
          update_type: 'Growth Check',
          title: 'Crop B Growth',
          description: 'Crops growing nicely',
        },
      });
    }

    notificationB = await prisma.notification.findFirst({ where: { recipient_id: investorB.user_id } });
    if (!notificationB) {
      notificationB = await prisma.notification.create({
        data: {
          recipient_id: investorB.user_id,
          investor_id: investorB.id,
          title: 'Notif B',
          message: 'Message for B',
        },
      });
    }
  } catch (err) {
    console.error('❌ Failed creating target resources:', err);
    process.exit(1);
  }

  // Tokens
  const adminToken = signToken(adminUser.id, 'ADMIN');
  const tokenA = signToken(investorA.user_id, 'INVESTOR');
  const tokenB = signToken(investorB.user_id, 'INVESTOR');
  const expiredToken = signToken(adminUser.id, 'ADMIN', true);

  // Server port detection
  let baseUrl = '';
  const ports = [5001, 5000, 5005];
  for (const port of ports) {
    try {
      const res = await axios.get(`http://localhost:${port}/`);
      if (res.status === 200) {
        baseUrl = `http://localhost:${port}/api/v1`;
        console.log(`✅ Server detected at http://localhost:${port}\n`);
        break;
      }
    } catch (e) {}
  }

  if (!baseUrl) {
    console.error('❌ No running API server found on ports 5000/5001. Start server with `npm start`.');
    process.exit(1);
  }

  let failedTestsCount = 0;

  async function assertStatus(name, promise, expectedStatus) {
    const expected = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    try {
      const res = await promise;
      if (expected.includes(res.status)) {
        console.log(`🟢 [PASS] ${name} (Status: ${res.status})`);
      } else {
        console.log(`🔴 [FAIL] ${name} (Got: ${res.status}, expected: ${expected.join('/')})`);
        failedTestsCount++;
      }
    } catch (err) {
      const status = err.response?.status;
      if (expected.includes(status)) {
        console.log(`🟢 [PASS] ${name} (Status: ${status})`);
      } else {
        console.log(`🔴 [FAIL] ${name} (Got: ${status || 'Error'}, expected: ${expected.join('/')})`);
        failedTestsCount++;
      }
    }
  }

  console.log('--- 1. Authentication & JWT Validation Tests ---');
  await assertStatus('No Token → 401 Unauthorized (GET /investors)', axios.get(`${baseUrl}/investors`), 401);
  await assertStatus('Malformed Token → 401 Unauthorized', axios.get(`${baseUrl}/investors`, { headers: { Authorization: 'Bearer malformed_xyz' } }), 401);
  await assertStatus('Invalid Token Signature → 401 Unauthorized', axios.get(`${baseUrl}/investors`, { headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.e30.invalid_sig' } }), 401);
  await assertStatus('Expired Token → 401 Unauthorized', axios.get(`${baseUrl}/investors`, { headers: { Authorization: `Bearer ${expiredToken}` } }), 401);

  console.log('\n--- 2. Role-Based Access Control (RBAC) Tests ---');
  await assertStatus('Investor Token on Admin Route → 403 Forbidden (GET /investors)', axios.get(`${baseUrl}/investors`, { headers: { Authorization: `Bearer ${tokenA}` } }), 403);
  await assertStatus('Investor Token on Admin Dashboard → 403 Forbidden (GET /dashboard/admin)', axios.get(`${baseUrl}/dashboard/admin`, { headers: { Authorization: `Bearer ${tokenA}` } }), 403);
  await assertStatus('Admin Token on Admin Route → 200 OK (GET /investors)', axios.get(`${baseUrl}/investors`, { headers: { Authorization: `Bearer ${adminToken}` } }), 200);

  console.log('\n--- 3. Authentication & Login Safety Tests ---');
  const userCountBefore = await prisma.user.count();
  
  // Note: Accept 401 (Unauthorized) or 429 (Rate Limited by Brute Force Protection) for repeated login attempts
  await assertStatus('SQL Injection Login Bypass (Username)', axios.post(`${baseUrl}/auth/login`, { identifier: "' OR '1'='1", password: "password123" }), [401, 429]);
  await assertStatus('SQL Injection Login Bypass (Password)', axios.post(`${baseUrl}/auth/login`, { identifier: "nonexistent@sandalwood.com", password: "' OR 1=1 --" }), [401, 429]);
  await assertStatus('Invalid Password on Existing Account → 401/429', axios.post(`${baseUrl}/auth/login`, { identifier: investorA.email, password: "wrongpassword123" }), [401, 429]);

  const userCountAfter = await prisma.user.count();
  if (userCountBefore === userCountAfter) {
    console.log('🟢 [PASS] Failed Login Side-Effects Check (User DB count unchanged after failed attempts)');
  } else {
    console.log(`🔴 [FAIL] Failed Login Side-Effects Check (User count changed from ${userCountBefore} to ${userCountAfter})`);
    failedTestsCount++;
  }

  console.log('\n--- 4. IDOR (Object-Level Authorization) Protection Tests ---');
  await assertStatus(`IDOR: GET /payments/${paymentB.id} (Investor A accessing B's payment)`, axios.get(`${baseUrl}/payments/${paymentB.id}`, { headers: { Authorization: `Bearer ${tokenA}` } }), 403);
  await assertStatus(`IDOR: GET /investments/${investmentB.id} (Investor A accessing B's investment)`, axios.get(`${baseUrl}/investments/${investmentB.id}`, { headers: { Authorization: `Bearer ${tokenA}` } }), 403);
  await assertStatus(`IDOR: GET /lands/${landB.id} (Investor A accessing B's plot)`, axios.get(`${baseUrl}/lands/${landB.id}`, { headers: { Authorization: `Bearer ${tokenA}` } }), 403);
  await assertStatus(`IDOR: GET /updates/${updateB.id} (Investor A accessing B's update)`, axios.get(`${baseUrl}/updates/${updateB.id}`, { headers: { Authorization: `Bearer ${tokenA}` } }), 403);
  await assertStatus(`IDOR: GET /crops/${cropB.id} (Investor A accessing B's crop)`, axios.get(`${baseUrl}/crops/${cropB.id}`, { headers: { Authorization: `Bearer ${tokenA}` } }), 403);

  console.log('\n--- 5. Public Route Protection Tests ---');
  await assertStatus('POST /content without token → 401', axios.post(`${baseUrl}/content`, { section: 'home', content: {} }), 401);
  await assertStatus('POST /faqs without token → 401', axios.post(`${baseUrl}/faqs`, { question: 'Q?', answer: 'A' }), 401);
  await assertStatus('DELETE /faqs/:id without token → 401', axios.delete(`${baseUrl}/faqs/faq-123`), 401);
  await assertStatus('POST /gallery without token → 401', axios.post(`${baseUrl}/gallery`, { title: 'G' }), 401);
  await assertStatus('POST /testimonials without token → 401', axios.post(`${baseUrl}/testimonials`, { name: 'T', text: 'T' }), 401);

  console.log('\n--- Final Security Test Suite Results ---');
  if (failedTestsCount === 0) {
    console.log('🏆 [SUCCESS] All 18 automated security verification tests PASSED cleanly!');
    process.exit(0);
  } else {
    console.log(`❌ [FAILURE] ${failedTestsCount} security test(s) failed.`);
    process.exit(1);
  }
}

testSecurity().catch(err => {
  console.error('Fatal Security Test Error:', err);
  process.exit(1);
});
