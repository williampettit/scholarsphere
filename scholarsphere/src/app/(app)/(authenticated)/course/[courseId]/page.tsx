import { cn, formatDateFromNow, getRelativeDateColor } from "@/lib/utils";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import { AssignmentMenu } from "@/components/menus/assignment-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { AddAssignmentInputForm } from "@/app/(app)/(authenticated)/course/[courseId]/components/add-assignment-input";

type CoursePageParams = {
  courseId: string;
};

type CoursePageProps = {
  params: CoursePageParams;
};

async function getCourseData(courseId: string) {
  // TEMP: wait 10 seconds
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  const { userId } = await requireUser();

  const course = await prismaClient.course.findUniqueOrThrow({
    where: {
      id: courseId,
      userId,
    },
    select: {
      name: true,
      shortId: true,
      description: true,
      creditHours: true,
      currentGrade: true,
      color: true,
      createdAt: true,
      updatedAt: true,

      assignments: {
        select: {
          id: true,
          title: true,
          dueDate: true,
          isComplete: true,
        },
      },

      user: {
        select: {
          name: true,
          image: true,
        },
      },

      semester: {
        select: {
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  return {
    ...course,
    description: course.description ?? "No description.",
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = params;

  const courseData = await getCourseData(courseId);

  return (
    <>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        <Card className="col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
            <CardDescription>
              Add assignments using natural language here.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            <AddAssignmentInputForm courseId={courseId} />

            <Separator />

            <div className="flex flex-col space-y-4">
              {courseData.assignments
                .sort((a, b) => {
                  const completeComparison =
                    Number(a.isComplete) - Number(b.isComplete);
                  if (completeComparison !== 0) {
                    return completeComparison;
                  }
                  return a.dueDate.getTime() - b.dueDate.getTime();
                })
                // .sort((a, b) => {
                //   return a.dueDate.getTime() - b.dueDate.getTime();
                // })
                // .sort((a, b) => {
                //   return Number(a.isComplete) - Number(b.isComplete);
                // })
                .map((assignment) => (
                  <Card key={assignment.id}>
                    <CardHeader className="flex flex-row justify-between">
                      <div>
                        <CardTitle className="flex flex-row items-center space-x-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              assignment.isComplete
                                ? "bg-emerald-600"
                                : "bg-rose-600",
                            )}
                          />

                          <p>{assignment.title}</p>
                        </CardTitle>

                        <CardDescription
                          className={cn({
                            [getRelativeDateColor(assignment.dueDate)]:
                              !assignment.isComplete,
                            "text-muted-foreground": assignment.isComplete,
                          })}
                        >
                          {assignment.isComplete ? (
                            <>Completed</>
                          ) : (
                            <>Due {formatDateFromNow(assignment.dueDate)}</>
                          )}
                        </CardDescription>
                      </div>

                      <AssignmentMenu
                        courseId={courseId}
                        assignmentId={assignment.id}
                        assignmentName={assignment.title}
                      />
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Course Info</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">Course Name</p>
                  <p className="text-lg font-bold">{courseData.name}</p>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course Short ID
                  </p>
                  <p className="text-lg font-bold">{courseData.shortId}</p>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course Credit Hours
                  </p>
                  <p className="text-lg font-bold">{courseData.creditHours}</p>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course Current Grade
                  </p>
                  <p className="text-lg font-bold">{courseData.currentGrade}</p>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course Description
                  </p>
                  <p className="text-lg font-bold">{courseData.description}</p>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course Created At
                  </p>
                  <p className="text-lg font-bold">
                    {courseData.createdAt.toDateString()}
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course Updated At
                  </p>
                  <p className="text-lg font-bold">
                    {courseData.updatedAt.toDateString()}
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">Student</p>
                  <div className="flex flex-row items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={courseData.user.image ?? undefined}
                        alt={`${courseData.user.name ?? "User"}'s avatar`}
                      />
                      <AvatarFallback />
                    </Avatar>

                    <p className="text-lg font-bold">{courseData.user.name}</p>
                  </div>
                </div>

                {courseData.semester && (
                  <>
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Semester Name
                      </p>
                      <p className="text-lg font-bold">
                        {courseData.semester.name}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Semester Start Date
                      </p>
                      <p className="text-lg font-bold">
                        {courseData.semester.startDate.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Semester End Date
                      </p>
                      <p className="text-lg font-bold">
                        {courseData.semester.endDate.toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
