export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "Approach", href: "/#approach" },
] as const;

export type NavigationItem = (typeof navigationItems)[number];
