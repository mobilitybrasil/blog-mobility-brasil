"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Category } from "@/types/wordpress";
import { AngleDownIcon } from "./icons";

interface HeaderDesktopNavProps {
  categories: Category[];
}

export function HeaderDesktopNav({ categories }: HeaderDesktopNavProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = (slug: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenSlug(slug);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenSlug(null), 180);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <ul className="flex items-center gap-4 xl:gap-8">
      {categories.map((category) => {
        const children = category.children?.nodes ?? [];
        const hasChildren = children.length > 0;
        const href = `/${category.slug}`;
        const isOpen = openSlug === category.slug;

        return (
          <li
            key={category.databaseId}
            onMouseEnter={() => hasChildren && open(category.slug)}
            onMouseLeave={() => hasChildren && scheduleClose()}
            onFocus={() => hasChildren && open(category.slug)}
            onBlur={(event) => {
              if (
                hasChildren &&
                !event.currentTarget.contains(event.relatedTarget as Node)
              ) {
                scheduleClose();
              }
            }}
          >
            <Link
              href={href}
              className="font-display flex items-center gap-1.5 py-2 text-[12px] font-medium uppercase italic tracking-[0.05em] text-white transition-opacity hover:opacity-80"
              aria-haspopup={hasChildren || undefined}
              aria-expanded={hasChildren ? isOpen : undefined}
            >
              {category.name}
              {hasChildren && <AngleDownIcon className="size-3" />}
            </Link>

            {hasChildren && (
              <div
                className={`absolute left-0 right-0 top-full z-40 bg-neutral-100 shadow-[0_4px_2px_rgba(0,0,0,0.08)] ${
                  isOpen ? "block" : "hidden"
                }`}
                onMouseEnter={() => open(category.slug)}
                onMouseLeave={scheduleClose}
              >
                <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 px-8 py-3">
                  {children.map((child) => (
                    <li key={child.databaseId}>
                      <Link
                        href={`/${child.slug}`}
                        className="font-display block text-[12px] font-medium uppercase italic tracking-[0.05em] text-neutral-800 transition-opacity hover:opacity-70"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
      <li>
        <Link
          href="/categorias"
          className="font-display flex items-center py-2 text-[12px] font-semibold uppercase italic tracking-[0.05em] text-white underline-offset-4 transition-opacity hover:opacity-80 hover:underline"
        >
          Ver todas
        </Link>
      </li>
    </ul>
  );
}
