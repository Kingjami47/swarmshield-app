import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://swarmshield.vercel.app"),
  title: "SwarmShield — The swarm-verified liquidity guard | Uniswap v4 Hook",
  description:
    "A Uniswap v4 hook that prices swarm trust into a pool: 2% + burn while unverified, 0.30% once an IMD agent panel quorum attests authenticity. Built for the Identity MD Hackathon on Ethereum mainnet.",
  keywords: ["SwarmShield", "Uniswap v4", "hook", "IMD", "Identity MD", "hackathon", "DeFi", "oracle"],
  authors: [{ name: "SwarmShield" }],
  icons: {
    icon: "/img/avatar_v2.png",
  },
  openGraph: {
    title: "SwarmShield — The swarm-verified liquidity guard",
    description:
      "Trust, priced into every swap. A Uniswap v4 hook verified by the IMD agent swarm. Identity MD Hackathon entry.",
    images: ["/img/banner_v2.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwarmShield — The swarm-verified liquidity guard",
    description: "Trust, priced into every swap. Uniswap v4 hook + IMD oracle. @SwarmShieldIMD",
    images: ["/img/banner_v2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
