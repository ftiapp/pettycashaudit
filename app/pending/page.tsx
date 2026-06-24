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
    console.log("[Pending] Fetched rows count:", rows.length, "First row (header):", rows[0]);
    const dataRows = rows.slice(1);

    const parsed = dataRows
      .map((cols: unknown[], index: number) => {
        const c = (i: number) => (cols[i] ?? "").toString().trim();
        const num = (i: number) => {
          const raw = (cols[i] ?? "0").toString().replace(/,/g, "");
          const n = Number(raw);
          return Number.isFinite(n) ? n : 0;
        };
        const cleanDocNo = (i: number) =>
          c(i).replace(/,/g, "").replace(/\.00$/, "");

        const row = {
          id: index,
          detail: c(0),
          transferDate: c(1),
          docNo: cleanDocNo(2),
          amount: num(3),
        };
        if (index < 3) console.log("[Pending] Row", index, "cols:", cols, "parsed:", row);
        return row;
      })
      .filter((row) => row.detail !== "");

    console.log("[Pending] Parsed count:", parsed.length);
    return parsed;
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
        <PendingTable rows={rows} />
      </div>
    </div>
  );
}
