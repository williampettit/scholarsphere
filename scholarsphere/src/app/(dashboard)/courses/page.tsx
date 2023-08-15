import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses",
};

export default function CoursesPage() {
  return (
    <>
      TODO: Courses page
      {Array.from(Array(500).keys()).map((i) => (
        <p key={i}>Course {i}</p>
      ))}
    </>
  );
}
