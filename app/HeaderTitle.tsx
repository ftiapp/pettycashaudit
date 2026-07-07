"use client";

import { usePathname } from "next/navigation";

export default function HeaderTitle() {
  const pathname = usePathname();

  const isPending = pathname === "/pending";

  return (
    <div className="flex flex-col leading-snug">
      <span className="inline-flex items-center gap-1.5 text-base font-semibold tracking-wide sm:text-lg">
        <span>{isPending ? "รายการค้างชำระ" : "รายการโอนเงินสดย่อย"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-9 w-9 drop-shadow-[0_0_3px_rgba(0,0,0,0.25)]"
        >
          <rect x="4" y="6.5" width="14" height="8.5" rx="1.2" className="fill-emerald-500" />
          <rect x="5.3" y="7.6" width="11.4" height="6.3" rx="1" className="fill-emerald-100" />
          <circle cx="10.5" cy="10.8" r="2.1" className="fill-emerald-400" />
          <ellipse cx="14.5" cy="13.8" rx="2.1" ry="0.9" className="fill-amber-300" />
          <rect x="12.4" y="11.2" width="4.2" height="2.6" rx="1.3" className="fill-amber-300" />
          <ellipse cx="11.1" cy="13.2" rx="1.7" ry="0.8" className="fill-amber-200" />
          <rect x="9.4" y="11.6" width="3.4" height="2" rx="1" className="fill-amber-200" />
        </svg>
      </span>
      <span className="hidden text-[11px] font-medium text-[color:var(--color-brand-red)] sm:inline">
        {isPending
          ? "รายละเอียดรายการค้างชำระ-สภาอุตสาหกรรม"
          : "รายละเอียดการโอนเงินสดย่อยประจำวัน-สภาอุตสาหกรรม"}
      </span>
    </div>
  );
}
