import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { Theme } from "@/lib/themes";

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
  radius: 0.4,
};

//
export const themeConfigAtom = atomWithStorage<ThemeConfig>(
  "theme-config",
  initialThemeConfig,
);

//
export function useThemeConfig() {
  return useAtom(themeConfigAtom);
}
