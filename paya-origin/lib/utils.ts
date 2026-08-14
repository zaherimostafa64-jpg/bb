import { clsx, type ClassValue } from "clsx";

/**
 * Merge conditional class names. A thin wrapper around clsx so call
 * sites read declaratively, e.g. cn("base", isActive && "active").
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
