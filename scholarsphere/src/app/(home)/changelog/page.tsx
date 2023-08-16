import { Metadata } from "next";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";
import dayjs from "dayjs";

export const metadata: Metadata = {
  title: "Changelog",
};

interface ChangelogDataEntry {
  isoDate: string;
  content: string;
}

interface ChangelogData {
  data: ChangelogDataEntry[];
}

async function mockGetChangelogData(): Promise<ChangelogData> {
  const changelogData = [
    {
      isoDate: "1970-01-01T00:00:00",
      content: "This is what was changed: ...",
    },
  ];

  return {
    data: changelogData,
  };
}

export default async function ChangelogPage() {
  const { data: changelogData } = await mockGetChangelogData();

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Changelog</PageHeaderTitle>

        <PageHeaderSubtitle>
          Read about the latest updates to the site.
        </PageHeaderSubtitle>
      </PageHeader>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="flex-1 lg:max-w-2xl">
          <div className="space-y-6">
            {changelogData
              .sort(
                (a, b) =>
                  new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
              )
              .map((entry) => (
                <div>
                  <h3 className="text-lg font-medium">
                    {dayjs(entry.isoDate).format("MMMM D, YYYY")}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {entry.content}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
