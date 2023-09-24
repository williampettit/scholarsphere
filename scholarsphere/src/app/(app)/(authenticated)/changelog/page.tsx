import dayjs from "dayjs";

type ChangelogEntryProps = {
  id: string;
  title: string;
  content: string;
  date: Date;
};

async function getMockChangelogData(): Promise<ChangelogEntryProps[]> {
  // TODO: remove fake delay once i have a real changelog
  //       (this is just to show off the loading spinner)
  // await new Promise((resolve) => setTimeout(resolve, 500));

  return Array.from(
    { length: 100 },
    (_, i): ChangelogEntryProps => ({
      id: i.toString(),
      title: "Lorem ipsum dolor sit amet",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod, nisl quis tincidunt aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      date: dayjs()
        .subtract(i * 5, "day")
        .toDate(),
    }),
  );
}

function ChangelogEntry({ title, content, date }: ChangelogEntryProps) {
  return (
    <div>
      <div className="flex flex-row items-center space-x-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <h2 className="text-lg font-medium">
          {dayjs(date).format("MMMM D, YYYY")}
        </h2>
      </div>
      <p className="text-justify text-sm text-muted-foreground">{content}</p>
    </div>
  );
}

export default async function ChangelogPage() {
  const changelogData = await getMockChangelogData();

  return (
    <>
      <div className="flex flex-1 flex-col space-y-8 lg:max-w-2xl">
        {changelogData
          .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
          .map((entry) => (
            <ChangelogEntry key={entry.id} {...entry} />
          ))}
      </div>
    </>
  );
}
