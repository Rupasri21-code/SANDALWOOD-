import { db } from './config/database';
import { generateAccessToken } from './utils/generateToken';
import http from 'http';

async function makeRequest(path: string, token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: 'localhost',
        port: 5001,
        path,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              data: JSON.parse(body),
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              body,
            });
          }
        });
      }
    );
    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function main() {
  const admin = await db.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!admin) {
    console.error('No admin user found!');
    return;
  }

  const token = generateAccessToken(admin.id, admin.role);

  try {
    const nRes = await makeRequest('/api/v1/notifications/admin/all', token);
    console.log('GET /api/v1/notifications/admin/all Status:', nRes.statusCode);
    console.log('Data success:', nRes.data?.success);
    console.log('Data message:', nRes.data?.message);
    console.log('Data length:', Array.isArray(nRes.data?.data) ? nRes.data.data.length : typeof nRes.data?.data);
  } catch (err) {
    console.error('Error:', err);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => db.$disconnect());
