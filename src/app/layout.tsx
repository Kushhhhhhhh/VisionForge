import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import SessionProvider from "@/app/SessionProvider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "VisionForge - Free Image Generation, AI Image Creation, Stunning Visuals",
  description: "VisionForge is a cutting-edge platform for free image generation, leveraging advanced AI to create stunning visuals effortlessly. Perfect for designers, marketers, and creatives seeking high-quality images.",
  keywords: "free image generation, AI image creation, stunning visuals, high-quality images, designers, marketers, creatives, advanced AI, VisionForge, image generation platform, free images, AI-powered visuals, high-quality graphics"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative dark`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <SessionProvider>
            <Header />
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}