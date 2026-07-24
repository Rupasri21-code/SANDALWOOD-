import Navbar from '@/components/public/navbar';
import Footer from '@/components/public/footer';
import WhatsAppWidget from '@/components/public/whatsapp-widget';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
