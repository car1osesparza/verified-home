import "antd/dist/reset.css";
import "./globals.css";
import { Alfa_Slab_One, Montserrat } from "next/font/google";
import RootProviders from "../components/RootProviders";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

const montserratHead = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-head",
});

const alfaSlabOne = Alfa_Slab_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-champ",
});

export const metadata = {
  title: "Verified Athletics - Direction B",
  description: "Proof-first recruiting homepage rebuilt in Next.js + Ant Design.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${montserratHead.variable} ${alfaSlabOne.variable}`}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
