import sanitizeHtml from "sanitize-html";
import { useTranslations } from "next-intl";

export function useSafeRawHtml(
  namespace: string,
  key: string,
  options?: sanitizeHtml.IOptions
): string {
  const t = useTranslations(namespace);

  const defaultOptions: sanitizeHtml.IOptions = {
    allowedTags: ["i", "b", "em", "strong", "br"],
    allowedAttributes: {},
    ...options,
  };

  const raw = t.raw(key);
  return sanitizeHtml(raw, defaultOptions);
}
