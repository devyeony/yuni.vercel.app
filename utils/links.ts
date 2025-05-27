import { contactInfo } from "@/constants/contact-info";

export function getLinkedinLink(): string {
  return contactInfo.linkedin.link;
}

export function getGithubLink(): string {
  return contactInfo.github.link;
}

export function getBlogLink(locale: string): string {
  return locale === "en" ? contactInfo.medium.link : contactInfo.tistory.link;
}