"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

import { type Semester } from "@/types/shared";

import { S_addCourse } from "@/server/actions/add-course";
import {
  type AddCourseFormSchema,
  CreateSemesterTypeEnum,
  addCourseFormSchema,
} from "@/server/actions/schemas";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

import { DatePickerWithPresets } from "@/app/(authenticated)/components/date-picker";

interface AddCourseModalProps {
  children: React.ReactNode;
  semesters: Pick<Semester, "id" | "name" | "startDate">[];
}

export function AddCourseModal({ children, semesters }: AddCourseModalProps) {
  const form = useForm<AddCourseFormSchema>({
    resolver: zodResolver(addCourseFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const [open, setOpen] = useState(false);

  async function onOpenChange(value: boolean) {
    form.reset();
    setOpen(value);
  }

  async function onSubmit(data: AddCourseFormSchema) {
    S_addCourse({
      ...data,
      semesterType,
    })
      .then(() => {
        toast({
          title: "Success",
          description: "Course Added",
        });
        setOpen(false);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add course",
        });
      });
  }

  const [semesterType, setSemesterType] = useState<CreateSemesterTypeEnum>(
    CreateSemesterTypeEnum.new,
  );

  function onSemesterTypeChange(value: string) {
    switch (value) {
      case "new": {
        setSemesterType(CreateSemesterTypeEnum.new);
        break;
      }
      case "existing": {
        setSemesterType(CreateSemesterTypeEnum.existing);
        break;
      }
      default: {
        throw new Error(`Invalid semester type: ${value}`);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Add Course</DialogTitle>
          <DialogDescription>
            Add a course to a new or existing semester here.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs onValueChange={onSemesterTypeChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="existing"
                  disabled={semesters && semesters.length === 0}
                >
                  Existing Semester
                </TabsTrigger>

                <TabsTrigger value="new">New Semester</TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="space-y-4">
                <FormField
                  control={form.control}
                  name="semesterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <Select
                        required
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a semester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {semesters
                            .sort((a, b) =>
                              dayjs(b.startDate).diff(dayjs(a.startDate)),
                            )
                            .map((semester) => (
                              <SelectItem key={semester.id} value={semester.id}>
                                {semester.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                <FormField
                  control={form.control}
                  name="newSemesterData.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester Name</FormLabel>
                      <FormControl>
                        <Input required placeholder="Spring 3001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newSemesterData.startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <DatePickerWithPresets
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newSemesterData.endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <DatePickerWithPresets
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Applied Linear Algebra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MATH 3300"
                      {...field}
                      value={field.value ?? undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creditHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Hours</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="3"
                      {...field}
                      {...form.register("creditHours", {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 pt-4">
              <Button
                type="reset"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                loading={
                  form.formState.isSubmitting ||
                  form.formState.isLoading ||
                  form.formState.isValidating
                }
              >
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
