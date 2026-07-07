"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

type Props = {
  rows: PettyCashRow[];
  lastUpdated?: string;
};

type SelectOption = {
  value: string;
  label: string;
};

function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "เลือก...",
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 pr-9 text-left text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
      >
        <span className="block truncate">{selectedLabel}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1.5 max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-xl bg-white py-1 shadow-xl shadow-slate-200/70">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-primary-50 ${
                option.value === value ? "bg-primary-50 font-medium text-primary-700" : "text-slate-700"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PettyCashTable({ rows, lastUpdated }: Props) {
  const [fontSizePercent, setFontSizePercent] = useState(120);
  const [receiverFilter, setReceiverFilter] = useState("");
  const [instituteFilter, setInstituteFilter] = useState("");
  const [detailFilter, setDetailFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const orderedRows = useMemo(() => {
    return [...rows].reverse();
  }, [rows]);

  const filteredRows = useMemo(() => {
    const textMatch = (value: string, keyword: string) => {
      if (!keyword) return true;
      return value.toLowerCase().includes(keyword.toLowerCase());
    };

    return orderedRows.filter((row) => {
      const receiverMatch = textMatch(row.receiver, receiverFilter);
      const instituteMatch = textMatch(row.institute, instituteFilter);
      const detailMatch = textMatch(row.detail, detailFilter);
      const groupMatch = textMatch(row.groupName, groupFilter);
      const dateMatch = textMatch(row.date, dateFilter);

      const monthMatch = !monthFilter
        ? true
        : row.monthLabel.includes(monthFilter) ||
          row.transferDate.includes(monthFilter) ||
          row.date.includes(monthFilter);

      const numericYear = yearFilter.replace(/[^0-9]/g, "");

      const yearMatch = numericYear.length < 4
        ? true
        : row.transferDate.includes(numericYear) ||
          row.date.includes(numericYear) ||
          row.monthLabel.includes(numericYear);

      return (
        receiverMatch &&
        instituteMatch &&
        detailMatch &&
        groupMatch &&
        dateMatch &&
        monthMatch &&
        yearMatch
      );
    });
  }, [
    orderedRows,
    receiverFilter,
    instituteFilter,
    detailFilter,
    groupFilter,
    dateFilter,
    monthFilter,
    yearFilter,
  ]);

  const handleClearFilters = () => {
    setReceiverFilter("");
    setInstituteFilter("");
    setDetailFilter("");
    setGroupFilter("");
    setMonthFilter("");
    setYearFilter("");
    setDateFilter("");
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 border-l-4 border-[color:var(--color-brand-red)] pl-3 text-base font-semibold text-primary-900 sm:text-lg">
          <span className="text-primary-600">
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
              <circle cx="11" cy="11" r="6" />
              <line x1="16" y1="16" x2="21" y2="21" />
            </svg>
          </span>
          <span>ค้นหารายการ</span>
        </h2>
      </div>

      <div className="mb-3 space-y-2.5 rounded-lg border border-primary-100 bg-slate-50 p-2.5 text-sm text-slate-700">
        <div className="grid gap-2 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">ชื่อผู้รับเงิน</label>
            <input
              type="text"
              placeholder="พิมพ์ชื่อผู้รับเงิน"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
              value={receiverFilter}
              onChange={(e) => setReceiverFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">ฝ่าย / สถาบัน</label>
            <input
              type="text"
              placeholder="เช่น สส, สวอ"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
              value={instituteFilter}
              onChange={(e) => setInstituteFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">รายละเอียดการเบิก</label>
            <input
              type="text"
              placeholder="เช่น พาหนะ, ค่าเดินทาง, ค่าอาหารว่าง"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
              value={detailFilter}
              onChange={(e) => setDetailFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">กลุ่ม / งาน</label>
            <input
              type="text"
              placeholder="เช่น งานจัดนิทรรศการ"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">วันที่</label>
            <input
              type="text"
              placeholder="เช่น 4 พ.ย., 28 ต.ค., 30-31 ต.ค."
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">เดือนที่เบิกจ่าย</label>
            <CustomSelect
              value={monthFilter}
              onChange={setMonthFilter}
              options={[
                { value: "", label: "ทั้งหมด" },
                { value: "มกราคม", label: "มกราคม" },
                { value: "กุมภาพันธ์", label: "กุมภาพันธ์" },
                { value: "มีนาคม", label: "มีนาคม" },
                { value: "เมษายน", label: "เมษายน" },
                { value: "พฤษภาคม", label: "พฤษภาคม" },
                { value: "มิถุนายน", label: "มิถุนายน" },
                { value: "กรกฎาคม", label: "กรกฎาคม" },
                { value: "สิงหาคม", label: "สิงหาคม" },
                { value: "กันยายน", label: "กันยายน" },
                { value: "ตุลาคม", label: "ตุลาคม" },
                { value: "พฤศจิกายน", label: "พฤศจิกายน" },
                { value: "ธันวาคม", label: "ธันวาคม" },
              ]}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">ปีที่เบิกจ่าย</label>
            <input
              type="text"
              placeholder="เช่น 2568"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-400"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            />
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
              <th className="px-1.5 py-1.5 text-center border-l border-slate-200 min-w-[70px]">เดือนที่เบิก</th>
              <th className="px-1.5 py-1.5 text-center border-l border-slate-200 min-w-[70px]">วันที่โอน</th>
              <th className="px-1.5 py-1.5 text-center border-l border-slate-200 w-24">เลขที่ใบสำคัญฯ</th>
              <th className="px-1.5 py-1.5 text-left border-l border-slate-200 min-w-[120px]">รายละเอียดการเบิก</th>
              <th className="px-1.5 py-1.5 text-left border-l border-slate-200 min-w-[100px]">กลุ่มฯ/งาน</th>
              <th className="px-1.5 py-1.5 text-left border-l border-slate-200 min-w-[70px]">วันที่</th>
              <th className="px-1.5 py-1.5 text-left border-l border-slate-200 min-w-[80px]">ผู้รับเงิน</th>
              <th className="px-1.5 py-1.5 text-right whitespace-nowrap border-l border-slate-200">จำนวนเงิน</th>
              <th className="px-1.5 py-1.5 text-center border-l border-slate-200 min-w-[80px]">ฝ่าย/สถาบัน</th>
              <th className="px-1.5 py-1.5 text-center border-l border-slate-200 min-w-[100px]">หมายเหตุ</th>
              <th className="px-1.5 py-1.5 text-center border-l border-slate-200 min-w-[70px]">เบิกล่วงหน้า</th>
              <th className="px-1.5 py-1.5 text-center border-l border-slate-200 min-w-[70px]">คงเหลือคืน</th>
              <th className="px-1.5 py-1.5 text-center border-l border-slate-200 min-w-[80px]">ใบเบิกล่วงหน้า</th>
              </tr>
            </thead>
            <tbody 
              className="text-slate-800 divide-y divide-slate-200 transition-all duration-200"
              style={{ fontSize: `${(fontSizePercent / 100) * 0.75}rem` }}
            >
              {filteredRows.map((row, index) => {
                const isSelected = row.id === selectedRowId;
                const baseColor =
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-[color:var(--color-surface-subtle)]";

                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedRowId(row.id)}
                    className={`${
                      isSelected ? "bg-primary-100" : baseColor
                    } hover:bg-primary-50 cursor-pointer transition-colors`}
                  >
                <td className="px-1.5 py-1.5 text-center border-l border-slate-200">{row.monthLabel}</td>
                <td className="px-1.5 py-1.5 text-center border-l border-slate-200">{row.transferDate}</td>
                <td className="px-1.5 py-1.5 text-center border-l border-slate-200 text-[0.85em] leading-tight">{row.docNo}</td>
                <td className="px-1.5 py-1.5 text-left border-l border-slate-200">{row.detail}</td>
                <td className="px-1.5 py-1.5 text-left border-l border-slate-200">{row.groupName}</td>
                <td className="px-1.5 py-1.5 text-left border-l border-slate-200">{row.date}</td>
                <td className="px-1.5 py-1.5 text-left border-l border-slate-200">{row.receiver}</td>
                <td className="px-1.5 py-1.5 text-right whitespace-nowrap border-l border-slate-200 font-semibold text-slate-900">
                  {row.amount.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-1.5 py-1.5 text-center border-l border-slate-200">{row.institute}</td>
                <td className="px-1.5 py-1.5 text-center border-l border-slate-200">{row.note}</td>
                <td className="px-1.5 py-1.5 text-center border-l border-slate-200">{row.advance.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-1.5 py-1.5 text-center border-l border-slate-200">{row.refund.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-1.5 py-1.5 text-center border-l border-slate-200 text-[0.85em] leading-tight">{row.advNo}</td>
              </tr>
            );
          })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
