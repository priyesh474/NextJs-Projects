import Header from "@/components/Header/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import styles from "./page.module.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header/>
        <main>
          <div className={styles.container}>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
