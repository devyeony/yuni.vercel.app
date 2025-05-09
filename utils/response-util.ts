import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";

type TranslatableError = Error & { translationKey?: string; statusCode?: number };

export const sendSuccess = (data: any = {}, status = 200) => {
  return NextResponse.json({ success: true, data }, { status });
};

export const sendError = async (
  error: TranslatableError,
  locale: string = "en",
  namespace = "Messages.error"
) => {
  const t = await getTranslations({ locale, namespace });
  const message = error.translationKey ? t(error.translationKey) : error.message;

  const statusCode = error.statusCode ?? 500;

  return NextResponse.json({ success: false, message }, { status: statusCode });
};

export const sendUnknownError = async (
  locale: string = "en",
  namespace = "Messages.error"
) => {
  const t = await getTranslations({ locale, namespace });
  const message = t("unknown");

  return NextResponse.json({ success: false, message }, { status: 500 });
};
