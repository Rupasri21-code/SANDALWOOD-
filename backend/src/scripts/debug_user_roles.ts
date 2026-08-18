import { db } from '../config/database';

async function main() {
  const users = await db.user.findMany();
  console.log('Total users:', users.length);
  for (const u of users) {
    console.log(`- Email: ${u.email}, Role: "${u.role}"`);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
