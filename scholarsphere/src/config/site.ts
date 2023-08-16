export const siteConfig = {
  name: "Scholarsphere",
  url: "/",
  logo: "TODO.png",
  description: "Painlessly track and plan academic progress, all in one place.",
  author: "William Pettit",
  miscLinks: {
    author: "https://github.com/williampettit",
    github: "https://github.com/williampettit/scholarsphere",
  },
  mainNavLinks: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Courses",
      href: "/courses",
    },
    {
      label: "Mock Transcript",
      href: "#",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
