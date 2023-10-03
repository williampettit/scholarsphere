import { UserRole } from "@/types/shared";

import { Icons } from "@/components/icons";

type UserRoleMap = {
  [key in UserRole]: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    classes: string;
  };
};

export const USER_ROLE_MAP: UserRoleMap = {
  [UserRole.USER]: {
    label: "User",
    icon: Icons.UserRole,
    classes: "text-emerald-600",
  },
  [UserRole.PREMIUM]: {
    label: "Premium",
    icon: Icons.PremiumRole,
    classes: "text-cyan-600",
  },
  [UserRole.ADMIN]: {
    label: "Admin",
    icon: Icons.AdminRole,
    classes: "text-rose-600",
  },
};
