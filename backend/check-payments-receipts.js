const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const payments = await prisma.payment.findMany({
    select: {
      id: true,
      amount: true,
      status: true,
      receipt_url: true
    }
  });
  console.log('Payments:', payments);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
