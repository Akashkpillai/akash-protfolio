// Homepage sections (feature 006). The brand links home; the server appends a Resume item
// only when the approved PDF exists.
export type NavigationItem = {
  label: string;
  href: string;
  download?: boolean;
};

export const navigationItems: readonly NavigationItem[] = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];
