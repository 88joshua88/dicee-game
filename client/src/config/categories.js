/**
 * categories.js — single source of truth for the EnergeX category tree.
 *
 * To add a new energy type:
 *  1. Add a subcategory entry with implemented: true and a route
 *  2. Build the corresponding creation page at that route
 *  3. No other changes needed — CategoryModal reads this config automatically
 */

export const CATEGORIES = [
  {
    id: 'content',
    label: 'Content',
    icon: '📝',
    description: 'Written articles, courses, ebooks, images, and video',
    subcategories: [
      {
        id: 'article',
        label: 'Article',
        icon: '📄',
        description: 'Long-form written content with version control',
        route: '/create/article',
        implemented: true,
      },
      {
        id: 'online-course',
        label: 'Online Course',
        icon: '🎓',
        description: 'Structured multi-module learning content',
        implemented: false,
      },
      {
        id: 'ebook',
        label: 'Ebook',
        icon: '📚',
        description: 'Downloadable book or guide',
        implemented: false,
      },
      {
        id: 'image',
        label: 'Image',
        icon: '🖼️',
        description: 'Photography, illustration, or digital art',
        implemented: false,
      },
      {
        id: 'video',
        label: 'Video',
        icon: '🎬',
        description: 'Recorded video content',
        implemented: false,
      },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    icon: '⚡',
    description: 'Freelance skills, tasks, and deliverables',
    comingSoon: true,
    subcategories: [],
  },
  {
    id: 'consultation',
    label: 'Consultation',
    icon: '💬',
    description: '1:1 calls, coaching sessions, and expert advice',
    comingSoon: true,
    subcategories: [],
  },
  {
    id: 'event',
    label: 'Event',
    icon: '🗓️',
    description: 'Live, virtual, or in-person events and experiences',
    comingSoon: true,
    subcategories: [],
  },
];

/** Flat list of all implemented subcategories with their parent category id */
export const getImplementedSubcategories = () =>
  CATEGORIES.flatMap((cat) =>
    cat.subcategories
      .filter((sub) => sub.implemented)
      .map((sub) => ({ ...sub, categoryId: cat.id, categoryLabel: cat.label }))
  );

/** Article-level topic categories */
export const ARTICLE_CATEGORIES = [
  'Education',
  'Technology',
  'Health',
  'Business',
  'Philosophy',
  'Lifestyle',
  'Finance',
  'Travel',
];

/** Supported currencies */
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NGN', 'ZAR'];
