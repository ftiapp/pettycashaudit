import { NextRequest, NextResponse } from "next/server";

const ALLOWED_REFERER = "https://ftiorth.sharepoint.com/";

export function middleware(request: NextRequest) {
  const referer = request.headers.get("referer") || "";
  const { pathname } = request.nextUrl;

  // ขณะพัฒนา (npm run dev) ให้ผ่านทุก request เพื่อสะดวกต่อการทดสอบ
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  // อนุญาตให้ไฟล์ static บางอย่างผ่านไปได้โดยไม่ตรวจ referer
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/fti-logo.png"
  ) {
    return NextResponse.next();
  }

  // อนุญาตเฉพาะเมื่อ referer มาจาก SharePoint ที่กำหนด
  if (!referer.startsWith(ALLOWED_REFERER)) {
    const html = `<!DOCTYPE html>
<html lang="th">
  <head>
    <meta charSet="utf-8" />
    <title>การเข้าใช้งานไม่ถูกต้อง</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      :root {
        color-scheme: light;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 16px 12px;
        font-family: "Prompt", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: radial-gradient(circle at top, #e0edff 0, #f9fafb 42%, #f3f4f6 100%);
        color: #111827;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .card {
        width: 100%;
        max-width: 560px;
        margin: 0 auto;
        padding: 22px 24px 22px;
        border-radius: 18px;
        background: #ffffff;
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
        border: 1px solid rgba(148, 163, 184, 0.35);
      }
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 12px;
      }
      .logo {
        display: block;
        height: 40px;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: #eff6ff;
        color: #1d4ed8;
        font-size: 0.78rem;
        font-weight: 600;
      }
      .divider {
        height: 1px;
        background: linear-gradient(to right, rgba(148, 163, 184, 0.4), rgba(148, 163, 184, 0.08));
        margin: 10px 0 12px;
      }
      .dot {
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: #22c55e;
      }
      h1 {
        font-size: 1.3rem;
        margin: 0 0 10px 0;
        color: #111827;
      }
      p {
        margin: 4px 0;
        line-height: 1.75;
        font-size: 0.97rem;
      }
      .highlight {
        color: #1d4ed8;
        font-weight: 600;
      }
      .url-line {
        margin-top: 10px;
        white-space: normal;
        word-break: break-word;
      }
      .small {
        margin-top: 10px;
        font-size: 0.82rem;
        color: #6b7280;
      }
      @media (max-width: 480px) {
        body {
          padding: 12px 10px;
        }
        .card {
          padding: 18px 18px 18px;
          border-radius: 14px;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);
        }
        .logo {
          height: 32px;
        }
        h1 {
          font-size: 1.15rem;
        }
        p {
          font-size: 0.9rem;
        }
        .pill {
          font-size: 0.75rem;
        }
      }
    </style>
  </head>
  <body>
    <main class="card" role="alert">
      <header class="card-header">
        <img src="/fti-logo.png" alt="FTI Logo" class="logo" />
        <div class="pill"><span class="dot"></span>แจ้งเตือนการเข้าใช้งาน</div>
      </header>
      <div class="divider"></div>
      <h1>ไม่สามารถเข้าใช้งานระบบได้</h1>
      <p>
        ระบบนี้ออกแบบให้เข้าใช้งานผ่าน
        <span class="highlight">SharePoint สภาอุตสาหกรรม</span>
        เท่านั้น
      </p>
      <p class="url-line">
        กรุณาปิดหน้านี้ แล้วกลับไปเข้าใช้งานผ่านหน้า
        <span class="highlight">https://ftiorth.sharepoint.com/</span><br />
        
      </p>
      <p class="small">
        หากยังไม่สามารถเข้าใช้งานได้ กรุณาติดต่อผู้ดูแลระบบของสภาอุตสาหกรรมแห่งประเทศไทย
      </p>
    </main>
  </body>
</html>`;

    return new NextResponse(html, {
      status: 403,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ["/:path*"],
};
