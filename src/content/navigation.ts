export const navigationItems = [
  { label: "Home", href: "#home" },
  { label: "Approach", href: "#approach" },
] as const;

export type NavigationItem = (typeof navigationItems)[number];
