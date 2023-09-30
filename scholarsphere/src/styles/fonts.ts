//
//
// best
// ----
// Inter
//
//
// good
// ----
// Chivo
// Work_Sans
// Plus_Jakarta_Sans
// Nunito_Sans
// Rubik
// Inter_Tight
// Sora
// Montserrat
// Mulish
//
//
// decent
// ------
// Lexend
// Epilogue
//
//
import { type CSSProperties } from "react";

import { Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
});

export type FontKey =
  | "montserrat"
  | "inter"
  | "chivo"
  | "work_sans"
  | "plus_jakarta_sans"
  | "nunito_sans"
  | "rubik"
  | "inter_tight"
  | "sora"
  | "mulish"
  | "lexend"
  | "epilogue"
  | "poppins"
  | "lato"
  | "open_sans"
  | "raleway"
  | "roboto"
  | "ubuntu"
  | "source_sans_pro"
  | "merriweather"
  | "lora"
  | "playfair_display";

type FontType = "sans-serif" | "serif";

export const FONT_TYPES: {
  [key in FontType]: {
    label: string;
  };
} = {
  "sans-serif": {
    label: "Sans Serif",
  },
  "serif": {
    label: "Serif",
  },
};

type FontMapEntry = {
  label: string;
  url: string;
  type: FontType;
  style: Required<
    Pick<
      CSSProperties,
      "fontFamily"
      // ...
    >
  >;
};

type FontMap = {
  [key in FontKey]: FontMapEntry;
};

// export const DEFAULT_FONT_KEY: FontKey = "plus_jakarta_sans";
export const DEFAULT_FONT_KEY: FontKey = "rubik";

export const FONT_COOKIE_NAME = "font";

const BASE_GOOGLE_FONTS_URL = "https://fonts.googleapis.com";

export const FONT_MAP: FontMap = {
  montserrat: {
    type: "sans-serif",
    label: "Montserrat",
    url:
      BASE_GOOGLE_FONTS_URL +
      "/css2?family=Montserrat:wght@400;700&display=swap",
    style: {
      fontFamily: "'Montserrat', sans-serif",
    },
  },
  inter: {
    type: "sans-serif",
    label: "Inter",
    url: BASE_GOOGLE_FONTS_URL + "/css2?family=Inter:wght@400;700&display=swap",
    style: {
      fontFamily: "'Inter', sans-serif",
    },
  },
  chivo: {
    type: "sans-serif",
    label: "Chivo",
    url: BASE_GOOGLE_FONTS_URL + "/css2?family=Chivo:wght@400;700&display=swap",
    style: {
      fontFamily: "'Chivo', sans-serif",
    },
  },
  work_sans: {
    type: "sans-serif",
    label: "Work Sans",
    url:
      BASE_GOOGLE_FONTS_URL +
      "/css2?family=Work+Sans:wght@400;700&display=swap",
    style: {
      fontFamily: "'Work Sans', sans-serif",
    },
  },
  plus_jakarta_sans: {
    type: "sans-serif",
    label: "Plus Jakarta Sans",
    url:
      BASE_GOOGLE_FONTS_URL +
      "/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap",
    style: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
  },
  nunito_sans: {
    type: "sans-serif",
    label: "Nunito Sans",
    url:
      BASE_GOOGLE_FONTS_URL +
      "/css2?family=Nunito+Sans:wght@400;700&display=swap",
    style: {
      fontFamily: "'Nunito Sans', sans-serif",
    },
  },
  rubik: {
    type: "sans-serif",
    label: "Rubik",
    url: BASE_GOOGLE_FONTS_URL + "/css2?family=Rubik:wght@400;700&display=swap",
    style: {
      fontFamily: "'Rubik', sans-serif",
    },
  },
  inter_tight: {
    type: "sans-serif",
    label: "Inter Tight",
    url: BASE_GOOGLE_FONTS_URL + "/css2?family=Inter:wght@400;600&display=swap",
    style: {
      fontFamily: "'Inter Tight', sans-serif",
    },
  },
  sora: {
    type: "sans-serif",
    label: "Sora",
    url: BASE_GOOGLE_FONTS_URL + "/css2?family=Sora:wght@400;700&display=swap",
    style: {
      fontFamily: "'Sora', sans-serif",
    },
  },
  mulish: {
    type: "sans-serif",
    label: "Mulish",
    url:
      BASE_GOOGLE_FONTS_URL + "/css2?family=Mulish:wght@400;700&display=swap",
    style: {
      fontFamily: "'Mulish', sans-serif",
    },
  },
  lexend: {
    type: "sans-serif",
    label: "Lexend",
    url:
      BASE_GOOGLE_FONTS_URL + "/css2?family=Lexend:wght@400;700&display=swap",
    style: {
      fontFamily: "'Lexend', sans-serif",
    },
  },
  epilogue: {
    type: "sans-serif",
    label: "Epilogue",
    url:
      BASE_GOOGLE_FONTS_URL + "/css2?family=Epilogue:wght@400;700&display=swap",
    style: {
      fontFamily: "'Epilogue', sans-serif",
    },
  },
  poppins: {
    type: "sans-serif",
    label: "Poppins",
    url:
      BASE_GOOGLE_FONTS_URL + "/css2?family=Poppins:wght@400;700&display=swap",
    style: {
      fontFamily: "'Poppins', sans-serif",
    },
  },
  lato: {
    type: "sans-serif",
    label: "Lato",
    url: BASE_GOOGLE_FONTS_URL + "/css2?family=Lato:wght@400;700&display=swap",
    style: {
      fontFamily: "'Lato', sans-serif",
    },
  },
  open_sans: {
    type: "sans-serif",
    label: "Open Sans",
    url:
      BASE_GOOGLE_FONTS_URL +
      "/css2?family=Open+Sans:wght@400;700&display=swap",
    style: {
      fontFamily: "'Open Sans', sans-serif",
    },
  },
  raleway: {
    type: "sans-serif",
    label: "Raleway",
    url:
      BASE_GOOGLE_FONTS_URL + "/css2?family=Raleway:wght@400;700&display=swap",
    style: {
      fontFamily: "'Raleway', sans-serif",
    },
  },
  roboto: {
    type: "sans-serif",
    label: "Roboto",
    url:
      BASE_GOOGLE_FONTS_URL + "/css2?family=Roboto:wght@400;700&display=swap",
    style: {
      fontFamily: "'Roboto', sans-serif",
    },
  },
  ubuntu: {
    type: "sans-serif",
    label: "Ubuntu",
    url:
      BASE_GOOGLE_FONTS_URL + "/css2?family=Ubuntu:wght@400;700&display=swap",
    style: {
      fontFamily: "'Ubuntu', sans-serif",
    },
  },
  source_sans_pro: {
    type: "sans-serif",
    label: "Source Sans Pro",
    url:
      BASE_GOOGLE_FONTS_URL +
      "/css2?family=Source+Sans+Pro:wght@400;700&display=swap",
    style: {
      fontFamily: "'Source Sans Pro', sans-serif",
    },
  },
  merriweather: {
    type: "serif",
    label: "Merriweather",
    url:
      BASE_GOOGLE_FONTS_URL +
      "/css2?family=Merriweather:wght@400;700&display=swap",
    style: {
      fontFamily: "'Merriweather', sans-serif",
    },
  },
  lora: {
    type: "serif",
    label: "Lora",
    url: BASE_GOOGLE_FONTS_URL + "/css2?family=Lora:wght@400;700&display=swap",
    style: {
      fontFamily: "'Lora', serif",
    },
  },
  playfair_display: {
    type: "serif",
    label: "Playfair Display",
    url:
      BASE_GOOGLE_FONTS_URL +
      "/css2?family=Playfair+Display:wght@400;700&display=swap",
    style: {
      fontFamily: "'Playfair Display', serif",
    },
  },
};
