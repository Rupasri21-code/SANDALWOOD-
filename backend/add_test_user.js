const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'gopidesirupasri@gmail.com';
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      username: 'gopidesirupasri',
      password,
      role: 'ADMIN',
    },
  });

  console.log('User created or found:', user.email);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
