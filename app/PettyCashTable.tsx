"use client";

import { useMemo, useState } from "react";

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

export default function PettyCashTable({ rows, lastUpdated }: Props) {
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
        <h2 className="inline-flex items-center gap-2 border-l-4 border-red-500 pl-3 text-base font-semibold text-indigo-800 sm:text-lg">
          <span className="text-indigo-600">
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

      <div className="mb-3 space-y-2.5 rounded-lg border border-indigo-100 bg-slate-50 p-2.5 text-sm text-slate-700">
        <div className="grid gap-2 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">ชื่อผู้รับเงิน</label>
            <input
              type="text"
              placeholder="พิมพ์ชื่อผู้รับเงิน"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
              value={receiverFilter}
              onChange={(e) => setReceiverFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">ฝ่าย / สถาบัน</label>
            <input
              type="text"
              placeholder="เช่น สส, สวอ"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
              value={instituteFilter}
              onChange={(e) => setInstituteFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">รายละเอียดการเบิก</label>
            <input
              type="text"
              placeholder="เช่น พาหนะ, ค่าเดินทาง, ค่าอาหารว่าง"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
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
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">วันที่</label>
            <input
              type="text"
              placeholder="เช่น 4 พ.ย., 28 ต.ค., 30-31 ต.ค."
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">เดือนที่เบิกจ่าย</label>
            <select
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              <option value="มกราคม">มกราคม</option>
              <option value="กุมภาพันธ์">กุมภาพันธ์</option>
              <option value="มีนาคม">มีนาคม</option>
              <option value="เมษายน">เมษายน</option>
              <option value="พฤษภาคม">พฤษภาคม</option>
              <option value="มิถุนายน">มิถุนายน</option>
              <option value="กรกฎาคม">กรกฎาคม</option>
              <option value="สิงหาคม">สิงหาคม</option>
              <option value="กันยายน">กันยายน</option>
              <option value="ตุลาคม">ตุลาคม</option>
              <option value="พฤศจิกายน">พฤศจิกายน</option>
              <option value="ธันวาคม">ธันวาคม</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">ปีที่เบิกจ่าย</label>
            <input
              type="text"
              placeholder="เช่น 2568"
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-4 py-1 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-500 hover:text-white hover:border-red-600 hover:shadow-md transition-colors"
            onClick={handleClearFilters}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-3 w-3"
                fill="none"
                stroke="#ef4444"
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
            </span>
            <span>ล้างตัวกรอง</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-[480px] lg:max-h-[70vh] overflow-y-auto">
          <table className="w-full text-left text-sm border border-slate-200 rounded-lg">
            <thead className="sticky top-0 z-10 bg-indigo-800 font-medium text-slate-50">
              <tr>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">เดือนที่เบิก</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">วันที่โอน</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">เลขที่ใบสำคัญจ่ายเงินสดย่อย</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">รายละเอียดการเบิก</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">กลุ่มฯ/งาน</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">วันที่</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">ผู้รับเงิน</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">จำนวนเงิน</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">ฝ่าย/สถาบัน</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">หมายเหตุ</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">เบิกล่วงหน้า</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">คงเหลือคืน</th>
              <th className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">เลขที่ใบเบิกล่วงหน้า</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-800 divide-y divide-slate-200">
              {filteredRows.map((row, index) => {
                const isSelected = row.id === selectedRowId;
                const baseColor =
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-indigo-50";

                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedRowId(row.id)}
                    className={`${
                      isSelected ? "bg-amber-100" : baseColor
                    } hover:bg-amber-50 cursor-pointer transition-colors`}
                  >
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">{row.monthLabel}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">{row.transferDate}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">{row.docNo}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">{row.detail}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">{row.groupName}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">{row.date}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">{row.receiver}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200 font-semibold text-slate-900">
                  {row.amount.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">{row.institute}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">{row.note}</td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">
                  {row.advance.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">
                  {row.refund.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-center whitespace-nowrap border-l border-slate-200">{row.advNo}</td>
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
