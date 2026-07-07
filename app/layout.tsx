import type { Metadata } from "next";
import { Noto_Sans_Thai, Inter } from "next/font/google";
import HeaderTitle from "./HeaderTitle";
import "./globals.css";

// FTI Design System: Noto Sans Thai for Thai/mixed runs, Inter for English-only.
const notoSansThai = Noto_Sans_Thai({
  variable: "--font-th",
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-en",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "รายงานการโอนเงินสดย่อยประจำวัน",
  description: "Petty cash tracking and audit dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.variable} ${inter.variable} antialiased`}>
        <div className="flex min-h-screen flex-col bg-white text-[color:var(--color-on-surface)]">
          <header className="bg-[color:var(--color-primary-800)] text-white shadow-[var(--shadow-1)]">
            <div className="flex h-14 w-full items-stretch">
              <div className="flex items-stretch">
                <div className="flex items-center bg-white pl-3 pr-8 text-[color:var(--color-primary)] sm:pl-6 sm:pr-10">
                  <div className="flex items-center gap-2">
                    <img
                      src="/fti-logo.png"
                      alt="FTI"
                      className="h-7 w-auto sm:h-8"
                    />
                    <HeaderTitle />
                  </div>
                </div>
                <div className="header-logo-notch h-full w-12 bg-white sm:w-16" />
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className="mt-0 border-t border-[color:var(--color-border-subtle)] bg-white py-4 text-[11px] text-[color:var(--color-primary-900)]">
            <div className="mx-auto flex w-full max-w-5xl items-center px-4">
              <div className="flex items-center">
                <img
                  src="/fti-logo.png"
                  alt="FTI"
                  className="h-14 w-auto"
                />
              </div>
              <div className="mx-auto flex flex-col items-center text-center text-[11px] leading-snug text-slate-700">
                <span>
                  © 2025 จัดทำโดย ฝ่ายดิจิทัลและเทคโนโลยี สภาอุตสาหกรรมแห่งประเทศไทย
                </span>
                <span>จัดทำโดย นางสาวกัลยรักษ์ โรจนเลิศประเสริฐ</span>
                <span>นักศึกษาฝึกงาน มหาวิทยาลัยพะเยา</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
