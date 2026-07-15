"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type NavLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * Header nav item: mono microtype with an active state derived from the
 * locale-stripped pathname. Client leaf so the header itself stays a server
 * component.
 */
export function NavLink({ href, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex min-h-8 items-center rounded-xs px-2 font-mono text-xs tracking-wider uppercase",
        "transition-colors duration-(--duration-fast) ease-out-soft pointer-coarse:min-h-11",
        isActive ? "text-text" : "text-text-muted hover:text-text",
        className,
      )}
      {...props}
    />
  );
}
