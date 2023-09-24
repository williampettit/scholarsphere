"use client";

import { usePathname, useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DASHBOARD_TABS = {
  "/": "Overview",
  "/next-semester": "Next Semester",
};

export function DashboardTabs() {
  const pathname = usePathname();

  const router = useRouter();

  function handleOnValueChange(value: string) {
    router.push(value, {
      scroll: false,
    });
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-6">
          <Tabs value={pathname} onValueChange={handleOnValueChange}>
            <TabsList>
              {Object.entries(DASHBOARD_TABS).map(([value, label]) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </>
  );
}
