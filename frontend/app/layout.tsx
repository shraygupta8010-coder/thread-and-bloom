import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thread & Bloom | Luxury Bedding & Living',
  description:
    'Pure Comfort, Woven for Indian Homes. Microfiber comforters, 450 GSM sherpa fleece blankets, and 600 GSM Zero-Twist Turkish cotton bath sets.',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('tb-theme') === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) { document.documentElement.classList.add('dark'); }

              // Catch Google OAuth popup callback instantly and post token to parent window
              try {
                if (window.opener && (window.location.hash.includes('id_token=') || window.location.hash.includes('access_token='))) {
                  window.opener.postMessage({
                    type: 'GOOGLE_OAUTH_SUCCESS',
                    hash: window.location.hash
                  }, window.location.origin);
                  window.close();
                }
              } catch (e) {}
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-surface font-body-md text-on-surface antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
