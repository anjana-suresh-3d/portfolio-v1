import { Archivo, Space_Grotesk } from 'next/font/google';
import '@/styles/globals.css';
import prisma from '@/lib/prisma';
import { getSignedUrl } from '@/lib/supabase';

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

export async function generateMetadata() {
  const faviconEntry = await prisma.siteContent.findUnique({
    where: { key: 'site.favicon' }
  });

  let faviconUrl = '/favicon.ico'; // Default
  if (faviconEntry?.value) {
    // If it's a Supabase path (doesn't start with http/https)
    if (!faviconEntry.value.startsWith('http')) {
      const signed = await getSignedUrl(faviconEntry.value, 604800); // 7 days
      if (signed) faviconUrl = signed;
    } else {
      faviconUrl = faviconEntry.value;
    }
  }

  return {
    title: 'Anjana Suresh — Interior Designer',
    description: 'Portfolio of Anjana Suresh, an interior designer crafting modern, elegant living spaces.',
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: 'Anjana Suresh — Interior Designer',
      description: 'Crafting modern, elegant living spaces.',
      type: 'website',
      locale: 'en_US',
    },
  };
}

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
