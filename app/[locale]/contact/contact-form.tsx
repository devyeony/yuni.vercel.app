"use client";

import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useTranslations } from "next-intl";
import { ClipLoader } from "react-spinners";
import InputField from "@/components/input-field";
import { verifyCaptcha } from "@/services/captcha-service";
import { sendEmail } from "@/services/email-service";

export default function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    const confirmSend = window.confirm("Ready to send your message?");
    if (!confirmSend) return;

    if (!executeRecaptcha) {
      alert("reCAPTCHA is not ready. Please try again later.");
      return;
    }

    const token = await executeRecaptcha("contact_form");
    const isHuman = await verifyCaptcha(token);

    if (!isHuman) {
      alert("reCAPTCHA verification failed. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const emailSent = await sendEmail(formData);

      if (emailSent) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = useTranslations("Contact");

  return (
    <div className="w-full p-4 mx-auto max-w-lg sm:max-w-xl md:max-w-2xl">
      <h1 className="text-4xl text-zinc-100 font-mono font-bold inline-flex items-center gap-2">
        {t("title")}
      </h1>
      <p className="max-w-3xl mt-3 mb-10 text-base text-zinc-400 font-mono">
        {t("description")}
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <InputField
          label="Name"
          id="name"
          name="name"
          type="text"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <InputField
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <InputField
          label="Message"
          id="message"
          name="message"
          as="textarea"
          placeholder="Enter Message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="text-lg text-zinc-100 font-mono bg-black tracking-wide rounded-lg px-4 py-3 flex items-center justify-center w-full mt-6 transition-all duration-200 hover:bg-purple-200 hover:text-black"
        >
          {isSubmitting ? (
            <ClipLoader color="#ffffff" loading size={30} />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 548.244 548.244"
              >
                <path
                  fillRule="evenodd"
                  d="M392.19 156.054 211.268 281.667 22.032 218.58C8.823 214.168-.076 201.775 0 187.852c.077-13.923 9.078-26.24 22.338-30.498L506.15 1.549c11.5-3.697 24.123-.663 32.666 7.88 8.542 8.543 11.577 21.165 7.879 32.666L390.89 525.906c-4.258 13.26-16.575 22.261-30.498 22.338-13.923.076-26.316-8.823-30.728-22.032l-63.393-190.153z"
                  clipRule="evenodd"
                />
              </svg>
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
