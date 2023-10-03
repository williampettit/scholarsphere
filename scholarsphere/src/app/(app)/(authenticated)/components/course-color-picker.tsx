"use client";

import { COURSE_COLOR_MAP } from "@/lib/course-color-map";
import { cn, entries } from "@/lib/utils";
import { type CourseColor } from "@/types/shared";

import { S_editCourse } from "@/server/actions/edit-course";

import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";

import { CourseColorDot } from "@/app/(app)/(authenticated)/components/course-color-dot";

type CourseColorPickerProps = {
  courseId: string;
  courseName: string;
  currentColor: CourseColor;
};

export function CourseColorPicker({
  courseId,
  courseName,
  currentColor,
}: CourseColorPickerProps) {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          Pick Color
          <span className="text-sm text-muted-foreground">{courseName}</span>
        </div>

        <Separator />

        <div className="grid grid-cols-12 place-items-center items-center justify-center gap-2 p-1">
          {entries(COURSE_COLOR_MAP).map(([color, _]) => (
            <Tooltip key={color}>
              <TooltipTrigger>
                <CourseColorDot
                  key={color}
                  className={cn(
                    "h-3 w-3 cursor-pointer",
                    "hover:border-2 hover:border-accent-foreground/25",
                    {
                      "border-2 border-accent-foreground/50":
                        color === currentColor,
                    },
                  )}
                  color={color}
                  onClick={() => {
                    S_editCourse({
                      id: courseId,
                      color: color,
                    })
                      .then(() => {
                        toast({
                          title: "Course color updated",
                        });
                      })
                      .catch(() => {
                        toast({
                          title: "Failed to update course color",
                          variant: "destructive",
                        });
                      });
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{color.toLowerCase()}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </>
  );
}
