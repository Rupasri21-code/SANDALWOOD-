const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDb() {
  const replaceStr = (str) => {
    if (!str) return str;
    return str.replace(/Chandan Nilayam/g, 'Chandhan Nilayam')
              .replace(/chandan nilayam/g, 'chandhan nilayam')
              .replace(/CHANDAN NILAYAM/g, 'CHANDHAN NILAYAM');
  };

  const contents = await prisma.siteContent.findMany();
  for (const c of contents) {
    const newVal = replaceStr(c.value);
    if (newVal !== c.value) {
      await prisma.siteContent.update({ where: { id: c.id }, data: { value: newVal } });
      console.log('Updated SiteContent key:', c.key);
    }
  }

  const testimonials = await prisma.testimonial.findMany();
  for (const t of testimonials) {
    const newText = replaceStr(t.text);
    if (newText !== t.text) {
      await prisma.testimonial.update({ where: { id: t.id }, data: { text: newText } });
      console.log('Updated Testimonial:', t.name);
    }
  }

  const faqs = await prisma.faq.findMany();
  for (const f of faqs) {
    const newQ = replaceStr(f.question);
    const newA = replaceStr(f.answer);
    if (newQ !== f.question || newA !== f.answer) {
      await prisma.faq.update({ where: { id: f.id }, data: { question: newQ, answer: newA } });
      console.log('Updated Faq');
    }
  }
}

updateDb()
  .then(() => console.log('Done'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
