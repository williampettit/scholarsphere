import { formatDateFromNow, getAssignmentDueDateColor } from "@/lib/utils";

import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { AddAssignmentInputForm } from "@/app/(authenticated)/course/[id]/components/add-assignment-input";

async function getCourseData(courseId: string) {
  const { userId } = await requireUser();

  const course = await prisma.course.findUniqueOrThrow({
    where: {
      id: courseId,
      userId: userId,
    },
    select: {
      // createdAt: true,
      // updatedAt: true,

      name: true,
      shortId: true,
      description: true,
      creditHours: true,
      currentGrade: true,
      color: true,

      assignments: {
        select: {
          id: true,
          title: true,
          dueDate: true,
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

export default async function CoursePage({
  params,
}: {
  params: {
    courseId: string;
  };
}) {
  const { courseId } = params;

  const courseData = await getCourseData(courseId);

  return (
    <>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        <Card className="col-span-2 lg:col-span-2">
          <CardHeader>
          <CardTitle>
            Assignments
          </CardTitle>
          
          
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            <AddAssignmentInputForm courseId={courseId} />  

            <div className="flex flex-col space-y-2">
              {courseData.assignments
                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                .map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex flex-row items-center space-x-2"
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500"> </div>

                    <p>{assignment.title}</p>

                    <p
                      className={getAssignmentDueDateColor(assignment.dueDate)}
                    >
                      {formatDateFromNow(assignment.dueDate)}
                    </p>

                    <p className="text-muted-foreground">
                      ({new Date(assignment.dueDate).toLocaleDateString()})
                    </p>
                  </div>
                ))}
            </div>

            <Separator />

            <pre className="text-green-500">
              {JSON.stringify(courseData, null, 2)}
            </pre>
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
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-bold">{courseData.name}</p>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">Short ID</p>
                  <p className="text-lg font-bold">{courseData.shortId}</p>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">Credit Hours</p>
                  <p className="text-lg font-bold">{courseData.creditHours}</p>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">Current Grade</p>
                  <p className="text-lg font-bold">{courseData.currentGrade}</p>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-lg font-bold">{courseData.description}</p>
                </div>

                {courseData.semester && (
                  <>
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">Semester</p>
                      <p className="text-lg font-bold">
                        {courseData.semester.name}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Start Date
                      </p>
                      <p className="text-lg font-bold">
                        {courseData.semester.startDate.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <p className="text-sm text-muted-foreground">End Date</p>
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
