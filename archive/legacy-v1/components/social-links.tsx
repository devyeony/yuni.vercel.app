import Link from "next/link";
import { useContactInfo } from "@/hooks/useContactInfo";

interface SocialLinkProps {
  className?: string;
}

export const SocialLink: React.FC<SocialLinkProps> = ({ className = "" }) => {
  const contactInfo = useContactInfo();

  const LinkedinIcon = contactInfo.linkedin.icon;
  const GithubIcon = contactInfo.github.icon;
  const BlogIcon = contactInfo.blog.icon;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Link href={contactInfo.linkedin.url} target="_blank" rel="noopener noreferrer">
        <LinkedinIcon size={40} />
      </Link>
      <Link href={contactInfo.github.url} target="_blank" rel="noopener noreferrer">
        <GithubIcon size={40} />
      </Link>
      <Link href={contactInfo.blog.url} target="_blank" rel="noopener noreferrer">
        <BlogIcon size={40} />
      </Link>
    </div>
  );
};
