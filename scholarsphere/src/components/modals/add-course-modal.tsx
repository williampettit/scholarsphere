"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

import { type Semester } from "@/types/shared";

import { S_addCourse } from "@/server/actions/add-course";
import {
  AddCourseFormSemesterType,
  type AddCourseFormValues,
  addCourseFormSchema,
  addCourseFormSemesterTypeSchema,
} from "@/server/actions/schemas";

import { CloseModalButton, Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
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

import { DatePicker } from "@/app/(app)/(authenticated)/components/date-picker";

type AddCourseModalProps = {
  semesters: Pick<Semester, "id" | "name" | "startDate" | "endDate">[];
};

type AddCourseFormValuesWithoutSemesterType = Omit<
  AddCourseFormValues,
  "semesterType"
>;

export function AddCourseModal({ semesters }: AddCourseModalProps) {
  const form = useForm<AddCourseFormValuesWithoutSemesterType>({
    resolver: zodResolver(addCourseFormSchema),
    defaultValues: {
      name: "",
      shortId: "",
      creditHours: 0,
      semesterId: null,
      newSemesterData: {
        name: "",
        endDate: undefined,
        startDate: undefined,
      },
    },
  });

  function onSubmit(data: AddCourseFormValuesWithoutSemesterType) {
    S_addCourse({
      ...data,
      semesterType,
    })
      .then(() => {
        toast({
          title: "Course added",
        });
      })
      .catch(() => {
        toast({
          title: "Error adding course",
          variant: "destructive",
        });
      });
  }

  const [semesterType, setSemesterType] =
    useState<AddCourseFormSemesterType>("new");

  function onSemesterTypeChange(value: string) {
    const parsedValue = addCourseFormSemesterTypeSchema.safeParse(value);

    if (!parsedValue.success) {
      throw new Error(`Invalid semester type: ${value}`);
    }

    setSemesterType(parsedValue.data);
  }

  return (
    <>
      <Modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs onValueChange={onSemesterTypeChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="existing"
                    disabled={!semesters || semesters.length === 0}
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
                        <FormLabel>Existing Semester</FormLabel>
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
                                <SelectItem
                                  key={semester.id}
                                  value={semester.id}
                                >
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
                        <FormLabel>New Semester Name</FormLabel>
                        <FormControl>
                          <Input
                            required
                            placeholder="Spring 3001"
                            {...field}
                          />
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
                        <FormLabel>New Semester Start Date</FormLabel>
                        <DatePicker
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
                        <FormLabel>New Semester End Date</FormLabel>
                        <DatePicker
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
                    <FormLabel>Course Name</FormLabel>
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
                    <FormLabel>Course Short ID</FormLabel>
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
                    <FormLabel>Course Credit Hours</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4 pt-4">
                <CloseModalButton type="reset" variant="outline">
                  Cancel
                </CloseModalButton>

                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Modal>
    </>
  );
}
