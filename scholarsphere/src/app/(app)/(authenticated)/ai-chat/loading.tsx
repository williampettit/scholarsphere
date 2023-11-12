import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAIChat() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>

      <div className="flex flex-row space-x-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="flex flex-col-reverse gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i}>
            <CardHeader
              className="
                flex
                flex-row
                justify-between
                space-y-0
              "
            >
              <div
                className="
                  flex
                  flex-row
                  space-x-2
                "
              >
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-6 w-12" />
            </CardHeader>

            <CardContent className="flex flex-col space-y-4">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
