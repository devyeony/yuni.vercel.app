import Link from "next/link";
import { Github, LinkedinIcon, PenLine } from "lucide-react";
import { socialInfo } from "@/constants/social-info";

interface SocialLinkProps {
  className?: string;
}

export const SocialLink: React.FC<SocialLinkProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Link
        href={socialInfo.linkedin.link}
        target="_blank"
      >
        <LinkedinIcon size={40} />
      </Link>
      <Link href={socialInfo.github.link} target="_blank">
        <Github size={40} />
      </Link>
      <Link href={socialInfo.medium.link} target="_blank">
        <PenLine size={40} />
      </Link>
    </div>
  );
};
