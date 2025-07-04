import { Urbanist, Roboto } from "next/font/google";

import "./globals.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

const urbanist = Urbanist({
  //variable: "--font-urbanist",
  subsets: ["latin"],
})

const roboto = Roboto({
  //variable: "--font-roboto",
  subsets: ["latin"],
})


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
     <html lang="en" className={`${urbanist.className} ${roboto.className}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
