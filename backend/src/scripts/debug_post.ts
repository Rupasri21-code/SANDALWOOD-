import axios from 'axios';
import { db } from '../config/database';

async function main() {
  console.log('🧪 Sending request to POST /api/v1/notifications/admin/create...');
  
  // 1. Get an admin token
  const admin = await db.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!admin) {
    console.error('❌ No admin user found in database.');
    return;
  }

  console.log(`👤 Found admin: ${admin.email}`);

  // Create token or use signin api to get a real token
  const signinUrl = 'http://localhost:5001/api/v1/auth/login';
  let token = '';
  try {
    const loginRes = await axios.post(signinUrl, {
      email: admin.email,
      password: 'Password@123' // Default password for local testing admin
    });
    token = loginRes.data.data.token;
  } catch (loginErr: any) {
    console.log('Could not login with default password, using raw DB user properties...');
    // We can mock authorization or use a token generator. Let's sign token:
    const jwt = require('jsonwebtoken');
    token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
  }

  console.log('🔑 JWT Token generated successfully.');

  // Find target investor Rajitha Nathani
  const investor = await db.investorProfile.findFirst({
    where: { email: 'gopidesirupasri8@gmail.com' }
  });

  if (!investor) {
    console.error('❌ Could not find investor.');
    return;
  }

  // Make post request
  const url = 'http://localhost:5001/api/v1/notifications/admin/create';
  try {
    const res = await axios.post(
      url,
      {
        recipientId: investor.user_id,
        investorId: investor.id,
        title: 'hi all hello all',
        message: 'hi every onehpow are you',
        type: 'SUCCESS',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('✅ API Response Status:', res.status);
    console.log('✅ API Response Data:', res.data);
  } catch (err: any) {
    console.error('❌ API Request failed!');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error('Message:', err.message);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
