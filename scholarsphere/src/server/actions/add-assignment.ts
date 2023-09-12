"use server";

import { revalidatePath } from "next/cache";

import OpenAI from "openai";

import {
  type AddAssignmentFormSchema,
  addAssignmentFormSchema,
  addAssignmentFromNaturalLanguageSchema,
} from "@/server/actions/schemas";
import { requireUser, requireUserOpenAiApiKey } from "@/server/auth";
import "@/server/auth";
import prisma from "@/server/prisma";

export async function S_addAssignment(data: AddAssignmentFormSchema) {
  const { userId } = await requireUser();

  const parsedData = addAssignmentFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Failed to parse data");
  }

  await prisma.assignment.create({
    data: {
      userId: userId,
      courseId: parsedData.data.courseId,
      title: parsedData.data.name,
      dueDate: parsedData.data.dueDate,
    },
  });

  revalidatePath("/");
}

export async function S_addAssignmentFromNaturalLanguage(formData: FormData) {
  //
  const parsedFormData = addAssignmentFromNaturalLanguageSchema.safeParse({
    naturalLanguageQuery: formData.get("naturalLanguageQuery"),
    courseId: formData.get("courseId"),
  });

  //
  if (!parsedFormData.success) {
    throw new Error("Failed to parse form data");
  }

  //
  const { courseId, naturalLanguageQuery } = parsedFormData.data;

  // get userid and openai api key from session
  const { userId, userOpenAiApiKey } = await requireUserOpenAiApiKey();

  // create openai client with user's api key
  const openai = new OpenAI({
    apiKey: userOpenAiApiKey,
  });

  // (function to call)
  const FUNCTION_CALL_NAME = "add_assignment";

  // create openai completion
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    user: userId,
    functions: [
      {
        name: FUNCTION_CALL_NAME,
        description:
          "Add an assignment to the course (e.g. 'add Test 1 for September 20th')",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the assignment, e.g. 'Test 1'",
            },
            year: {
              type: "number",
              description: "The year of the due date (e.g. 2023)",
            },
            month: {
              type: "number",
              description: "The month of the due date (e.g. 2 for February)",
            },
            day: {
              type: "number",
              description: "The day of the due date (e.g. 14)",
            },
            hour: {
              type: "number",
              description: "The hour of the due date (e.g. 23)",
            },
            minute: {
              type: "number",
              description: "The minute of the due date (e.g. 59)",
            },
          },

          required: ["name", "month", "day"],
        },
      },
    ],
    function_call: {
      name: FUNCTION_CALL_NAME,
    },
    messages: [
      {
        role: "system",
        content: [
          `The current date today is: ${new Date().toLocaleDateString()}.`,
          `There are ${new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0,
          ).getDate()} total days in this month.`,
        ].join("\n"),
      },
      {
        role: "user",
        content: naturalLanguageQuery,
      },
    ],
  });

  // get function call info from response
  const functionCall = response.choices[0].message.function_call;

  // check if function call exists
  if (!functionCall) {
    throw new Error("No function call");
  }

  // extract function call info
  const { name: functionCallName, arguments: functionCallArguments } =
    functionCall;

  // check function call name
  if (functionCallName !== FUNCTION_CALL_NAME) {
    throw new Error(`Invalid function call name (was: '${functionCallName}')`);
  }

  // get agent function call arguments
  const assignmentArguments = JSON.parse(functionCallArguments) as {
    name: string;
    year?: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
  };

  // TEMP
  console.log(
    "[SERVER] assignmentArguments:",
    JSON.stringify(assignmentArguments, null, 2),
  );

  // create due date object
  const assignmentDueDate = new Date(
    assignmentArguments.year ?? new Date().getFullYear(),
    assignmentArguments.month - 1,
    assignmentArguments.day,
    assignmentArguments.hour ?? 23,
    assignmentArguments.minute ?? 59,
  );

  // add assignment to database
  await prisma.assignment.create({
    data: {
      userId: userId,
      courseId: courseId,
      title: assignmentArguments.name,
      dueDate: assignmentDueDate,
    },
  });

  //
  revalidatePath(`/course/${courseId}`);
}
