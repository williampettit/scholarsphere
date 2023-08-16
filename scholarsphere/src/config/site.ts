export const siteConfig = {
  name: "scholarsphere",
  url: "/",
  logo: "TODO-logo.png",
  description: "Painlessly track and plan academic progress, all in one place.",
  author: "William Pettit",
  miscLinks: {
    author: "https://github.com/williampettit",
    github: "https://github.com/williampettit/scholarsphere",
  },
  mainNavLinks: [
    {
      label: "Dashboard",
      href: "/home",
    },
    {
      label: "Courses",
      href: "/courses",
    },
    {
      label: "Mock Transcript",
      href: "#TODO-mock-transcript",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
