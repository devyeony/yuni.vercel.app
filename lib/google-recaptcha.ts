import { externalApiInfo } from "@/constants/external-api-info";

export const verifyCaptcha = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(
      externalApiInfo.googleRecaptcha.verifyUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      }
    );

    const data = await response.json();
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error("Captcha verification failed:", error);
    return false;
  }
};