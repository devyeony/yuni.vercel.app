import { externalApiInfo } from "@/constants/external-api-info";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const verifyCaptcha = async (token: string): Promise<{ data: any }> => {
  const secret = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;

  const res = await fetch(externalApiInfo.googleRecaptcha.verifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await res.json();
  if (data.success && data.score > 0.5) {
    return { data };
  } else {
    throw new Error("reCAPTCHA verification failed");
  }
};

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ message: "reCAPTCHA token is missing" }, { status: 400 });
  }

  try {
    const { data } = await verifyCaptcha(token);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message: errorMessage }, { status: errorMessage === "reCAPTCHA verification failed" ? 403 : 500 }
    );
  }
}
