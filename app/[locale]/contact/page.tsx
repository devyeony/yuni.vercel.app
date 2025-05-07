"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import ContactForm from "./form";

export default function Contact() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY!}>
      <ContactForm />
    </GoogleReCaptchaProvider>
  );
}
