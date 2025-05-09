import React from "react";
import { useTranslations } from "next-intl";

type BaseProps = {
  label: string;
  id: string;
  name: string;
  as?: "input" | "textarea";
};

type InputFieldProps =
  | (BaseProps & React.InputHTMLAttributes<HTMLInputElement> & { as?: "input" })
  | (BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" });

const InputField: React.FC<InputFieldProps> = ({label, id, name, as = "input", ...props}) => {
  const t = useTranslations("Messages.form");

  const sharedClasses =
    "w-full rounded-lg py-3 px-4 text-slate-900 text-sm outline-none border-4 focus:border-purple-300";

  const handleInvalid = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    target.setCustomValidity(t("fillOutThisField"));
  };
  
  const handleInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    target.setCustomValidity('');
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-lg text-zinc-100 font-mono font-bold mb-2"
      >
        {label}
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          className={sharedClasses}
          onInvalid={handleInvalid}
          onInput={handleInput}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          name={name}
          className={sharedClasses}
          onInvalid={handleInvalid}
          onInput={handleInput}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </div>
  );
};

export default InputField;
