import { Archivo, Space_Grotesk } from 'next/font/google';
import '@/styles/globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'Anjana Suresh — Interior Designer',
  description: 'Portfolio of Anjana Suresh, an interior designer crafting modern, elegant living spaces. Explore 3D room designs, project showcases, and design philosophy.',
  keywords: ['interior design', 'portfolio', 'Anjana Suresh', '3D design', 'architecture', 'home design'],
  authors: [{ name: 'Anjana Suresh' }],
  openGraph: {
    title: 'Anjana Suresh — Interior Designer',
    description: 'Crafting modern, elegant living spaces.',
    type: 'website',
    locale: 'en_US',
  },
};

import { ContentProvider } from '@/hooks/useContent';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body>
        <ContentProvider>
          <LoadingScreen />
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}
