import { redirect } from "next/navigation";

import { settingsSidebarNavLinks } from "@/lib/site-config";

export default function SettingsPage() {
  redirect(settingsSidebarNavLinks.profile.url);
}
