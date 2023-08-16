import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/app/(authenticated)/settings/profile-form";
import { mockGetUserData } from "@/mock-data";

export default async function SettingsProfilePage() {
  const userData = await mockGetUserData();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>

      <Separator />

      <ProfileForm userData={userData} />
    </div>
  );
}
