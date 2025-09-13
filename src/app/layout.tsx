import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/provider/AuthProvider";
import { AccentColorProvider } from "@/components/provider/AccentColorProvider";


export const metadata: Metadata = {
  title: "Protocol",
  description: "Application d'authentification avec Bungie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AccentColorProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </AccentColorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
