import { type Metadata } from "next";
import { type RootLayoutProps } from "@/types/root-layout";
import { SettingsSidebarNav } from "@/app/(home)/settings/components/settings-sidebar-nav";
import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

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
          <SettingsSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </>
  );
}
