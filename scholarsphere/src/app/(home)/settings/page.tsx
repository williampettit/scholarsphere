import { redirect } from "next/navigation";

import { settingsSidebarNavLinks } from "@/config/site";

export default function SettingsPage() {
  redirect(settingsSidebarNavLinks.profile.url);
}
