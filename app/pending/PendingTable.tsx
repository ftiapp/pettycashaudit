"use client";

import { useMemo, useState } from "react";
import type { OutstandingRow } from "./page";

type Props = {
  rows: OutstandingRow[];
};

export default function PendingTable({ rows }: Props) {
  const [fontSizePercent, setFontSizePercent] = useState(120);
  const [detailFilter, setDetailFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [docNoFilter, setDocNoFilter] = useState("");
  const [noteFilter, setNoteFilter] = useState("");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const textMatch = (value: string, keyword: string) => {
    if (!keyword) return true;
    return value.toLowerCase().includes(keyword.toLowerCase());
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const detailMatch = textMatch(row.detail, detailFilter);
      const dateMatch = textMatch(row.transferDate, dateFilter);
      const docNoMatch = textMatch(row.docNo, docNoFilter);
      const noteMatch = textMatch(row.note, noteFilter);
      return detailMatch && dateMatch && docNoMatch && noteMatch;
    });
  }, [rows, detailFilter, dateFilter, docNoFilter, noteFilter]);

  const totalAmount = filteredRows.reduce((sum, row) => sum + row.amount, 0);

  const handleClearFilters = () => {
    setDetailFilter("");
    setDateFilter("");
    setDocNoFilter("");
    setNoteFilter("");
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="inline-flex items-center gap-2 border-l-4 border-[color:var(--color-brand-red)] pl-3 text-base font-semibold text-primary-900 sm:text-lg">
          <span className="text-[color:var(--color-warning-strong)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5"
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
          </span>
          <span>รายการค้างชำระ</span>
        </h2>
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-warning)] bg-[color:var(--color-warning-subtle)] px-4 py-1.5 text-sm font-semibold text-[color:var(--color-warning-strong)]">
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          ค้างชำระรวม: {totalAmount.toLocaleString("th-TH")} บาท
        </div>
      </div>

      {/* ฟิลเตอร์ค้นหา */}
      <div className="mb-3 space-y-2.5 rounded-lg border border-primary-100 bg-slate-50 p-2.5 text-sm text-slate-700">
        <div className="grid gap-2 md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">รายละเอียดเช็ค</label>
            <input
              type="text"
              placeholder="พิมพ์รายละเอียดเช็ค"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
              value={detailFilter}
              onChange={(e) => setDetailFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">วันที่เช็ค</label>
            <input
              type="text"
              placeholder="เช่น 16 มิ.ย.2569"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">เลขที่เช็ค</label>
            <input
              type="text"
              placeholder="เช่น 100...."
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
              value={docNoFilter}
              onChange={(e) => setDocNoFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">หมายเหตุ</label>
            <input
              type="text"
              placeholder="พิมพ์หมายเหตุ"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
              value={noteFilter}
              onChange={(e) => setNoteFilter(e.target.value)}
            />
          </div>
        </div>

        {/* แถบเตือนสีแดง */}
        <div className="flex items-start gap-4 rounded-md border border-[color:var(--color-border-subtle)] border-l-4 border-l-[color:var(--color-error)] bg-[color:var(--color-error-subtle)] px-6 py-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mt-0.5 h-7 w-7 shrink-0 text-[color:var(--color-error)]"
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
          <div className="text-base leading-relaxed">
            <p className="text-lg font-bold text-[color:var(--color-error-strong)]">
              สามารถตรวจสอบรายละเอียดเพิ่มเติมเกี่ยวกับเช็คสั่งจ่าย ได้ที่ฝ่ายบัญชีฯ คุณทิวิตถ์ฯ
            </p>
            <p className="mt-1 text-[color:var(--color-error)]">
              กำหนดการจ่ายเช็คทุกวันศุกร์ สัปดาห์ที่ 2 และ 4 ของเดือน เวลา 13.00 - 17.00 น.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 justify-between">
          <div className="flex items-center gap-2 rounded-full border border-primary-200 bg-white px-2 py-1 shadow-sm">
            <span className="text-xs font-medium text-slate-600 pl-2">ขนาดอักษร:</span>
            <button
              onClick={() => setFontSizePercent(Math.max(80, fontSizePercent - 10))}
              disabled={fontSizePercent <= 80}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              <span className="text-sm font-bold">-</span>
            </button>
            <span className="w-10 text-center text-xs font-semibold text-primary-700">
              {fontSizePercent}%
            </span>
            <button
              onClick={() => setFontSizePercent(Math.min(150, fontSizePercent + 10))}
              disabled={fontSizePercent >= 150}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              <span className="text-sm font-bold">+</span>
            </button>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[color:var(--color-border)] bg-white px-4 py-1.5 text-sm font-medium text-[color:var(--color-on-surface-muted)] transition-colors hover:bg-[color:var(--color-surface-subtle)] hover:text-[color:var(--color-primary)]"
            onClick={handleClearFilters}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M9 6V4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v2" />
              <rect x="6" y="6" width="12" height="13" rx="2" />
              <path d="M10 10v6" />
              <path d="M14 10v6" />
            </svg>
            <span>ล้างตัวกรอง</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-[480px] lg:max-h-[70vh] overflow-y-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
            <thead className="sticky top-0 z-10 bg-primary-800 font-medium text-slate-50">
              <tr>
                <th className="px-1.5 py-1.5 text-center border-l border-slate-200 min-w-[200px]">รายละเอียดเช็ค</th>
                <th className="px-1.5 py-1.5 text-center border-l border-slate-200 min-w-[100px]">วันที่เช็ค</th>
                <th className="px-1.5 py-1.5 text-center border-l border-slate-200 min-w-[100px]">เลขที่เช็ค</th>
                <th className="px-1.5 py-1.5 text-center whitespace-nowrap border-l border-slate-200 min-w-[120px]">จำนวนเงินรวมทั้งสิ้น</th>
                <th className="px-1.5 py-1.5 text-center border-l border-slate-200 min-w-[120px]">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody
              className="text-slate-800 divide-y divide-slate-200 transition-all duration-200"
              style={{ fontSize: `${(fontSizePercent / 100) * 0.75}rem` }}
            >
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-slate-500 border-l border-slate-200"
                  >
                    ไม่มีรายการค้างชำระ
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => {
                  const isSelected = row.id === selectedRowId;
                  const baseColor = idx % 2 === 0 ? "bg-white" : "bg-[color:var(--color-surface-subtle)]";
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedRowId(row.id)}
                      className={`${
                        isSelected ? "bg-primary-100" : baseColor
                      } hover:bg-primary-50 cursor-pointer transition-colors`}
                    >
                      <td className="px-1.5 py-1.5 border-l border-slate-200">{row.detail}</td>
                      <td className="px-1.5 py-1.5 text-center border-l border-slate-200">{row.transferDate}</td>
                      <td className="px-1.5 py-1.5 text-center border-l border-slate-200">{row.docNo}</td>
                      <td className="px-1.5 py-1.5 text-right whitespace-nowrap border-l border-slate-200 font-semibold text-slate-900">
                        {row.amount.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-1.5 py-1.5 text-left border-l border-slate-200">{row.note}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
