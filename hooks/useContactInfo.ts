import { useLocale, useTranslations } from "next-intl";
import { Github, LinkedinIcon, PenLine } from "lucide-react";
import { getLinkedinLink, getGithubLink, getBlogLink } from "@/utils/links";

export function useContactInfo() {
  const locale = useLocale();
  const t = useTranslations("About.contact");

  return {
    linkedin: {
      name: t("linkedin"),
      url: getLinkedinLink(),
      icon: LinkedinIcon,
    },
    github: {
      name: t("github"),
      url: getGithubLink(),
      icon: Github,
    },
    blog: {
      name: t("blog"),
      url: getBlogLink(locale),
      icon: PenLine,
    },
  };
}