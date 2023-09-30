import { type LayoutProps } from "@/types/layout";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

import { SettingsSidebarNav } from "@/app/(app)/(authenticated)/settings/components/settings-sidebar";

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
        <SettingsSidebarNav />

        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </>
  );
}
