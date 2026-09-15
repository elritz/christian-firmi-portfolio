// Tag taxonomy for work posts. Two top-level groups; a post carries the slugs
// of the sub-tags that apply (frontmatter `tags: a, b, c`) and its group
// membership follows from them. A post may also carry a group id itself
// (e.g. `personal`) to belong to that group without a more specific sub-tag.

export type TagGroupId = 'technical' | 'business' | 'personal';

export type TagGroup = {
  id: TagGroupId;
  label: string;
  /** Sub-tag slug -> display label, in display order. */
  tags: Record<string, string>;
};

export const TAG_GROUPS: TagGroup[] = [
  {
    id: 'technical',
    label: 'Technical',
    tags: {
      'react-native': 'React Native',
      react: 'React',
      nextjs: 'Next.js',
      graphql: 'GraphQL',
      backend: 'Backend',
      microservices: 'Microservices',
      auth: 'Authentication',
      realtime: 'Real-time & Push',
      geospatial: 'Geospatial',
      'native-mobile': 'Native iOS & Android',
      performance: 'Performance',
      devops: 'CI & DevOps',
    },
  },
  {
    id: 'business',
    label: 'Business',
    tags: {
      'registered-business': 'Registered Business',
      'business-planning': 'Business Planning',
      monetization: 'Monetization',
      'product-design': 'Product Design',
      brand: 'Brand & Marketing',
      research: 'Research',
      documentation: 'Documentation',
      employment: 'Employment',
      leadership: 'Leadership & Mentoring',
      community: 'Community & Volunteering',
      'app-store': 'App Store Release',
    },
  },
  {
    id: 'personal',
    label: 'Personal',
    tags: {
      woodworking: 'Woodworking',
      squash: 'Squash',
      travel: 'Travel',
      design: 'Design',
    },
  },
];

const GROUP_OF: Record<string, TagGroupId> = {};
const LABEL_OF: Record<string, string> = {};
for (const group of TAG_GROUPS) {
  GROUP_OF[group.id] = group.id;
  LABEL_OF[group.id] = group.label;
  for (const [slug, label] of Object.entries(group.tags)) {
    GROUP_OF[slug] = group.id;
    LABEL_OF[slug] = label;
  }
}

export function tagLabel(slug: string) {
  return LABEL_OF[slug] ?? slug;
}

export function tagGroup(slug: string): TagGroupId | undefined {
  return GROUP_OF[slug];
}

export function isTagGroupId(id: string): id is TagGroupId {
  return TAG_GROUPS.some((g) => g.id === id);
}

/** True when a post's tags satisfy a filter, which is a group id or a sub-tag slug. */
export function hasTag(tags: string[] | undefined, filter: string) {
  const list = tags ?? [];
  return isTagGroupId(filter)
    ? list.some((t) => GROUP_OF[t] === filter)
    : list.includes(filter);
}
