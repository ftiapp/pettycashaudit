"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const links = [
  { href: "/", label: "รายการโอนเงินสดย่อย" },
  { href: "/pending", label: "รายการค้างชำระ" },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop: pills inside header */}
      <nav className="hidden sm:flex ml-auto items-center gap-2 pr-3 sm:pr-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold shadow transition active:scale-95 ${
              pathname === link.href
                ? "bg-white text-indigo-800 hover:bg-indigo-50"
                : "bg-white/10 text-white hover:bg-white hover:text-indigo-800"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile: hamburger dropdown */}
      <div className="sm:hidden relative ml-auto flex items-center pr-3" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center rounded-lg bg-white/10 p-2 text-white hover:bg-white hover:text-indigo-800 transition"
          aria-label="เมนู"
        >
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
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {open && (
          <div className="absolute right-3 top-full mt-1 w-52 rounded-lg border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-700 hover:bg-slate-50 hover:text-indigo-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
