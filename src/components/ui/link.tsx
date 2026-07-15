import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { Link as LocalizedLink } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const linkVariants = cva(
  "rounded-xs underline-offset-4 transition-colors duration-(--duration-fast) ease-out-soft",
  {
    variants: {
      variant: {
        default:
          "text-text underline decoration-border hover:text-accent hover:decoration-accent",
        accent:
          "text-accent underline decoration-accent/40 hover:decoration-accent",
        muted: "text-text-muted no-underline hover:text-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface LinkProps
  extends Omit<ComponentProps<"a">, "href">,
    VariantProps<typeof linkVariants> {
  href: string;
}

/**
 * Internal hrefs go through the locale-aware next-intl Link; external ones
 * render a plain anchor with rel="noopener noreferrer" in a new tab.
 */
export function Link({ className, variant, href, ...props }: LinkProps) {
  const classes = cn(linkVariants({ variant }), className);
  if (/^(?:[a-z+]+:)?\/\//i.test(href) || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      />
    );
  }
  return <LocalizedLink href={href} className={classes} {...props} />;
}
