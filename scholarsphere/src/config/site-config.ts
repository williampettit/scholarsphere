type SiteConfig = {
  name: string;
  description: string;
  github: string;
  author: {
    name: string;
    github: string;
  };
};

export const siteConfig: SiteConfig = {
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
  aiChat: {
    label: "AI Chat",
    url: "/ai-chat",
    new: true,
  },
  apiDocs: {
    label: "API",
    url: "/docs",
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
  aiChat: siteMap.aiChat,
  apiDocs: siteMap.apiDocs,
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
    new: true,
  },
  aiChat: {
    label: "AI Chat",
    url: siteMap.settings.url + "/ai-chat",
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
