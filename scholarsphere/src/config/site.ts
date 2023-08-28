export const siteConfig = {
  name: "Scholarsphere",
  author: "William",
  description: "Painlessly track and plan academic progress, all in one place",

  social: {
    author: "https://github.com/williampettit",
    github: "https://github.com/williampettit/scholarsphere",
  },

  links: {
    // main
    dashboard: "/",
    courses: "/courses",
    mockTranscript: "#TODO-mock-transcript",
    settings: "/settings",

    // auth
    login: "/auth/login",
    logout: "/auth/logout",

    // misc
    terms: "#TODO-terms",
    privacy: "#TODO-privacy",
    changelog: "/changelog",
  },
} as const;

export const navLinks = [
  {
    label: "Dashboard",
    href: siteConfig.links.dashboard,
  },
  {
    label: "Courses",
    href: siteConfig.links.courses,
  },
  {
    label: "Mock Transcript",
    href: siteConfig.links.mockTranscript,
  },
  {
    label: "Changelog",
    href: siteConfig.links.changelog,
  },
] as const;

export const settingsSidebarNavItems = {
  profile: {
    title: "Profile",
    href: siteConfig.links.settings + "/profile",
  },
  account: {
    title: "Account",
    href: siteConfig.links.settings + "/account",
  },
  appearance: {
    title: "Appearance",
    href: siteConfig.links.settings + "/appearance",
  },
} as const;
