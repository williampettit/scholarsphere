import { type Metadata } from "next";

import { type LayoutProps } from "@/types/layout";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

import { SettingsSidebarNavItems } from "@/app/(app)/(authenticated)/settings/components/settings-sidebar";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsLayout({ children }: LayoutProps) {
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
