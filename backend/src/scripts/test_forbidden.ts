import { db } from '../config/database';
import { generateAccessToken } from '../utils/generateToken';

async function main() {
  console.log('Testing GET /api/v1/investments/bcd2d55b-9ca7-424e-940f-4f7d64e9401f with a different Investor (Sanjana) token...');

  // Find Sanjana user
  const user = await db.user.findFirst({
    where: { email: 'sanjana.garnepudi@gmail.com' }
  });

  if (!user) {
    console.error('User Sanjana not found in database');
    return;
  }

  const token = generateAccessToken(user.id, user.role);
  console.log(`User ID: ${user.id}, Role: ${user.role}`);

  try {
    const res = await fetch('http://localhost:5001/api/v1/investments/bcd2d55b-9ca7-424e-940f-4f7d64e9401f', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response Status:', res.status);
    const body = await res.json();
    console.log('Response Body:', body);
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
