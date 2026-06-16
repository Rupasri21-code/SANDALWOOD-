const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.investorProfile.findMany({
    select: {
      id: true,
      full_name: true,
      user_id: true,
    }
  });
  console.log('Profiles user_id mapping:', profiles);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
