"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Category } from "@/types/wordpress";
import { AngleDownIcon } from "@/components/layout/icons";

interface BlogHeroCategoryMenuProps {
  categories: Category[];
}

export function BlogHeroCategoryMenu({ categories }: BlogHeroCategoryMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-full w-[128px] items-center justify-between rounded-[4px] border-[0.5px] border-[rgba(132,134,136,0.3)] bg-white px-[8.5px] py-[8.5px] text-[16px] font-medium text-black sm:px-[16.5px]"
      >
        <span className="opacity-80">Categorias</span>
        <AngleDownIcon className="size-3" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-1 max-h-[min(70vh,32rem)] w-[min(21rem,calc(100vw-2rem))] overflow-y-auto rounded-[4px] border-[0.5px] border-[rgba(132,134,136,0.3)] bg-white py-2 shadow-lg"
        >
          <Link
            href="/"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-[#373435] hover:bg-neutral-100"
          >
            Todas
          </Link>
          <Link
            href="/categorias"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="block border-b border-neutral-100 px-4 py-2 text-sm font-semibold text-[#373435] hover:bg-neutral-100"
          >
            Ver todas as categorias
          </Link>
          {categories.map((category) => (
            <div
              key={category.databaseId}
              role="group"
              aria-label={category.name}
              className="border-b border-neutral-100 px-4 py-3 last:border-b-0"
            >
              <Link
                href={`/${category.slug}`}
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="block text-sm font-semibold text-[#373435] hover:underline"
              >
                {category.name}
              </Link>
              {(category.children?.nodes ?? []).length > 0 && (
                <ul className="mt-2 grid gap-x-3 gap-y-1.5 pl-3 sm:grid-cols-2">
                  {category.children?.nodes.map((child) => (
                    <li key={child.databaseId}>
                      <Link
                        href={`/${child.slug}`}
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                        className="block py-1 text-xs leading-5 text-neutral-600 hover:text-black hover:underline"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
