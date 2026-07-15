import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names; conflicting Tailwind utilities resolve last-wins. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
