import { Icons, SocialIcons } from "@/components/icons";

type AuthProviderMetadata = {
  name: string;
  icon: () => JSX.Element;
};

export const FALLBACK_AUTH_PROVIDER_METADATA: AuthProviderMetadata = {
  name: "Unknown",
  icon: () => <Icons.QuestionCircle className="h-4 w-4" />,
};

export const AUTH_PROVIDER_METADATA_MAP = new Map<string, AuthProviderMetadata>(
  [
    [
      "google",
      {
        name: "Google",
        icon: () => <SocialIcons.Google className="h-4 w-4" />,
      },
    ],
    [
      "github",
      {
        name: "GitHub",
        icon: () => <SocialIcons.GitHub className="h-4 w-4" />,
      },
    ],
    [
      "apple",
      { name: "Apple", icon: () => <SocialIcons.Apple className="h-4 w-4" /> },
    ],
  ],
);
