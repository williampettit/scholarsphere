import { type Metadata } from "next";

import { type RootLayoutProps } from "@/types/root-layout";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

import { SettingsSidebarNavItems } from "@/app/(home)/settings/components/settings-sidebar-nav";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsLayout({ children }: RootLayoutProps) {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Settings</PageHeaderTitle>
        <PageHeaderSubtitle>
          Manage your profile and account preferences.
        </PageHeaderSubtitle>
      </PageHeader>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            <SettingsSidebarNavItems />
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </>
  );
}
