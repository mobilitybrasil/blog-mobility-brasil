"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category } from "@/types/wordpress";
import { ACCOUNT_URL, HELP_URL } from "@/lib/site";
import {
  AccessibilityIcon,
  AngleDownIcon,
  AngleRightIcon,
  BarsIcon,
  CloseIcon,
  PersonIcon,
  SearchIcon,
} from "./icons";

interface HeaderMobileMenuProps {
  categories: Category[];
}

/**
 * Botão "hambúrguer" + drawer mobile que desliza da esquerda para a direita.
 * Categorias com filhos expandem in-place (acordeão) ao toque.
 */
export function HeaderMobileMenu({ categories }: HeaderMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    setExpandedSlug(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-drawer"
        className="flex size-10 items-center justify-center text-white"
      >
        <BarsIcon className="size-5" />
      </button>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          aria-label="Fechar menu"
          tabIndex={isOpen ? 0 : -1}
          onClick={close}
          className="absolute inset-0 bg-black/40"
        />

        <aside
          id="mobile-menu-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de categorias"
          className={`absolute left-0 top-0 flex h-full w-[min(343px,85vw)] flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-[60px] items-center justify-between border-b border-[var(--color-brand-border)] px-4">
            <div className="flex items-center gap-3 text-[color:var(--color-brand-black)]">
              <BarsIcon className="size-[18px]" />
              <span className="font-display text-[14px] font-medium uppercase tracking-[0.05em]">
                Menu
              </span>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar menu"
              className="flex size-10 items-center justify-center text-[color:var(--color-brand-black)]"
            >
              <CloseIcon className="size-[18px]" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <nav className="flex-1 overflow-y-auto py-2" aria-label="Categorias">
              <ul>
                <li>
                  <Link
                    href="/buscar"
                    onClick={close}
                    className="flex items-center gap-3 px-5 py-3 text-base font-medium text-[color:var(--color-brand-black)]"
                  >
                    <SearchIcon className="size-[18px]" />
                    Buscar artigos
                  </Link>
                </li>
                {categories.map((category) => {
                  const children = category.children?.nodes ?? [];
                  const hasChildren = children.length > 0;
                  const isExpanded = expandedSlug === category.slug;
                  const slug = category.slug;

                  return (
                    <li key={category.databaseId}>
                      <div className="flex w-full items-center">
                        <Link
                          href={`/${slug}`}
                          onClick={close}
                          className="flex-1 px-5 py-2 text-base text-[color:var(--color-brand-black)]"
                        >
                          {category.name}
                        </Link>
                        {hasChildren && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedSlug(isExpanded ? null : slug)
                            }
                            aria-label={
                              isExpanded
                                ? `Recolher ${category.name}`
                                : `Expandir ${category.name}`
                            }
                            aria-expanded={isExpanded}
                            className="flex size-10 items-center justify-center text-[color:var(--color-brand-black)]"
                          >
                            {isExpanded ? (
                              <AngleDownIcon className="size-4" />
                            ) : (
                              <AngleRightIcon className="size-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {hasChildren && isExpanded && (
                        <ul className="bg-[var(--color-brand-surface)]">
                          {children.map((child) => (
                            <li key={child.databaseId}>
                              <Link
                                href={`/${child.slug}`}
                                onClick={close}
                                className="block px-9 py-2 text-sm text-[color:var(--color-brand-black)]"
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
                <li>
                  <Link
                    href="/"
                    onClick={close}
                    className="block px-5 py-2 text-base text-[color:var(--color-brand-black)]"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </nav>

            <a
              href={HELP_URL}
              target="_blank"
              rel="noreferrer"
              className="mx-5 mb-3 mt-2 flex items-center gap-3 rounded text-[color:var(--color-brand-black)]"
            >
              <AccessibilityIcon className="size-[18px]" />
              <span className="text-base">Precisa de ajuda?</span>
            </a>

            <a
              href={ACCOUNT_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 border-t border-[var(--color-brand-border)] bg-[var(--color-brand-surface)] px-4 py-4 text-[color:var(--color-brand-black)]"
            >
              <PersonIcon className="size-[15px]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.05em]">
                Entre ou cadastre-se
              </span>
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
