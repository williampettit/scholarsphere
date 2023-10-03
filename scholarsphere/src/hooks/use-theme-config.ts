import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { siteConfig } from "@/config/site-config";
import { type Theme } from "@/lib/themes";

//
export const THEME_CONFIG_STORAGE_KEY: string =
  `${siteConfig.name}-theme-config`.toLowerCase();

// true by default, because we start in loading state
export const loadingThemeConfigAtom = atom<boolean>(true);

//
export const possibleThemeConfigRadiusValues = [
  0.0, 0.2, 0.4, 0.6, 0.8, 1.0,
] as const;

//
export type ThemeConfig = {
  theme: Theme["name"];
  radius: (typeof possibleThemeConfigRadiusValues)[number];
};

//
const initialThemeConfig: ThemeConfig = {
  theme: "stone",
  radius: 0.6,
};

//
export const themeConfigAtom = atomWithStorage<ThemeConfig>(
  THEME_CONFIG_STORAGE_KEY,
  initialThemeConfig,
);

//
export function useThemeConfig() {
  return useAtom(themeConfigAtom);
}
