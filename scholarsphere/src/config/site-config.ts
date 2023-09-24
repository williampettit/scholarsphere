export const siteConfig = {
  name: "Scholarsphere",
  description: "Painlessly track and plan academic progress, all in one place",
  github: "https://github.com/williampettit/scholarsphere",
  author: {
    name: "William Pettit",
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
  assignments: {
    label: "Assignments",
    url: "/assignments",
  },
  ai: {
    label: "AI Chat",
    url: "/ai-chat",
    new: true,
  },
  // mockTranscript: {
  //   label: "Mock Transcript",
  //   url: "#TODO-mock-transcript",
  // },
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
  courses: siteMap.courses,
  assignments: siteMap.assignments,
  ai: siteMap.ai,
  // mockTranscript: siteMap.mockTranscript,
  // changelog: siteMap.changelog,
  // settings: siteMap.settings,
} as const;

export const settingsSidebarNavLinks: SiteMap = {
  account: {
    label: "Account",
    url: siteMap.settings.url + "/account",
  },
  appearance: {
    label: "Appearance",
    url: siteMap.settings.url + "/appearance",
  },
  ai: {
    label: "AI Chat",
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
