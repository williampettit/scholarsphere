import dayjs from "dayjs";

interface ChangelogEntryProps {
  title: string;
  content: string;
  isoString: string;
}

async function getMockChangelogData(): Promise<ChangelogEntryProps[]> {
  // TODO: remove fake delay once i have a real changelog
  //       (this is just to show off the loading spinner)
  await new Promise((resolve) => setTimeout(resolve, 500));

  return Array.from(
    { length: 100 },
    (_, i): ChangelogEntryProps => ({
      title: "Lorem ipsum dolor sit amet",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod, nisl quis tincidunt aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      isoString: dayjs()
        .subtract(i * 3, "day")
        .toISOString(),
    })
  );
}

export default async function ChangelogPage() {
  const sortedChangelogData = await getMockChangelogData().then((data) =>
    data.sort((a, b) => b.isoString.localeCompare(a.isoString))
  );

  return (
    <>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="flex-1 lg:max-w-2xl space-y-8">
          {sortedChangelogData.map((entry) => (
            <div key={entry.isoString}>
              <div className="flex flex-row space-x-6 items-center">
                <h2 className="text-lg font-semibold">{entry.title}</h2>
                <h2 className="text-lg font-medium">
                  {dayjs(entry.isoString).format("MMMM D, YYYY")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground text-justify">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
