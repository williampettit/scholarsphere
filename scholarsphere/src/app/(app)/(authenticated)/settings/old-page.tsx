import { redirect } from "next/navigation";

import { settingsSidebarNavLinks } from "@/config/site-config";

export default function SettingsPage() {
  redirect(settingsSidebarNavLinks.account.url);
}
