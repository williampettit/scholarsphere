import { Metadata } from "next";

import dayjs from "dayjs";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

export const metadata: Metadata = {
  title: "Changelog",
};

interface ChangelogEntryProps {
  isoDate: string;
  content: string;
}

async function mockGetChangelogData() {
  const changelogData: ChangelogEntryProps[] = [
    {
      isoDate: "1970-01-01T00:00:00",
      content: "This is what was changed: ...",
    },
  ];

  return changelogData;
}

export default async function ChangelogPage() {
  const changelogData = await mockGetChangelogData();

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Changelog</PageHeaderTitle>

        <PageHeaderSubtitle>
          Check out the latest site improvements!
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
                <div
                  key={entry.isoDate}
                >
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
