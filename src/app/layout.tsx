import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import StyledComponentsRegistry from "@/lib/registry";
import { AuthProvider } from '@/contexts/AuthContext';

// Components
import Header from "@/components/HomeComponents/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CPEC",
  description: "Centros de Pesquisa em Ensaios Clínicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <AuthProvider>
            <Header/>
            {children}
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}