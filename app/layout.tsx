import type { Metadata } from "next";
import { Prompt } from "next/font/google";
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
                    <div className="flex flex-col leading-snug">
                      <span className="inline-flex items-center gap-1.5 text-base font-semibold tracking-wide sm:text-lg">
                        <span>รายการโอนเงินสดย่อย</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-9 w-9 drop-shadow-[0_0_3px_rgba(0,0,0,0.25)]"
                        >
                          {/* ธนบัตรพื้นหลัง */}
                          <rect
                            x="4"
                            y="6.5"
                            width="14"
                            height="8.5"
                            rx="1.2"
                            className="fill-emerald-500"
                          />
                          {/* พื้นในธนบัตร */}
                          <rect
                            x="5.3"
                            y="7.6"
                            width="11.4"
                            height="6.3"
                            rx="1"
                            className="fill-emerald-100"
                          />
                          {/* วงกลม + $ ตรงกลางธนบัตร */}
                          <circle
                            cx="10.5"
                            cy="10.8"
                            r="2.1"
                            className="fill-emerald-400"
                          />
                          {/* กองเหรียญด้านหน้า */}
                          <ellipse
                            cx="14.5"
                            cy="13.8"
                            rx="2.1"
                            ry="0.9"
                            className="fill-amber-300"
                          />
                          <rect
                            x="12.4"
                            y="11.2"
                            width="4.2"
                            height="2.6"
                            rx="1.3"
                            className="fill-amber-300"
                          />
                          <ellipse
                            cx="11.1"
                            cy="13.2"
                            rx="1.7"
                            ry="0.8"
                            className="fill-amber-200"
                          />
                          <rect
                            x="9.4"
                            y="11.6"
                            width="3.4"
                            height="2"
                            rx="1"
                            className="fill-amber-200"
                          />
                        </svg>
                      </span>
                      <span className="hidden text-[11px] text-red-600 sm:inline">
                        รายละเอียดการโอนเงินสดย่อยประจำวัน-สภาอุตสาหกรรม
                      </span>
                    </div>
                  </div>
                </div>
                <div className="header-logo-notch h-full w-12 bg-white sm:w-16" />
              </div>
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
