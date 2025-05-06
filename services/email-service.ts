import emailjs from '@emailjs/browser';
import { EmailData } from '@/types/email';

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const res = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        name: emailData.name,
        email: emailData.email,
        message: emailData.message
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );

    if (res.status === 200) {
      console.log("Email sent successfully");
      return true;
    } else {
      console.error("Error sending email");
      return false;
    }
  } catch (error) {
    console.error("External API Server Error", error);
    return false;
  }
};