import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist to Inter
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Added Toaster

const inter = Inter({ // Changed from geistSans to inter
  subsets: ['latin'],
  variable: '--font-sans', // Standard variable name for sans-serif
});

// Removed geistMono as only one primary font is typically needed for body.
// If a mono font is specifically required elsewhere, it can be added.

export const metadata: Metadata = {
  title: 'WeatherWise', // Updated App Name
  description: 'Get current weather information for any city.', // Updated Description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}> {/* Use inter.variable and a base font-sans class */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
