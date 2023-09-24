import { type Metadata } from "next";

import { type LayoutProps } from "@/types/layout";

import { requireUser } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

type CourseLayoutProps = LayoutProps & {
  params: {
    courseId: string;
  };
};

async function getCourseInfo(courseId: string) {
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
    },
  });

  return course;
}

// (dynamic metadata)
export async function generateMetadata({
  params,
}: {
  params: CourseLayoutProps["params"];
}): Promise<Metadata> {
  const { courseId } = params;

  const { name } = await getCourseInfo(courseId);

  return {
    title: name,
  };
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const { courseId } = params;

  const { name, shortId, description } = await getCourseInfo(courseId);

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>
          {name} <span className="text-muted-foreground">({shortId})</span>
        </PageHeaderTitle>

        <PageHeaderSubtitle>
          {description ?? "No description."}
        </PageHeaderSubtitle>
      </PageHeader>

      {children}
    </>
  );
}
