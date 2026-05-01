import "antd/dist/reset.css";
import "./globals.css";
import { Montserrat } from "next/font/google";
import SiteChrome from "../components/SiteChrome";

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

export const metadata = {
  title: "Verified Athletics - Direction B",
  description: "Proof-first recruiting homepage rebuilt in Next.js + Ant Design.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${montserratHead.variable}`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
