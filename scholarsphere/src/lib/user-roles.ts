import { UserRole } from "@/types/shared";

import { Icons } from "@/components/icons";

type UserRolesProps = {
  [key in UserRole]: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  };
};

export const USER_ROLES: UserRolesProps = {
  [UserRole.USER]: {
    label: "User",
    icon: Icons.UserRole,
    color: "text-emerald-600",
  },
  [UserRole.PREMIUM]: {
    label: "Premium",
    icon: Icons.PremiumRole,
    color: "text-cyan-600",
  },
  [UserRole.ADMIN]: {
    label: "Admin",
    icon: Icons.AdminRole,
    color: "text-rose-600",
  },
};
