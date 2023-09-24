import { Icons, SocialIcons } from "@/components/icons";

export const FALLBACK_AUTH_PROVIDER_DATA = {
  name: "Unknown",
  icon: () => <Icons.QuestionCircle className="h-4 w-4" />,
};

export const AUTH_PROVIDER_DATA = new Map([
  [
    "google",
    { name: "Google", icon: () => <SocialIcons.Google className="h-4 w-4" /> },
  ],
  [
    "github",
    { name: "GitHub", icon: () => <SocialIcons.GitHub className="h-4 w-4" /> },
  ],
  [
    "apple",
    { name: "Apple", icon: () => <SocialIcons.Apple className="h-4 w-4" /> },
  ],
]);
