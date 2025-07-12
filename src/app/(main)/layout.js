import Header from '@components/Header';
import Footer from '@components/Footer';
import Cart from '@components/Cart';
import { AppProvider } from '@context/AppContext';
import '@styles/globals.css';
import { Inter } from 'next/font/google';
import 'swiper/css';
import 'swiper/css/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function MainLayout({ children }) {
  return (
    <AppProvider>
      <>
        <Header />
        <main>{children}</main>
        <Footer />
        <Cart />
      </>
    </AppProvider>
  );
}
