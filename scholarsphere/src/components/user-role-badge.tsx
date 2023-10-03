import { USER_ROLE_MAP } from "@/lib/user-role-map";
import { cn } from "@/lib/utils";
import { type UserRole } from "@/types/shared";

type UserRoleBadgeProps = {
  role: UserRole;
  className?: string;
};

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const { label, icon: UserRoleIcon } = USER_ROLE_MAP[role];

  return (
    <div className={cn("flex flex-row gap-1 text-xs capitalize", className)}>
      <UserRoleIcon />

      {label}
    </div>
  );
}
