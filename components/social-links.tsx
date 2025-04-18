import Link from "next/link";
import { Github, LinkedinIcon, PenLine } from "lucide-react";

interface SocialLinkProps {
  className?: string;
}

export const SocialLink: React.FC<SocialLinkProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Link
        href="https://www.linkedin.com/in/yeonhee-hayden-kim/"
        target="_blank"
      >
        <LinkedinIcon size={40} />
      </Link>
      <Link href="https://github.com/devyeony" target="_blank">
        <Github size={40} />
      </Link>
      <Link href="https://medium.com/@devyeony" target="_blank">
        <PenLine size={40} />
      </Link>
    </div>
  );
};
