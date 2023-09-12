import { Icons } from "@/components/icons";

export const FALLBACK_AUTH_PROVIDER_DATA = {
  name: "Unknown",
  icon: () => <Icons.question className="h-4 w-4" />,
};

export const AUTH_PROVIDER_DATA = new Map([
  [
    "google",
    { name: "Google", icon: () => <Icons.google className="h-4 w-4" /> },
  ],
  [
    "github",
    { name: "GitHub", icon: () => <Icons.gitHub className="h-4 w-4" /> },
  ],
  [
    "apple",
    { name: "Apple", icon: () => <Icons.apple className="h-4 w-4" /> },
  ],
]);
