import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import { AccountDrawerProvider } from "@/providers/AccountDrawerProvider";
import { AccountDrawer } from "@/components";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";

// export const runtime = "nodejs";

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
        <ColorSchemeScript />
      </head>
      <body>
        <SessionProvider>
          <MantineProvider defaultColorScheme="auto">
            <Notifications position="top-center" zIndex={10000000} />
            <AccountDrawerProvider>
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
