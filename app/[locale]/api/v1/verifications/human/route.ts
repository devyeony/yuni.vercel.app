export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { getLocale } from 'next-intl/server';
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { BaseError, CaptchaInvalidError, TooManyRequestsError } from "@/errors";
import { sendSuccess, sendError, sendUnknownError } from "@/utils/response-util";
import { externalApiInfo } from "@/constants/external-api-info";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});

async function verifyCaptcha(token: string): Promise<any> {
  const secret = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;

  const res = await fetch(externalApiInfo.googleRecaptcha.verifyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await res.json();

  if (data.success && data.score > 0.5) {
    return data;
  }

  throw new CaptchaInvalidError();
}

async function checkRateLimit(ip: string): Promise<void> {
  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    throw new TooManyRequestsError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token || typeof token !== "string") {
      throw new CaptchaInvalidError();
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    await checkRateLimit(ip);

    await verifyCaptcha(token);

    return sendSuccess();
  } catch (error) {
    const locale = await getLocale();

    if (error instanceof BaseError) {
      return await sendError(error, locale);
    }

    return await sendUnknownError(locale);
  }
}
