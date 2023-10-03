import Link from "next/link";

import dayjs from "dayjs";

import { cn, getGradeColor, pluralize } from "@/lib/utils";
import { type CourseBasicInfo } from "@/types/shared";

import { CourseStatusBadge } from "@/components/course-status-badge";
import { Icons } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

import { CourseColorDot } from "@/app/(app)/(authenticated)/components/course-color-dot";
import { CourseColorPicker } from "@/app/(app)/(authenticated)/components/course-color-picker";

type CourseCardProps = {
  course: CourseBasicInfo;
};

function formatSemesterDate(date: Date): string {
  return dayjs(date).format("MMM D YYYY");
}

function SemesterInfoPopoverContent({ course }: CourseCardProps) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-justify text-sm text-muted-foreground">
        {course.semester ? (
          <>
            <b className="text-accent-foreground">{course.name}</b> is linked to
            the <b className="text-accent-foreground">{course.semester.name}</b>{" "}
            semester, which starts on{" "}
            <b className="text-accent-foreground">
              {formatSemesterDate(course.semester.startDate)}
            </b>{" "}
            and ends on{" "}
            <b className="text-accent-foreground">
              {formatSemesterDate(course.semester.endDate)}
            </b>
            .
          </>
        ) : (
          <>This course is not associated with a semester.</>
        )}
      </span>
    </div>
  );
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger>
                <CourseColorDot className="h-3 w-3" color={course.color} />
              </PopoverTrigger>

              <PopoverContent>
                <CourseColorPicker
                  courseId={course.id}
                  courseName={course.name}
                  currentColor={course.color}
                />
              </PopoverContent>
            </Popover>

            <Link
              href={`/course/${course.id}`}
              scroll={false}
              className="line-clamp-1 overflow-ellipsis"
            >
              {course.name}
            </Link>
          </CardTitle>

          {course.semester && (
            <Popover>
              <PopoverTrigger>
                <span className="line-clamp-1 overflow-ellipsis text-muted-foreground">
                  {course.semester.name}
                </span>
              </PopoverTrigger>

              <PopoverContent>
                <SemesterInfoPopoverContent course={course} />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <CardDescription>
          <Link href={`/course/${course.id}`} scroll={false}>
            {course.shortId}
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="italic text-muted-foreground">
          {course.description ?? "No description."}
        </p>
      </CardContent>

      <CardFooter className="flex flex-row items-center gap-6">
        <div className="flex items-center">
          <Icons.Credits className="mr-2 h-4 w-4 opacity-70" />
          <span className="text-sm text-muted-foreground">
            {course.creditHours} {pluralize(course.creditHours, "credit")}
          </span>
        </div>

        <div className="flex items-center">
          <Icons.CourseGrade className="mr-2 h-4 w-4 opacity-70" />
          <span
            className={cn(
              "text-sm",
              "text-muted-foreground",
              getGradeColor(course.currentGrade),
            )}
          >
            {course.currentGrade.toFixed(1)}%
          </span>
        </div>

        <Popover>
          <PopoverTrigger>
            <CourseStatusBadge className="text-sm" status={course.status} />
          </PopoverTrigger>

          <PopoverContent>
            <SemesterInfoPopoverContent course={course} />
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-20" />
        </div>

        <Skeleton className="h-4 w-20" />
      </CardHeader>

      <CardContent>
        <Skeleton className="h-12 w-full" />
      </CardContent>

      <CardFooter className="flex flex-row items-center gap-4">
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
}
