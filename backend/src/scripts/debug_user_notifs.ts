import { db } from '../config/database';

async function main() {
  const users = [
    { email: 'gopidesirupasri8@gmail.com', userId: 'c0e12a66-9773-45e3-8ee7-bfd369e68107' },
    { email: 'rajitha.nathani@gmail.com', userId: '51935d00-32ad-4d90-8970-037e8138c00e' }
  ];

  for (const u of users) {
    const notifs = await db.notification.findMany({
      where: { recipient_id: u.userId }
    });
    console.log(`\nNotifications for ${u.email} (User ID: ${u.userId}): ${notifs.length}`);
    for (const n of notifs) {
      console.log(`- ID: ${n.id}, Title: "${n.title}", Msg: "${n.message}", IsRead: ${n.is_read}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
