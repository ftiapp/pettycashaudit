import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import NavLinks from "./NavLinks";
import HeaderTitle from "./HeaderTitle";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
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
    <html lang="en">
      <body className={`${prompt.variable} antialiased`}>
        <div className="flex min-h-screen flex-col bg-white text-slate-900">
          <header className="bg-indigo-800 text-white shadow">
            <div className="flex h-14 w-full items-stretch">
              <div className="flex items-stretch">
                <div className="flex items-center bg-white pl-3 pr-8 text-indigo-800 sm:pl-6 sm:pr-10">
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
              <NavLinks />
            </div>
          </header>

          <main>{children}</main>

          <footer className="mt-0 border-t border-slate-200 bg-white py-4 text-[11px] text-indigo-900">
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
