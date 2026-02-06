import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// Google Fonts are currently failing to download, using system fonts instead.
const geistSansVariable = "font-sans";
const geistMonoVariable = "font-mono";

export const metadata: Metadata = {
  title: "Ecom Admin Dashboard",
  description: "Admin Dashboard for Ecom",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <ClerkProvider >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSansVariable} ${geistMonoVariable} antialiased flex`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
