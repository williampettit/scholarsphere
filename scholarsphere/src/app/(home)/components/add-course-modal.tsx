"use client";

import { S_addCourse } from "@/server/actions/add-course";
import {
  SemesterTypeEnum,
  addCourseFormSchema,
  type AddCourseFormSchema,
} from "@/server/actions/schemas";
import { S_getUserSemesters } from "@/server/actions/get-user-semesters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/app/(home)/components/date-picker";

interface AddCourseModalProps {
  children: React.ReactNode;
}

export function AddCourseModal({ children }: AddCourseModalProps) {
  const [existingSemesters, setExistingSemesters] =
    useState<Awaited<ReturnType<typeof S_getUserSemesters>>>();

  async function refreshExistingSemesters() {
    S_getUserSemesters().then(setExistingSemesters);
  }

  useEffect(() => {
    refreshExistingSemesters();
  }, []);

  const form = useForm<AddCourseFormSchema>({
    resolver: zodResolver(addCourseFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const [open, setOpen] = useState(false);

  async function onOpenChange(value: boolean) {
    form.reset();
    if (value) {
      refreshExistingSemesters();
    }
    setOpen(value);
  }

  async function onSubmit(data: AddCourseFormSchema) {
    const result = await S_addCourse({
      ...data,
      semesterType,
    });
    if (result.success) {
      toast({
        title: "Success",
        description: "Course Added",
      });
      setOpen(false);
    } else {
      toast({
        title: "Error",
        description: result?.error?.toString() ?? "Unknown error occurred",
      });
    }
  }

  const [semesterType, setSemesterType] = useState<SemesterTypeEnum>(
    SemesterTypeEnum.new
  );

  function onSemesterTypeChange(value: string) {
    switch (value) {
      case "new": {
        setSemesterType(SemesterTypeEnum.new);
        break;
      }
      case "existing": {
        setSemesterType(SemesterTypeEnum.existing);
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
                  disabled={existingSemesters && existingSemesters.length === 0}
                >
                  Existing Semester
                </TabsTrigger>

                <TabsTrigger value="new">New Semester</TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="space-y-4">
                <FormField
                  control={form.control}
                  name="existingSemesterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <Select
                        required
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a semester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {existingSemesters?.map((semester) => (
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
                      <FormLabel>End Date</FormLabel>
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
                    <Input placeholder="MATH 3300" {...field} />
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
