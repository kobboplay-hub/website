"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, type LucideIcon } from "lucide-react";
import type { AgeGroup } from "@/lib/shopify/types";
import { ageGroupHref } from "@/lib/shop-by-age";

const ALL_PRODUCTS_PATH = "/shop";
const HOVER_CLOSE_DELAY_MS = 140;

interface ShopByAgeDropdownProps {
  label: string;
  ageGroups: AgeGroup[];
  pathname: string;
  active: boolean;
}

export function ShopByAgeDropdown({
  label,
  ageGroups,
  pathname,
  active,
}: ShopByAgeDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinnedRef = useRef(false);
  const pointerTypeRef = useRef<string>("");
  const suppressFocusOpenRef = useRef(false);
  const menuId = useId();

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const close = useCallback((restoreFocus = false) => {
    clearCloseTimer();
    pinnedRef.current = false;
    setOpen(false);
    if (restoreFocus && document.activeElement !== triggerRef.current) {
      suppressFocusOpenRef.current = true;
      triggerRef.current?.focus();
    }
  }, []);

  useEffect(() => clearCloseTimer, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const focusInside = rootRef.current?.contains(document.activeElement);
      close(Boolean(focusInside));
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const getItems = () =>
    Array.from(
      rootRef.current?.querySelectorAll<HTMLAnchorElement>(
        "[data-age-menu-item]",
      ) ?? [],
    );

  const focusItem = (index: number) => {
    const items = getItems();
    if (items.length === 0) return;
    items[(index + items.length) % items.length]?.focus();
  };

  const openAndFocus = (index: number) => {
    clearCloseTimer();
    setOpen(true);
    requestAnimationFrame(() => focusItem(index));
  };

  const handleTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) {
      // Keyboard activation (Enter / Space)
      if (open) focusItem(0);
      else openAndFocus(0);
      return;
    }

    if (pointerTypeRef.current === "mouse") {
      if (!open) {
        setOpen(true);
        pinnedRef.current = true;
      } else if (!pinnedRef.current) {
        pinnedRef.current = true;
      } else {
        close();
      }
      return;
    }

    if (open) close();
    else setOpen(true);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openAndFocus(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openAndFocus(-1);
    }
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    const items = getItems();
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (index === -1) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(-1);
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        clearCloseTimer();
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse" || pinnedRef.current) return;
        if (rootRef.current?.querySelector(":focus-visible")) return;
        clearCloseTimer();
        closeTimerRef.current = setTimeout(() => close(), HOVER_CLOSE_DELAY_MS);
      }}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          close();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onPointerDown={(event) => {
          pointerTypeRef.current = event.pointerType;
        }}
        onFocus={(event) => {
          if (suppressFocusOpenRef.current) {
            suppressFocusOpenRef.current = false;
            return;
          }
          if (event.currentTarget.matches(":focus-visible")) setOpen(true);
        }}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        className={`relative inline-flex items-center gap-1 text-sm transition-colors hover:text-kobbo-black/70 ${
          active
            ? "font-semibold text-kobbo-black after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-kobbo-yellow"
            : "font-medium text-kobbo-black"
        }`}
      >
        {label}
        <ChevronDown
          aria-hidden
          className={`h-3.5 w-3.5 transition-transform duration-200 ease-out ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2.25}
        />
      </button>

      <div
        id={menuId}
        onKeyDown={handleMenuKeyDown}
        className={`absolute left-1/2 top-full z-[60] w-56 -translate-x-1/2 pt-3 transition-[opacity,translate,visibility] duration-200 ease-out ${
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="rounded-xl border border-kobbo-beige bg-kobbo-white p-1.5 shadow-soft-lg">
          <ul>
            {ageGroups.map((group) => {
              const href = ageGroupHref(group.handle);
              const isCurrent = pathname === href;

              return (
                <li key={group.id}>
                  <Link
                    href={href}
                    data-age-menu-item
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => close()}
                    className={`group flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none transition-colors focus-visible:bg-kobbo-cream ${
                      isCurrent
                        ? "bg-kobbo-yellow/15 font-semibold text-kobbo-black"
                        : "font-medium text-kobbo-black/85 hover:bg-kobbo-cream hover:text-kobbo-black"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                        isCurrent
                          ? "bg-kobbo-yellow"
                          : "bg-kobbo-beige group-hover:bg-kobbo-yellow group-focus-visible:bg-kobbo-yellow"
                      }`}
                    />
                    {group.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mx-1.5 my-1 border-t border-kobbo-beige/80" />

          <Link
            href={ALL_PRODUCTS_PATH}
            data-age-menu-item
            onClick={() => close()}
            className="group flex min-h-9 items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold text-kobbo-muted outline-none transition-colors hover:bg-kobbo-cream hover:text-kobbo-black focus-visible:bg-kobbo-cream focus-visible:text-kobbo-black"
          >
            All toys
            <ArrowRight
              aria-hidden
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ShopByAgeAccordionProps {
  label: string;
  icon: LucideIcon;
  ageGroups: AgeGroup[];
  pathname: string;
  active: boolean;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

export function ShopByAgeAccordion({
  label,
  icon: Icon,
  ageGroups,
  pathname,
  active,
  expanded,
  onToggle,
  onNavigate,
}: ShopByAgeAccordionProps) {
  const panelId = useId();

  const childLinkClass = (isCurrent: boolean) =>
    `flex min-h-11 w-full items-center rounded-lg px-3 text-sm transition-colors ${
      isCurrent
        ? "bg-kobbo-yellow/15 font-bold text-kobbo-black"
        : "font-semibold text-kobbo-black/85 hover:bg-kobbo-cream/80 active:bg-kobbo-beige"
    }`;

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
        className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors ${
          active
            ? "bg-kobbo-cream font-bold"
            : "hover:bg-kobbo-cream/80 active:bg-kobbo-beige"
        }`}
      >
        <span
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
            active
              ? "bg-kobbo-yellow text-kobbo-black"
              : "bg-kobbo-yellow/25 text-kobbo-black"
          }`}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <span
          className={`min-w-0 flex-1 text-left text-sm leading-tight ${
            active
              ? "font-bold text-kobbo-black"
              : "font-semibold text-kobbo-black/90"
          }`}
        >
          {label}
        </span>
        <ChevronDown
          aria-hidden
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ease-out ${
            expanded ? "rotate-180 text-kobbo-black" : "text-kobbo-muted/70"
          }`}
          strokeWidth={2}
        />
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,opacity,visibility] duration-200 ease-out ${
          expanded
            ? "visible grid-rows-[1fr] opacity-100"
            : "invisible grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="ml-7 mt-0.5 space-y-0.5 border-l-2 border-kobbo-yellow/40 py-1 pl-3">
            {ageGroups.map((group) => {
              const href = ageGroupHref(group.handle);
              const isCurrent = pathname === href;
              return (
                <li key={group.id}>
                  <Link
                    href={href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={onNavigate}
                    className={childLinkClass(isCurrent)}
                  >
                    <span className="min-w-0 break-words">{group.name}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={ALL_PRODUCTS_PATH}
                aria-current={pathname === ALL_PRODUCTS_PATH ? "page" : undefined}
                onClick={onNavigate}
                className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-xs font-semibold text-kobbo-muted transition-colors hover:bg-kobbo-cream/80 hover:text-kobbo-black active:bg-kobbo-beige"
              >
                All toys
                <ArrowRight aria-hidden className="h-3.5 w-3.5" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
