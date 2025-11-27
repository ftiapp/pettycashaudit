import { google } from "googleapis";
import PettyCashTable from "./PettyCashTable";
type PettyCashRow = {
  id: number;
  monthLabel: string;
  transferDate: string;
  docNo: string;
  detail: string;
  groupName: string;
  date: string;
  receiver: string;
  amount: number;
  institute: string;
  note: string;
  advance: number;
  refund: number;
  advNo: string;
};

async function fetchSheetRows(): Promise<PettyCashRow[]> {
  try {
    if (
      !process.env.GOOGLE_SHEETS_CLIENT_EMAIL ||
      !process.env.GOOGLE_SHEETS_PRIVATE_KEY ||
      !process.env.GOOGLE_SHEET_ID ||
      !process.env.GOOGLE_SHEET_RANGE
    ) {
      console.error("Missing Google Sheets environment variables");
      return [];
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(
          /\\n/g,
          "\n"
        ),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: process.env.GOOGLE_SHEET_RANGE,
    });

    const rows = res.data.values ?? [];
    const dataRows = rows.slice(1); // ข้ามแถว header

    return dataRows.map((cols: unknown[], index: number) => {
      const c = (i: number) => (cols[i] ?? "").toString();
      const num = (i: number) => {
        const n = Number((cols[i] ?? "0").toString().replace(/,/g, ""));
        return Number.isFinite(n) ? n : 0;
      };

      return {
        id: index,
        monthLabel: c(0),
        transferDate: c(1),
        docNo: c(2),
        detail: c(3),
        groupName: c(4),
        date: c(5),
        receiver: c(6),
        amount: num(7),
        institute: c(8),
        note: c(9),
        advance: num(10),
        refund: num(11),
        advNo: c(12),
      };
    });
  } catch (error) {
    console.error("Failed to fetch Google Sheets rows", error);
    return [];
  }
}

async function fetchSheetLastUpdated(): Promise<string | undefined> {
  try {
    if (
      !process.env.GOOGLE_SHEETS_CLIENT_EMAIL ||
      !process.env.GOOGLE_SHEETS_PRIVATE_KEY ||
      !process.env.GOOGLE_SHEET_ID
    ) {
      console.error("Missing Google Sheets environment variables for last updated time");
      return undefined;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    const modifiedTime = (res.data as any).properties?.modifiedTime as
      | string
      | undefined;

    return modifiedTime;
  } catch (error) {
    console.error("Failed to fetch Google Sheets last updated time", error);
    return undefined;
  }
}

export default async function Home() {
  const [rows, lastUpdated] = await Promise.all([
    fetchSheetRows(),
    fetchSheetLastUpdated(),
  ]);

  return (
    <div className="bg-white pt-4 pb-0 px-2 sm:px-4 lg:px-8">
      <div className="mx-auto w-full max-w-6xl lg:max-w-[1400px] xl:max-w-none space-y-6">
        <PettyCashTable rows={rows} lastUpdated={lastUpdated} />
      </div>
    </div>
  );
}
