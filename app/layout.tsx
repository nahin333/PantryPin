import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PantryPin — See what’s in your food",
  description: "Turn a food photo into an ingredient, nutrition, and local grocery cost breakdown.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
