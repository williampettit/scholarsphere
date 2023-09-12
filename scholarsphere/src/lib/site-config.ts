export const siteConfig = {
  name: "Scholarsphere",
  description: "Painlessly track and plan academic progress, all in one place",
  github: "https://github.com/williampettit/scholarsphere",
  author: {
    name: "William",
    github: "https://github.com/williampettit",
  },
} as const;

type SiteMapEntry = {
  label: string;
  url: string;
  new?: boolean;
};

type SiteMap = {
  [key: string]: SiteMapEntry;
};

export const siteMap: SiteMap = {
  // main
  dashboard: {
    label: "Dashboard",
    url: "/",
  },
  courses: {
    label: "Courses",
    url: "/courses",
  },
  ai: {
    label: "AI",
    url: "/ai-chat",
    new: true,
  },
  mockTranscript: {
    label: "Mock Transcript",
    url: "#TODO-mock-transcript",
  },
  settings: {
    label: "Settings",
    url: "/settings",
  },

  // auth
  login: {
    label: "Login",
    url: "/auth/login",
  },
  logout: {
    label: "Logout",
    url: "/auth/logout",
  },

  // misc
  terms: {
    label: "Terms",
    url: "/terms",
  },
  privacy: {
    label: "Privacy",
    url: "/privacy",
  },
  changelog: {
    label: "Changelog",
    url: "/changelog",
  },
} as const;

export const navLinks: SiteMap = {
  dashboard: siteMap.dashboard,
  ai: siteMap.ai,
  courses: siteMap.courses,
  mockTranscript: siteMap.mockTranscript,
  changelog: siteMap.changelog,
  settings: siteMap.settings,
} as const;

export const settingsSidebarNavLinks: SiteMap = {
  profile: {
    label: "Profile",
    url: siteMap.settings.url + "/profile",
  },
  account: {
    label: "Account",
    url: siteMap.settings.url + "/account",
  },
  appearance: {
    label: "Appearance",
    url: siteMap.settings.url + "/appearance",
  },
  ai: {
    label: "AI",
    url: siteMap.settings.url + "/ai",
    new: true,
  },
  sessions: {
    label: "Sessions",
    url: siteMap.settings.url + "/sessions",
  },
  connections: {
    label: "Connections",
    url: siteMap.settings.url + "/connections",
  },
} as const;
