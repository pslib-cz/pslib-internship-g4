import type { Metadata } from "next";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Praxe",
  description: "Správa praxí pro SPŠ a VOŠ Liberec",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
