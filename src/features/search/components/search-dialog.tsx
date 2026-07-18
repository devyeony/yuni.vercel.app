"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { type SearchChunk, search } from "@/features/search/lib/engine";
import { Link } from "@/i18n/navigation";

/*
 * Site search over the static embedding index ("use client": dialog state,
 * lazy index fetch, and the ⌘K listener). The 125 kB index is fetched once
 * on first open and cached for the session — no search backend exists.
 */

let cachedChunks: SearchChunk[] | null = null;

type Status = "idle" | "loading" | "ready" | "error";

function SearchIcon() {
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
      <circle cx="7" cy="7" r="4.25" />
      <path d="m10.25 10.25 3.25 3.25" />
    </svg>
  );
}

function ResultLink({
  url,
  kindLabel,
  title,
  detail,
  onNavigate,
}: {
  url: string;
  kindLabel: string;
  title: string;
  detail: string;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={url}
        onClick={onNavigate}
        className="block rounded-sm px-3 py-2 transition-colors duration-(--duration-fast) ease-out-soft hover:bg-surface pointer-coarse:min-h-11"
      >
        <Text as="span" variant="caption" className="font-mono">
          {kindLabel}
        </Text>
        <span className="mt-0.5 block text-base text-text">{title}</span>
        <span className="mt-0.5 block truncate text-sm text-text-muted">
          {detail}
        </span>
      </Link>
    </li>
  );
}

export function SearchDialog() {
  const t = useTranslations("search");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>(cachedChunks ? "ready" : "idle");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open || cachedChunks) return;
    let cancelled = false;
    setStatus("loading");
    fetch("/rag-index.json")
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((index: { chunks: SearchChunk[] }) => {
        if (cancelled) return;
        cachedChunks = index.chunks;
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const results = useMemo(
    () =>
      status === "ready" && cachedChunks
        ? search(cachedChunks, locale, query)
        : null,
    [status, locale, query],
  );

  const close = () => setOpen(false);
  const hasQuery = query.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("open")}
            aria-keyshortcuts="Meta+K Control+K"
          >
            <SearchIcon />
          </Button>
        }
      />
      <DialogContent className="top-24 max-w-lg translate-y-0 p-4">
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("title")}
        />
        <div className="mt-3 max-h-[min(24rem,60vh)] overflow-y-auto">
          {status === "loading" && (
            <Text variant="caption" className="px-3 py-2">
              {t("loading")}
            </Text>
          )}
          {status === "error" && (
            <Text variant="caption" className="px-3 py-2">
              {t("error")}
            </Text>
          )}
          {results && !hasQuery && (
            <Text variant="caption" className="px-3 py-2">
              {t("hint")}
            </Text>
          )}
          {results && hasQuery && results.matches.length === 0 && (
            <Text variant="caption" className="px-3 py-2">
              {t("empty", { query: query.trim() })}
            </Text>
          )}
          {results && results.matches.length > 0 && (
            <section aria-label={t("matches")}>
              <Text as="span" variant="caption" className="block px-3 pt-1">
                {t("matches")}
              </Text>
              <ul className="mt-1">
                {results.matches.map((match) => (
                  <ResultLink
                    key={`${match.url}:${match.title}`}
                    url={match.url}
                    kindLabel={t(`kind.${match.kind}`)}
                    title={match.title}
                    detail={match.snippet}
                    onNavigate={close}
                  />
                ))}
              </ul>
            </section>
          )}
          {results && results.nearby.length > 0 && (
            <section aria-label={t("nearby")}>
              <Text as="span" variant="caption" className="block px-3 pt-3">
                {t("nearby")}
              </Text>
              <ul className="mt-1">
                {results.nearby.map((item) => (
                  <ResultLink
                    key={`${item.url}:${item.title}`}
                    url={item.url}
                    kindLabel={t(`kind.${item.kind}`)}
                    title={item.title}
                    detail={t("similarity", {
                      score: item.similarity.toFixed(2),
                    })}
                    onNavigate={close}
                  />
                ))}
              </ul>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
