"use server";

import { revalidatePath } from "next/cache";

import { extendZodWithOpenApi, generateSchema } from "@anatine/zod-openapi";
import OpenAI from "openai";
import { z } from "zod";

import {
  type AddAssignmentFromNaturalLanguageValues,
  addAssignmentFromNaturalLanguageSchema,
} from "@/server/actions/schemas";
import { requireUserOpenAiApiKey } from "@/server/auth";
import { prismaClient } from "@/server/prisma";

extendZodWithOpenApi(z);

const _assignmentsResponseSchema = z.object({
  assignments: z
    .array(
      z
        .object({
          name: z.string().openapi({
            description: "The name of the assignment, e.g. 'Test 1'",
          }),
          year: z
            .number()
            .optional()
            .openapi({ description: "The year of the due date (e.g. 2023)" }),
          month: z.number().openapi({
            description: "The month of the due date (e.g. 2 for February)",
          }),
          day: z
            .number()
            .openapi({ description: "The day of the due date (e.g. 14)" }),
          hour: z
            .number()
            .optional()
            .openapi({ description: "The hour of the due date (e.g. 23)" }),
          minute: z
            .number()
            .optional()
            .openapi({ description: "The minute of the due date (e.g. 59)" }),
        })
        .openapi({ description: "An assignment to add to the course" }),
    )
    .openapi({
      description: "An array of assignments to add to the course",
    }),
});

const _assignmentsResponseOpenApiSchema = generateSchema(
  _assignmentsResponseSchema,
);

export async function S_addAssignmentFromNaturalLanguage(
  data: AddAssignmentFromNaturalLanguageValues,
) {
  //
  console.log(
    "[SERVER] S_addAssignmentFromNaturalLanguage: data:",
    JSON.stringify(data, null, 2),
  );

  //
  const parsedInputData =
    addAssignmentFromNaturalLanguageSchema.safeParse(data);

  //
  if (!parsedInputData.success) {
    throw new Error(parsedInputData.error.message);
  }

  //
  console.log(
    "[SERVER] S_addAssignmentFromNaturalLanguage: parsedInputData:",
    JSON.stringify(parsedInputData, null, 2),
  );

  //
  const { courseId, naturalLanguageQuery } = parsedInputData.data;

  // get userid and openai api key from session
  const { userId, userOpenAiApiKey } = await requireUserOpenAiApiKey();

  // create openai client with user's api key
  const openai = new OpenAI({
    apiKey: userOpenAiApiKey,
  });

  // (function to call)
  const FUNCTION_CALL_NAME = "add_assignments";

  // create openai completion
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    user: userId,
    functions: [
      {
        name: FUNCTION_CALL_NAME,
        description:
          "Add one or more assignments to the course (e.g. 'add Test 1 for September 20th')",
        parameters: {
          ..._assignmentsResponseOpenApiSchema,
        },
        /*
        parameters: {
          type: "object",
          properties: {
            assignments: {
              type: "array",
              description: "An array of assignments to add to the course",
              items: {
                type: "object",
                required: ["name", "month", "day"],
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
                    description:
                      "The month of the due date (e.g. 2 for February)",
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
              },
            },
          },
        },
        */
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

  //
  console.log(
    "[SERVER] S_addAssignmentFromNaturalLanguage: functionCall:",
    JSON.stringify(functionCall, null, 2),
  );

  // check function call name
  if (functionCall.name !== FUNCTION_CALL_NAME) {
    throw new Error(
      `Unexpected function call (got: '${functionCall.name}', expected: '${FUNCTION_CALL_NAME}')`,
    );
  }

  // parse agent function call arguments
  const parsedAssignments = _assignmentsResponseSchema.safeParse(
    JSON.parse(functionCall.arguments),
  );

  // check if parsed assignments are valid
  if (!parsedAssignments.success) {
    console.error(
      "[SERVER] parsedAssignments.error:",
      parsedAssignments.error.toString(),
    );

    throw new Error("Invalid assignments response");
  }

  // get assignments
  const { assignments: assignmentsToAdd } = parsedAssignments.data;

  // check if any assignments were returned from agent
  if (assignmentsToAdd.length === 0) {
    throw new Error("No assignment arguments");
  }

  // add assignments to database
  for (const assignmentArguments of assignmentsToAdd) {
    // create due date object
    const assignmentDueDate = new Date(
      assignmentArguments.year ?? new Date().getFullYear(),
      assignmentArguments.month - 1,
      assignmentArguments.day,
      assignmentArguments.hour ?? 23,
      assignmentArguments.minute ?? 59,
    );

    // add assignment to database
    await prismaClient.assignment.create({
      data: {
        userId,
        courseId: courseId,
        title: assignmentArguments.name,
        dueDate: assignmentDueDate,
      },
    });
  }

  //
  console.log(
    "[SERVER] S_addAssignmentFromNaturalLanguage: assignmentsToAdd:",
    JSON.stringify(assignmentsToAdd, null, 2),
  );

  //
  revalidatePath(`/course/${courseId}`);
}
