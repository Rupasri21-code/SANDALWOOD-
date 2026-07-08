const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  
  await prisma.user.updateMany({
    where: { 
      email: {
        in: ['ramasita@gmail.com', 'navya@gmail.com']
      }
    },
    data: { password }
  });
  
  console.log("Passwords for ramasita@gmail.com and navya@gmail.com have been reset to 'password123'.");
}

main().finally(() => prisma.$disconnect());
