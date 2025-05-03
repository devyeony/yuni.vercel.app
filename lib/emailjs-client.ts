import emailjs from "@emailjs/browser";
import { verifyCaptcha } from "@/lib/google-recaptcha";

interface EmailData {
  name: string;
  email: string;
  message: string;
}

export const sendEmail = async (emailData: EmailData, captchaToken: string) => {
  const isHuman = await verifyCaptcha(captchaToken);
  if (!isHuman) {
    throw new Error("reCAPTCHA verification failed");
  }

  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        name: emailData.name,
        email: emailData.email,
        message: emailData.message,
        captchaToken,
      },
      process.env.EMAILJS_PUBLIC_KEY!,
    );
    console.log('Email sent successfully', response.text);
    return true;
  } catch (error) {
    console.error('Error sending email', error);
    return false;
  }
};