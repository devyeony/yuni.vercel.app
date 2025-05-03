import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";

interface RecaptchaProps {
  onChange: (value: string | null) => void;
}



const Recaptcha: React.FC<RecaptchaProps> = ({ onChange }) => {
  const handleCaptchaChange = (value: string | null) => {
    onChange(value);
  };

  return (
    <div className="my-4">
      <ReCAPTCHA
        sitekey= {process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY!} 
        onChange={handleCaptchaChange}
      />
    </div>
  );
};

export default Recaptcha;