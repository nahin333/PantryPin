import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nahin333.github.io/where-and-how-much/"),
  title: "PantryPin — See what’s in your food",
  description:
    "Turn a food photo into likely ingredients, nutrition estimates, and a grocery-planning view.",
  keywords: ["food AI", "ingredient detection", "nutrition estimate", "grocery planning"],
  authors: [{ name: "nahin333", url: "https://github.com/nahin333" }],
  alternates: {
    canonical: "https://nahin333.github.io/where-and-how-much/",
  },
  openGraph: {
    type: "website",
    url: "https://nahin333.github.io/where-and-how-much/",
    siteName: "PantryPin",
    title: "PantryPin — See what’s in your food",
    description:
      "From a food photo to likely ingredients, estimated nutrition, and a grocery-planning view.",
    images: [
      {
        url: "https://nahin333.github.io/where-and-how-much/pantrypin-social-preview.png",
        width: 1280,
        height: 640,
        alt: "PantryPin food photo analysis and grocery-planning demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PantryPin — See what’s in your food",
    description:
      "From a food photo to likely ingredients, estimated nutrition, and a grocery-planning view.",
    images: ["https://nahin333.github.io/where-and-how-much/pantrypin-social-preview.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
