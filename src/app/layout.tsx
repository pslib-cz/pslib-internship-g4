import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import { AccountDrawerProvider } from "@/providers/AccountDrawerProvider";
import { AccountDrawer } from "@/components";
import CookieBanner from "./CookieBanner";
import Script from "next/script";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";

// export const runtime = "nodejs";

const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

export const metadata: Metadata = {
  title: {
    template: "%s | Správa praxí pslib.cz",
    default: "Správa praxí pslib.cz",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  return (
    <html lang="cs">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffc0cb" />
        <meta name="msapplication-TileColor" content="#ff1493" />
        <meta name="theme-color" content="#ffffff"></meta>
        {/* Microsoft Clarity Script */}
        {clarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
            if (document.cookie.includes("analytics_consent=true")) {
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            }
            `}
          </Script>
        )}
        <ColorSchemeScript />
      </head>
      <body>
        <SessionProvider>
          <MantineProvider defaultColorScheme="auto">
            <Notifications position="top-center" zIndex={10000000} />
            <AccountDrawerProvider>
              <CookieBanner />
              {children}
              <AccountDrawer />
            </AccountDrawerProvider>
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
