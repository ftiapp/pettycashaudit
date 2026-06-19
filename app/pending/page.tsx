import { google } from "googleapis";
import { Metadata } from "next";
import PendingTable from "./PendingTable";

export const metadata: Metadata = {
  title: "รายการค้างชำระ",
  description: "Outstanding petty cash payments",
};

export const dynamic = "force-dynamic";

export type OutstandingRow = {
  id: number;
  detail: string;
  transferDate: string;
  docNo: string;
  amount: number;
};

async function fetchOutstandingRows(): Promise<OutstandingRow[]> {
  try {
    if (
      !process.env.GOOGLE_SHEETS_CLIENT_EMAIL ||
      !process.env.GOOGLE_SHEETS_PRIVATE_KEY ||
      !process.env.GOOGLE_SHEET_ID
    ) {
      console.error("Missing Google Sheets environment variables");
      return [];
    }

    const sheetRange =
      process.env.GOOGLE_SHEET_PENDING_RANGE || "'รายการค้างชำระ'!A1:D1000";

    const privateKeyRows = process.env.GOOGLE_SHEETS_PRIVATE_KEY
      ? process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n")
      : "";

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: privateKeyRows,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: sheetRange,
    });

    const rows = res.data.values ?? [];
    const dataRows = rows.slice(1);

    const parsed = dataRows
      .map((cols: unknown[], index: number) => {
        const c = (i: number) => (cols[i] ?? "").toString().trim();
        const num = (i: number) => {
          const n = Number((cols[i] ?? "0").toString().replace(/,/g, ""));
          return Number.isFinite(n) ? n : 0;
        };

        return {
          id: index,
          detail: c(1),
          transferDate: c(2),
          docNo: c(3),
          amount: num(4),
        };
      })
      .filter((row) => row.detail !== "");

    // เรียงจากอันที่เพิ่มล่าสุด (แถวล่างสุดในชีท) ไว้บนสุด
    return parsed.reverse();
  } catch (error) {
    console.error("Failed to fetch outstanding rows", error);
    return [];
  }
}

export default async function OutstandingPage() {
  const rows = await fetchOutstandingRows();

  return (
    <div className="bg-white pt-4 pb-0 px-2 sm:px-4 lg:px-8">
      <div className="mx-auto w-full max-w-6xl lg:max-w-[1400px] xl:max-w-none space-y-6">
        {/* แถบเตือนสีแดง */}
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mt-0.5 h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <div className="text-sm leading-relaxed">
            <p className="font-semibold">
              สามารถตรวจสอบรายละเอียดเพิ่มเติมเกี่ยวกับเช็คสั่งจ่าย ได้ที่ฝ่ายบัญชีฯ คุณทิวิตถ์ฯ
            </p>
            <p className="text-red-600">
              กำหนดการจ่ายเช็คทุกวันศุกร์ สัปดาห์ที่ 2 และ 4 ของเดือน เวลา 13.00 - 17.00 น.
            </p>
          </div>
        </div>

        <PendingTable rows={rows} />
      </div>
    </div>
  );
}
