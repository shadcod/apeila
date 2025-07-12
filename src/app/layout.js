import { Inter } from 'next/font/google';
import '@styles/globals.css';
import 'swiper/css';
import 'swiper/css/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Apeila.com | Online Shopping Store',
    template: '%s | Apeila.com',
  },
  description: 'Best online shopping store with a wide variety of products',
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/icon.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
