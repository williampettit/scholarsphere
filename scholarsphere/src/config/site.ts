export const siteConfig = {
  name: "Scholarsphere",
  author: "William Pettit",
  description: "Painlessly track and plan academic progress, all in one place.",

  social: {
    author: "https://github.com/williampettit",
    github: "https://github.com/williampettit/scholarsphere",
  },

  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
  },

  links: {
    dashboard: {
      label: "Dashboard",
      href: "/",
    },
  },

  nav: [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Courses",
      href: "/courses",
    },
    {
      label: "Mock Transcript",
      href: "",
    },
    {
      label: "Changelog",
      href: "/changelog",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
