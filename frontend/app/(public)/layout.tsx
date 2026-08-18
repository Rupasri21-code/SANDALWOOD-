import Navbar from '@/components/public/navbar';
import Footer from '@/components/public/footer';
import WhatsAppWidget from '@/components/public/whatsapp-widget';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] md:pt-[82px] xl:pt-[104px]">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
