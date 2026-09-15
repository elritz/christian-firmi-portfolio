// Tab layout of the My Work page, shared with pages that link into it.

export type Section = { type: string; title?: string };
export type Tab = { id: string; label: string; short?: string; sections: Section[] };

export const TABS: Tab[] = [
  {
    id: 'professional',
    label: 'Professional',
    sections: [{ type: 'professional' }],
  },
  {
    id: 'products',
    label: 'My Products',
    sections: [{ type: 'projects' }],
  },
  {
    id: 'philosophy',
    label: 'Philosophy',
    sections: [
      { type: 'blog', title: 'Philosophy' },
      { type: 'hobbies & interests', title: 'Hobbies and interests' },
      { type: 'travel', title: 'Travel' },
    ],
  },
];
export const DEFAULT_TAB = 'products';

/** Tab that lists posts of a given type; unknown types fall into the default tab. */
export function tabForType(type?: string) {
  return TABS.find((t) => t.sections.some((s) => s.type === type))?.id ?? DEFAULT_TAB;
}

/** URL hash for the work page: "tab" or "tab/tag", e.g. "#products/react-native". */
export function workHash(type: string | undefined, tag?: string) {
  const tab = tabForType(type);
  return `#${tag ? `${tab}/${tag}` : tab}`;
}
