import { type Metadata } from "next";

import { type RootLayoutProps } from "@/types/root-layout";

import { requireUser } from "@/server/auth";
import prisma from "@/server/prisma";

import {
  PageHeader,
  PageHeaderSubtitle,
  PageHeaderTitle,
} from "@/components/page-header";

type CoursePageParams = {
  id: string;
};

type CourseLayoutProps = RootLayoutProps & {
  params: CoursePageParams;
};

async function getCourseInfo(courseId: string) {
  const { userId } = await requireUser();

  const course = await prisma.course.findUniqueOrThrow({
    where: {
      id: courseId,
      userId: userId,
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
  params: CoursePageParams;
}): Promise<Metadata> {
  const { id: courseId } = params;

  const { name } = await getCourseInfo(courseId);

  return {
    title: name,
  };
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const { id: courseId } = params;

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
