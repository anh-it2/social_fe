import dayjs from "dayjs";
import type { ReactionId } from "@/shared/data/reactions";

export {
  REACTIONS,
  REACTION_BY_ID,
  type Reaction,
  type ReactionId,
  type Comment,
} from "@/shared/data/reactions";
export { formatCount } from "@/shared/utils/format";
export { gradientBg, gradientText } from "@/shared/utils/gradient";

export interface ProfileUser {
  name: string;
  bio: string;
  location: string;
}

export interface Highlight {
  id: string;
  label: string;
  icon: string;
  gradient: [string, string] | [string, string, string];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  gradient: [string, string];
}

export interface AboutItem {
  id: string;
  icon: string;
  text: string;
  gradient?: [string, string];
  muted?: boolean;
}

export interface Friend {
  id: string;
  name: string;
  mutualFriends?: number;
  location?: string;
  mockOnline?: boolean;
}

export interface FriendRequest {
  id: string;
  name: string;
  mutualFriends: number;
  time: string;
}

export interface FriendSuggestion {
  id: string;
  name: string;
  mutualFriends: number;
  reason?: string;
}

export interface BirthdayEntry {
  id: string;
  name: string;
  when: "today" | "tomorrow" | "this_week";
  date?: string;
}

export interface PhotoTile {
  id: string;
  url: string;
}

export interface PostAuthor {
  name: string;
  gradient?: [string, string];
}

export interface Post {
  id: string;
  ownerId?: string;
  author: PostAuthor;
  coAuthor?: PostAuthor;
  time: string;
  text: string;
  image?: string;
  emojis: string;
  likes: number;
  comments: number;
  shares: number;
  initialReaction?: ReactionId;
}

export const PROFILE: ProfileUser = {
  name: "Sarah Anderson",
  bio: "Product Designer at Meta",
  location: "San Francisco, CA",
};

export const HIGHLIGHTS: Highlight[] = [
  { id: "h1", label: "Travel", icon: "flight", gradient: ["#4096ff", "#a855f7", "#ec4899"] },
  { id: "h2", label: "Design", icon: "palette", gradient: ["#f59e0b", "#ef4444"] },
  { id: "h3", label: "Food", icon: "restaurant", gradient: ["#22c55e", "#06b6d4"] },
  { id: "h4", label: "Fitness", icon: "fitness_center", gradient: ["#8b5cf6", "#ec4899"] },
  { id: "h5", label: "Music", icon: "music_note", gradient: ["#f97316", "#eab308"] },
  { id: "h6", label: "Photos", icon: "photo_camera", gradient: ["#06b6d4", "#3b82f6"] },
];

export const STATS: StatItem[] = [
  { id: "s1", value: "1,247", label: "Posts", gradient: ["#4096ff", "#a855f7"] },
  { id: "s2", value: "4,832", label: "Friends", gradient: ["#a855f7", "#ec4899"] },
  { id: "s3", value: "892", label: "Photos", gradient: ["#22c55e", "#06b6d4"] },
  { id: "s4", value: "12.5K", label: "Likes", gradient: ["#f59e0b", "#ef4444"] },
];

export const TABS = ["Posts", "About", "Friends", "Photos", "Videos"] as const;
export type TabId = (typeof TABS)[number];

export type AboutCategoryId =
  | "overview"
  | "work_education"
  | "places"
  | "contact_basic"
  | "family"
  | "details"
  | "life_events";

export interface AboutRowData {
  id: string;
  icon: string;
  primary: string;
  secondary?: string;
  gradient?: [string, string];
  values?: Record<string, string | boolean>;
}

export type FieldKind = "text" | "textarea" | "select" | "checkbox" | "date";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldDef {
  name: string;
  label: string;
  placeholder?: string;
  kind: FieldKind;
  options?: FieldOption[];
  required?: boolean;
  span?: 1 | 2;
  hideWhen?: { name: string; equals: string | boolean };
  pickerKind?: "date" | "month" | "year";
  minYear?: number;
  maxYear?: number;
}

export type FormValues = Record<string, string | boolean>;

export interface AboutSectionSchema {
  id: string;
  title?: string;
  addLabel: string;
  defaultIcon: string;
  defaultGradient?: [string, string];
  fields: FieldDef[];
  format: (values: FormValues) => { primary: string; secondary?: string };
}

const CURRENT_YEAR = new Date().getFullYear();

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const bool = (v: unknown) => v === true;
const fmtDate = (iso: string, pattern: string) => {
  if (!iso) return "";
  const d = dayjs(iso);
  return d.isValid() ? d.format(pattern) : "";
};
const joinPeriod = (
  startIso: string,
  endIso: string,
  pattern: string,
  current: boolean
) => {
  const start = fmtDate(startIso, pattern);
  const end = current ? "present" : fmtDate(endIso, pattern);
  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;
  return `${start} – ${end}`;
};

export interface AboutCategoryDef {
  id: AboutCategoryId;
  label: string;
  icon: string;
  sections: AboutSectionSchema[];
}

const RELATIONSHIP_STATUSES: FieldOption[] = [
  "Single",
  "In a relationship",
  "Engaged",
  "Married",
  "In a civil partnership",
  "In a domestic partnership",
  "In an open relationship",
  "It's complicated",
  "Separated",
  "Divorced",
  "Widowed",
].map((v) => ({ label: v, value: v }));

const FAMILY_RELATIONS: FieldOption[] = [
  "Mother",
  "Father",
  "Sister",
  "Brother",
  "Daughter",
  "Son",
  "Aunt",
  "Uncle",
  "Niece",
  "Nephew",
  "Cousin (female)",
  "Cousin (male)",
  "Grandmother",
  "Grandfather",
  "Granddaughter",
  "Grandson",
  "Stepsister",
  "Stepbrother",
  "Stepmother",
  "Stepfather",
  "Stepdaughter",
  "Stepson",
  "Mother-in-law",
  "Father-in-law",
  "Sister-in-law",
  "Brother-in-law",
  "Daughter-in-law",
  "Son-in-law",
  "Family member",
].map((v) => ({ label: v, value: v }));

const PLACE_TYPES: FieldOption[] = [
  "Current city",
  "Hometown",
  "Past city",
].map((v) => ({ label: v, value: v }));

const CONTACT_TYPES: FieldOption[] = [
  "Mobile",
  "Home phone",
  "Work phone",
  "Email",
  "Website",
  "Instagram",
  "X (Twitter)",
  "LinkedIn",
  "Other",
].map((v) => ({ label: v, value: v }));

const BASIC_TYPES: FieldOption[] = [
  "Gender",
  "Birthday",
  "Languages",
  "Religious views",
  "Political views",
  "Nationality",
].map((v) => ({ label: v, value: v }));

const NAME_TYPES: FieldOption[] = [
  "Nickname",
  "Birth name",
  "Maiden name",
  "Father's name",
  "Married name",
  "Other name",
].map((v) => ({ label: v, value: v }));

const ATTENDED_FOR: FieldOption[] = [
  { label: "College", value: "College" },
  { label: "Graduate school", value: "Graduate school" },
];

const LIFE_EVENT_CATEGORIES: FieldOption[] = [
  "Work",
  "Education",
  "Family and relationships",
  "Home and living",
  "Health and wellness",
  "Travel and experiences",
  "Milestones and achievements",
  "Other",
].map((v) => ({ label: v, value: v }));

export const ABOUT_CATEGORIES: AboutCategoryDef[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "dashboard",
    sections: [],
  },
  {
    id: "work_education",
    label: "Work and education",
    icon: "work",
    sections: [
      {
        id: "work",
        title: "Work",
        addLabel: "Add a workplace",
        defaultIcon: "work",
        defaultGradient: ["#4096ff", "#a855f7"],
        fields: [
          { name: "company", label: "Company", placeholder: "e.g. Meta", kind: "text", required: true },
          { name: "position", label: "Position", placeholder: "e.g. Product Designer", kind: "text" },
          { name: "city", label: "City/town", placeholder: "e.g. Menlo Park, CA", kind: "text" },
          { name: "description", label: "Description", placeholder: "What did you do?", kind: "textarea" },
          { name: "currentlyHere", label: "I currently work here", kind: "checkbox", span: 2 },
          { name: "startDate", label: "Start date", placeholder: "Pick start month", kind: "date", pickerKind: "month", span: 1, required: true, maxYear: CURRENT_YEAR },
          { name: "endDate", label: "End date", placeholder: "Pick end month", kind: "date", pickerKind: "month", span: 1, maxYear: CURRENT_YEAR, hideWhen: { name: "currentlyHere", equals: true } },
        ],
        format: (v) => {
          const position = str(v.position);
          const company = str(v.company);
          const city = str(v.city);
          const period = joinPeriod(str(v.startDate), str(v.endDate), "MMM YYYY", bool(v.currentlyHere));
          const primary = position ? `${position} at ${company}` : company;
          const secondary = [period, city].filter(Boolean).join(" · ") || undefined;
          return { primary, secondary };
        },
      },
      {
        id: "college",
        title: "College",
        addLabel: "Add a college",
        defaultIcon: "school",
        defaultGradient: ["#a855f7", "#ec4899"],
        fields: [
          { name: "school", label: "School", placeholder: "e.g. Stanford University", kind: "text", required: true },
          { name: "degree", label: "Concentrations / degree", placeholder: "e.g. MFA, Design", kind: "text" },
          { name: "attendedFor", label: "Attended for", kind: "select", options: ATTENDED_FOR },
          { name: "description", label: "Description", placeholder: "Notes about your time here…", kind: "textarea" },
          { name: "graduated", label: "Graduated", kind: "checkbox", span: 2 },
          { name: "startDate", label: "Start year", placeholder: "Pick start year", kind: "date", pickerKind: "year", span: 1 },
          { name: "endDate", label: "End year", placeholder: "Pick end year", kind: "date", pickerKind: "year", span: 1 },
        ],
        format: (v) => {
          const school = str(v.school);
          const degree = str(v.degree);
          const sy = fmtDate(str(v.startDate), "YYYY");
          const ey = fmtDate(str(v.endDate), "YYYY");
          const graduated = bool(v.graduated);
          const period = graduated && ey ? `Graduated ${ey}` : sy && ey ? `${sy} – ${ey}` : sy || ey;
          const secondary = [degree, period].filter(Boolean).join(" · ") || undefined;
          return { primary: school, secondary };
        },
      },
      {
        id: "highschool",
        title: "High school",
        addLabel: "Add a high school",
        defaultIcon: "school",
        defaultGradient: ["#f59e0b", "#ef4444"],
        fields: [
          { name: "school", label: "School", placeholder: "e.g. Lincoln High School", kind: "text", required: true },
          { name: "description", label: "Description", placeholder: "Notes about your time here…", kind: "textarea" },
          { name: "graduated", label: "Graduated", kind: "checkbox", span: 2 },
          { name: "startDate", label: "Start year", placeholder: "Pick start year", kind: "date", pickerKind: "year", span: 1 },
          { name: "endDate", label: "End year", placeholder: "Pick end year", kind: "date", pickerKind: "year", span: 1 },
        ],
        format: (v) => {
          const school = str(v.school);
          const sy = fmtDate(str(v.startDate), "YYYY");
          const ey = fmtDate(str(v.endDate), "YYYY");
          const graduated = bool(v.graduated);
          const secondary = graduated && ey ? `Class of ${ey}` : sy && ey ? `${sy} – ${ey}` : sy || ey || undefined;
          return { primary: school, secondary };
        },
      },
    ],
  },
  {
    id: "places",
    label: "Places lived",
    icon: "location_on",
    sections: [
      {
        id: "places",
        title: "Places lived",
        addLabel: "Add a city",
        defaultIcon: "place",
        defaultGradient: ["#22c55e", "#06b6d4"],
        fields: [
          { name: "city", label: "City", placeholder: "e.g. San Francisco, California", kind: "text", required: true },
          { name: "type", label: "Type", kind: "select", options: PLACE_TYPES, required: true },
          { name: "fromDate", label: "From", placeholder: "Pick month/year", kind: "date", pickerKind: "month", span: 1, hideWhen: { name: "type", equals: "Current city" } },
          { name: "toDate", label: "To", placeholder: "Pick month/year", kind: "date", pickerKind: "month", span: 1, hideWhen: { name: "type", equals: "Current city" } },
        ],
        format: (v) => {
          const city = str(v.city);
          const type = str(v.type);
          if (type === "Past city") {
            const period = joinPeriod(str(v.fromDate), str(v.toDate), "MMM YYYY", false);
            return { primary: city, secondary: period ? `Past · ${period}` : "Past city" };
          }
          return { primary: city, secondary: type || undefined };
        },
      },
    ],
  },
  {
    id: "contact_basic",
    label: "Contact and basic info",
    icon: "contact_page",
    sections: [
      {
        id: "contact",
        title: "Contact info",
        addLabel: "Add contact info",
        defaultIcon: "smartphone",
        defaultGradient: ["#4096ff", "#a855f7"],
        fields: [
          { name: "type", label: "Type", kind: "select", options: CONTACT_TYPES, required: true },
          { name: "value", label: "Value", placeholder: "e.g. +1 (415) 555-0192", kind: "text", required: true },
        ],
        format: (v) => ({ primary: str(v.value), secondary: str(v.type) || undefined }),
      },
      {
        id: "basic",
        title: "Basic info",
        addLabel: "Add basic info",
        defaultIcon: "info",
        fields: [
          { name: "type", label: "Type", kind: "select", options: BASIC_TYPES, required: true },
          { name: "value", label: "Value", placeholder: "e.g. Female / April 12 / English, Spanish", kind: "text", required: true },
        ],
        format: (v) => ({ primary: str(v.value), secondary: str(v.type) || undefined }),
      },
    ],
  },
  {
    id: "family",
    label: "Family and relationships",
    icon: "people",
    sections: [
      {
        id: "rel",
        title: "Relationship",
        addLabel: "Add a relationship status",
        defaultIcon: "favorite",
        defaultGradient: ["#ef4444", "#ec4899"],
        fields: [
          { name: "status", label: "Status", kind: "select", options: RELATIONSHIP_STATUSES, required: true },
          { name: "partner", label: "Partner (optional)", placeholder: "Partner's name", kind: "text" },
          { name: "sinceDate", label: "Since", placeholder: "Pick month/year", kind: "date", pickerKind: "month", span: 2 },
        ],
        format: (v) => {
          const status = str(v.status);
          const partner = str(v.partner);
          const since = fmtDate(str(v.sinceDate), "MMMM YYYY");
          const primary = partner ? `${status} with ${partner}` : status;
          const secondary = since ? `Since ${since}` : undefined;
          return { primary, secondary };
        },
      },
      {
        id: "family",
        title: "Family members",
        addLabel: "Add a family member",
        defaultIcon: "person",
        defaultGradient: ["#a855f7", "#ec4899"],
        fields: [
          { name: "name", label: "Name", placeholder: "e.g. Emma Anderson", kind: "text", required: true },
          { name: "relation", label: "Relation", kind: "select", options: FAMILY_RELATIONS, required: true },
        ],
        format: (v) => ({ primary: str(v.name), secondary: str(v.relation) || undefined }),
      },
    ],
  },
  {
    id: "details",
    label: "Details about you",
    icon: "info",
    sections: [
      {
        id: "about",
        title: "About you",
        addLabel: "Write something about yourself",
        defaultIcon: "edit_note",
        defaultGradient: ["#4096ff", "#a855f7"],
        fields: [
          { name: "bio", label: "Bio", placeholder: "Share something about yourself…", kind: "textarea", required: true },
        ],
        format: (v) => ({ primary: str(v.bio) }),
      },
      {
        id: "other_names",
        title: "Other names",
        addLabel: "Add a nickname or a birth name",
        defaultIcon: "label",
        fields: [
          { name: "name", label: "Name", placeholder: "e.g. Sare", kind: "text", required: true },
          { name: "type", label: "Type", kind: "select", options: NAME_TYPES, required: true },
          { name: "showAtTop", label: "Show at the top of your profile", kind: "checkbox", span: 2 },
        ],
        format: (v) => ({ primary: str(v.name), secondary: str(v.type) || undefined }),
      },
      {
        id: "quotes",
        title: "Favorite quotes",
        addLabel: "Add favorite quotes",
        defaultIcon: "format_quote",
        defaultGradient: ["#f59e0b", "#ef4444"],
        fields: [
          { name: "quote", label: "Quote", placeholder: "Type a quote…", kind: "textarea", required: true },
          { name: "author", label: "Author (optional)", placeholder: "e.g. Alina Wheeler", kind: "text" },
        ],
        format: (v) => {
          const author = str(v.author);
          return {
            primary: `“${str(v.quote)}”`,
            secondary: author ? `— ${author}` : undefined,
          };
        },
      },
    ],
  },
  {
    id: "life_events",
    label: "Life events",
    icon: "cake",
    sections: [
      {
        id: "events",
        title: "Life events",
        addLabel: "Add a life event",
        defaultIcon: "cake",
        defaultGradient: ["#22c55e", "#06b6d4"],
        fields: [
          { name: "title", label: "Title", placeholder: "e.g. Started new job at Meta", kind: "text", required: true },
          { name: "category", label: "Category", kind: "select", options: LIFE_EVENT_CATEGORIES },
          { name: "location", label: "Location", placeholder: "e.g. Menlo Park, CA", kind: "text" },
          { name: "story", label: "Story", placeholder: "Tell the story…", kind: "textarea" },
          { name: "date", label: "Date", placeholder: "Pick a date", kind: "date", pickerKind: "date", span: 2, required: true },
        ],
        format: (v) => {
          const date = fmtDate(str(v.date), "MMMM D, YYYY");
          const location = str(v.location);
          const secondary = [date, location].filter(Boolean).join(" · ") || undefined;
          return { primary: str(v.title), secondary };
        },
      },
    ],
  },
];

export const ABOUT_ITEMS: AboutItem[] = [
  { id: "a1", icon: "work", text: "Product Designer at Meta", gradient: ["#4096ff", "#a855f7"] },
  { id: "a2", icon: "school", text: "Stanford University", gradient: ["#a855f7", "#ec4899"] },
  { id: "a3", icon: "location_on", text: "San Francisco, California", gradient: ["#f59e0b", "#f97316"] },
  { id: "a4", icon: "favorite", text: "Single", gradient: ["#ef4444", "#ec4899"] },
  { id: "a5", icon: "calendar_month", text: "Joined March 2019", muted: true },
];

export const FRIENDS: Friend[] = [
  { id: "f1", name: "Alex Chen", mutualFriends: 24, location: "San Francisco, CA", mockOnline: true },
  { id: "f2", name: "Mia Lopez", mutualFriends: 18, location: "New York, NY", mockOnline: true },
  { id: "f3", name: "James Wu", mutualFriends: 31, location: "Seattle, WA" },
  { id: "f4", name: "Emma Park", mutualFriends: 12, location: "Los Angeles, CA" },
  { id: "f5", name: "David Kim", mutualFriends: 9, location: "Austin, TX" },
  { id: "f6", name: "Lily Zhang", mutualFriends: 27, location: "Boston, MA" },
  { id: "f7", name: "Mai Linh", mutualFriends: 14, location: "Hà Nội, VN", mockOnline: true },
  { id: "f8", name: "Tuấn Anh", mutualFriends: 22, location: "Hồ Chí Minh, VN", mockOnline: true },
  { id: "f9", name: "Hà My", mutualFriends: 7, location: "Đà Nẵng, VN", mockOnline: true },
  { id: "f10", name: "Lan Phương", mutualFriends: 19, location: "Hà Nội, VN", mockOnline: true },
  { id: "f11", name: "Phương Thảo", mutualFriends: 11, location: "Hồ Chí Minh, VN", mockOnline: true },
  { id: "f12", name: "Sophia Rivera", mutualFriends: 5, location: "Miami, FL" },
];

export const FRIEND_REQUESTS: FriendRequest[] = [
  { id: "r1", name: "Noah Patel", mutualFriends: 8, time: "2d" },
  { id: "r2", name: "Olivia Brooks", mutualFriends: 3, time: "5d" },
  { id: "r3", name: "Hiroshi Tanaka", mutualFriends: 12, time: "1w" },
];

export const FRIEND_SUGGESTIONS: FriendSuggestion[] = [
  { id: "s1", name: "Ava Müller", mutualFriends: 6, reason: "Works at Meta" },
  { id: "s2", name: "Lucas Silva", mutualFriends: 4, reason: "From San Francisco" },
  { id: "s3", name: "Isabella Rossi", mutualFriends: 9, reason: "Stanford University" },
  { id: "s4", name: "Minh Khoa", mutualFriends: 2, reason: "Friend of Mai Linh" },
];

export const BIRTHDAYS: BirthdayEntry[] = [
  { id: "b1", name: "Emma Park", when: "today" },
  { id: "b2", name: "James Wu", when: "tomorrow", date: "May 13" },
  { id: "b3", name: "Sophia Rivera", when: "this_week", date: "May 15" },
];

export const PHOTOS: PhotoTile[] = [
  {
    id: "p1",
    url: "https://images.unsplash.com/photo-1574854985846-97f10ecc922c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "p2",
    url: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "p3",
    url: "https://images.unsplash.com/photo-1730034374649-924a9507089e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "p4",
    url: "https://images.unsplash.com/photo-1493238792000-8113da705763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

export const POSTS: Post[] = [
  {
    id: "post-1",
    ownerId: "u-sarah",
    author: { name: "Sarah Anderson", gradient: ["#4096ff", "#a855f7"] },
    time: "2 hours ago  ·  🌍",
    text: "Just wrapped up an amazing design sprint with the team! 🎨✨ Nothing beats the energy of collaborative creativity. Here's a sneak peek at what we've been working on.",
    image: "/profile/post-1.png",
    emojis: "❤️ 👍 😮",
    likes: 248,
    comments: 42,
    shares: 12,
  },
  {
    id: "post-2",
    ownerId: "u-alexchen",
    author: { name: "Alex Chen" },
    coAuthor: { name: "Sarah Anderson" },
    time: "5 hours ago  ·  🌍",
    text: "Happy birthday Sarah! 🎂🎉 Wishing you an incredible year ahead. Your designs continue to inspire everyone on the team. Here's to many more creative adventures together!",
    emojis: "🎂 ❤️ 👍",
    likes: 186,
    comments: 31,
    shares: 5,
    initialReaction: "like",
  },
];
