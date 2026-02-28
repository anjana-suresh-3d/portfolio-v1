import { Archivo, Space_Grotesk } from 'next/font/google';
import '@/styles/globals.css';
import prisma from '@/lib/prisma';
import { getSignedUrl, getProxiedUrl, stripProxy } from '@/lib/supabase';

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
    const cleanValue = stripProxy(faviconEntry.value);

    // If it's a Supabase path (doesn't start with http/https)
    if (!cleanValue.startsWith('http')) {
      const signed = await getSignedUrl(cleanValue, 604800); // 7 days
      faviconUrl = getProxiedUrl(signed) || faviconUrl;
    } else {
      faviconUrl = getProxiedUrl(cleanValue);
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
