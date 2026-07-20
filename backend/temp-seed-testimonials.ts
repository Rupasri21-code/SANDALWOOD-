import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialTestimonials = [
  {
    text: "Investing in Chandhan Nilayam was one of the best decisions I've made. The transparency and regular updates give me complete peace of mind.",
    name: "Ramesh B.",
    location: "Hyderabad",
    rating: 5,
  },
  {
    text: "The team is professional, the land is beautiful, and the vision is truly long-term. I'm proud to be part of this green legacy.",
    name: "Anitha K.",
    location: "Bengaluru",
    rating: 5,
  },
  {
    text: "A rare opportunity to own land, grow sandalwood and build wealth for future generations. Highly recommended.",
    name: "Vikram S.",
    location: "Chennai",
    rating: 5,
  },
];

async function main() {
  const existingCount = await prisma.testimonial.count();
  if (existingCount === 0) {
    console.log('Seeding initial testimonials...');
    for (const test of initialTestimonials) {
      await prisma.testimonial.create({
        data: test
      });
    }
    console.log('Testimonials seeded.');
  } else {
    console.log('Testimonials already exist.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
