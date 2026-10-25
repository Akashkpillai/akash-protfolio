export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Approach", href: "/#approach" },
  { label: "Contact", href: "/#contact" },
] as const;

export type NavigationItem = (typeof navigationItems)[number];
