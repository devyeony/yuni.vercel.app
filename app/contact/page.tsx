"use client";

import { useState } from "react";
import { sendEmail } from "@/lib/emailjs-client";
import Recaptcha from "@/components/recaptcha";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message || !captchaValue) {
      alert("Please fill in all fields and complete the CAPTCHA.");
      return;
    }

    const confirmSend = window.confirm("Ready to send your message?");
    if (confirmSend) {
      const emailSent = await sendEmail(formData, "");

      if (emailSent) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setCaptchaValue(null);
      } else {
        alert("Failed to send message. Please try again.");
      }
    }

    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full p-4 mx-auto max-w-lg sm:max-w-xl md:max-w-2xl">
      <h1 className="text-4xl text-zinc-100 font-mono font-bold inline-flex items-center gap-2">
        Contact Me
      </h1>
      <p className="max-w-3xl mt-3 mb-10 text-base text-zinc-400 font-mono items-center gap-2">
        I’m always open to discussing new projects, creative ideas, or
        opportunities to be part of your vision.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            className="block text-lg text-zinc-100 font-mono font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="w-full rounded-lg py-3 px-4 text-slate-900 text-sm outline-none border-4 focus:border-purple-300"
            type="text"
            id="name"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            className="block text-lg text-zinc-100 font-mono font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full rounded-lg py-3 px-4 text-slate-900 text-sm outline-none border-4 focus:border-purple-300"
            type="email"
            id="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            className="block text-lg text-zinc-100 font-mono font-bold mb-2"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            className="w-full rounded-lg py-3 px-4 text-slate-900 text-sm outline-none border-4 focus:border-purple-300"
            id="message"
            name="message"
            placeholder="Enter Message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <Recaptcha onChange={handleCaptchaChange} />

        <button
          type="submit"
          className="text-lg text-zinc-100 font-mono bg-black tracking-wide rounded-lg px-4 py-3 flex items-center justify-center w-full !mt-6 transition-all duration-200 hover:bg-purple-200 hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16px"
            height="16px"
            fill="currentColor"
            className="mr-2"
            viewBox="0 0 548.244 548.244"
          >
            <path
              fill-rule="evenodd"
              d="M392.19 156.054 211.268 281.667 22.032 218.58C8.823 214.168-.076 201.775 0 187.852c.077-13.923 9.078-26.24 22.338-30.498L506.15 1.549c11.5-3.697 24.123-.663 32.666 7.88 8.542 8.543 11.577 21.165 7.879 32.666L390.89 525.906c-4.258 13.26-16.575 22.261-30.498 22.338-13.923.076-26.316-8.823-30.728-22.032l-63.393-190.153z"
              clip-rule="evenodd"
              data-original="#000000"
            />
          </svg>
          Send Message
        </button>
      </form>
    </div>
  );
}
