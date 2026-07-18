"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { NavLink } from "@/components/nav-link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/*
 * Phone/small-tablet navigation ("use client": open state must close on
 * navigate). Six nav items measure ~395 px of content — overflowing both the
 * 360 px row and the 640 px bar once wordmark and controls are counted — so
 * below `md` the nav lives behind a hamburger in a top-sheet dialog; `md`
 * and up keeps the inline row.
 */

const items = [
  "projects",
  "blog",
  "about",
  "design",
  "embeddings",
  "contact",
] as const;

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    >
      <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
    </svg>
  );
}

export function MobileNav() {
  const t = useTranslations("ui.nav");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t("menu")}
          >
            <MenuIcon />
          </Button>
        }
      />
      <DialogContent className="top-0 left-0 w-full max-w-none translate-x-0 translate-y-0 rounded-none border-x-0 border-t-0 p-4 data-[starting-style]:scale-100 data-[ending-style]:scale-100 md:hidden">
        <DialogTitle className="sr-only">{t("menu")}</DialogTitle>
        <nav aria-label={t("primary")}>
          <ul className="flex flex-col">
            {items.map((key) => (
              <li key={key}>
                <NavLink
                  href={`/${key}`}
                  className="min-h-11 w-full px-3 text-sm"
                  onClick={() => setOpen(false)}
                >
                  {t(key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
