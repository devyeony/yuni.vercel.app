import emailjs from '@emailjs/browser';
import { EmailData } from '@/types/email';

export const sendEmail = async (
  emailData: EmailData,
  messages: {
    successMessage: string;
    errorMessage: string;
    unknownMessage: string;
  }
): Promise<{ success: boolean; message: string }> => {
  let success = false;
  let message = messages.unknownMessage;

  try {
    const res = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        name: emailData.name,
        email: emailData.email,
        message: emailData.message,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );

    if (res.status === 200) {
      success = true;
      message = messages.successMessage;
    } else {
      message = messages.errorMessage;
    }
  } catch (error) {
    message = messages.unknownMessage;
  }

  return {
    success,
    message,
  };
};
