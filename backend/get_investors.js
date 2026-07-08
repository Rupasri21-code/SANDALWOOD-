const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'INVESTOR' },
    select: { email: true, username: true }
  });
  console.log("Investors found:", users);
}

main().finally(() => prisma.$disconnect());
