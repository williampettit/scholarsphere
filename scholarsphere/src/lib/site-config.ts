export const siteConfig = {
  name: "Scholarsphere",
  description: "Painlessly track and plan academic progress, all in one place",
  github: "https://github.com/williampettit/scholarsphere",
  author: {
    name: "William",
    github: "https://github.com/williampettit",
  },
} as const;

export const siteMap = {
  // main
  dashboard: {
    label: "Dashboard",
    url: "/",
  },
  courses: {
    label: "Courses",
    url: "/courses",
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
    url: "#TODO-terms",
  },
  privacy: {
    label: "Privacy",
    url: "#TODO-privacy",
  },
  changelog: {
    label: "Changelog",
    url: "/changelog",
  },
} as const;

export const navLinks = {
  dashboard: siteMap.dashboard,
  courses: siteMap.courses,
  mockTranscript: siteMap.mockTranscript,
  changelog: siteMap.changelog,
} as const;

export const settingsSidebarNavLinks = {
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
} as const;
