import { Separator } from "@/components/ui/separator";
import { AccountForm } from "@/app/(authenticated)/settings/account/account-form";
import { mockGetUserData } from "@/mock-data";

export default async function SettingsAccountPage() {
  const userData = await mockGetUserData();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </div>
      <Separator />
      <AccountForm userData={userData} />
    </div>
  );
}
