"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

/** Client leaf: window.print is the whole reason this crosses the boundary. */
export function PrintButton() {
  const t = useTranslations("resume");
  return (
    <Button
      variant="outline"
      className="print-hidden"
      onClick={() => window.print()}
    >
      {t("print")}
    </Button>
  );
}
