import Header from '@components/Header';
import Footer from '@components/Footer';
import Cart from '@components/Cart';
import { AppProvider } from '@context/AppContext';
import '@styles/globals.css';
import { Inter } from 'next/font/google';
import 'swiper/css';
import 'swiper/css/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Wetren.com | Online Shopping Store',
    template: '%s | Wetren.com',
  },
  description: 'Best online shopping store with a wide variety of products',
  keywords: ['shopping', 'electronics', 'devices', 'clothing', 'shoes', 'accessories'],
  authors: [{ name: 'Wetren' }],
  creator: 'Wetren',
  publisher: 'Wetren',
  openGraph: {
    title: 'Wetren.com | Online Shopping Store',
    description: 'Best online shopping store',
    url: 'https://wetren.com',
    siteName: 'Wetren',
    images: [{ url: '/img/icon.png' }],
    locale: 'en_US',
    type: 'website',
  },
  metadataBase: new URL("http://localhost:3000"), // غيّرها إلى https://wetren.com في الإنتاج
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/icon.png" />

        {/* ✅ Font Awesome Link */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={inter.className}>
        <AppProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Cart />
        </AppProvider>
      </body>
    </html>
  );
}
