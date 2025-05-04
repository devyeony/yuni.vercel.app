export const verifyCaptcha = async (token: string): Promise<boolean> => {
  try {
    const res = await fetch("/api/captchas/validation", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      console.log("CAPTCHA verified successfully");
      return true;
    } else {
      console.error("Error verifying CAPTCHA");
      return false;
    }
  } catch (error) {
    console.error("Internal Server Error");
    return false;
  }
};