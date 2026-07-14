import { SECTION_IDS } from "@/lib/constants";
import type { NavigationItem } from "@/types/content";

/**
 * Primary site navigation — every homepage section in page order.
 */
export const secondaryNavigationItems: NavigationItem[] = [
  {
    id: "nav-home",
    labelKey: "home",
    href: `#${SECTION_IDS.home}`,
    sectionId: SECTION_IDS.home,
  },
  {
    id: "nav-featured",
    labelKey: "featured",
    href: `#${SECTION_IDS.featured}`,
    sectionId: SECTION_IDS.featured,
  },
  {
    id: "nav-biography",
    labelKey: "biography",
    href: `#${SECTION_IDS.biography}`,
    sectionId: SECTION_IDS.biography,
  },
  {
    id: "nav-timeline",
    labelKey: "timeline",
    href: `#${SECTION_IDS.timeline}`,
    sectionId: SECTION_IDS.timeline,
  },
  {
    id: "nav-legacy",
    labelKey: "legacy",
    href: `#${SECTION_IDS.legacy}`,
    sectionId: SECTION_IDS.legacy,
  },
  {
    id: "nav-gallery",
    labelKey: "gallery",
    href: `#${SECTION_IDS.gallery}`,
    sectionId: SECTION_IDS.gallery,
  },
  {
    id: "nav-newspapers",
    labelKey: "newspapers",
    href: `#${SECTION_IDS.newspapers}`,
    sectionId: SECTION_IDS.newspapers,
  },
  {
    id: "nav-certifications",
    labelKey: "certifications",
    href: `#${SECTION_IDS.certifications}`,
    sectionId: SECTION_IDS.certifications,
  },
  {
    id: "nav-royal",
    labelKey: "royalConnections",
    href: `#${SECTION_IDS.royalConnections}`,
    sectionId: SECTION_IDS.royalConnections,
  },
  {
    id: "nav-contact",
    labelKey: "contact",
    href: `#${SECTION_IDS.contact}`,
    sectionId: SECTION_IDS.contact,
  },
];

/** Same ordered section list for footer / dense menus. */
export const navigationItems: NavigationItem[] = secondaryNavigationItems;
