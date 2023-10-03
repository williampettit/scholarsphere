import { entries } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EndpointData = {
  description: string;
  response?: any;
  requiresAuth: boolean;
};

type EndpointURL = `/api/${string}`;

type EndpointDataMap = Record<EndpointURL, EndpointData>;

const ENDPOINTS: EndpointDataMap = {
  "/api/user/gpa": {
    requiresAuth: true,
    description: "Get the user's GPA.",
    response: { completed_gpa: 3.75, tenative_gpa: 3.8 },
  },
  "/api/user/credits": {
    requiresAuth: true,
    description: "Get the number of credits the user has earned.",
    response: {
      attempted_credits: 75,
      passed_credits: 72,
      in_progress_credits: 15,
      planned_credits: 15,
      not_planned_credits: 0,
    },
  },
  "/api/user/upcoming-assignments": {
    requiresAuth: true,
    description: "Get the list of assignments that are due soon.",
    response: {
      upcoming_assignments: [
        {
          title: "7.1 Homework",
          course: "Calculus II",
          due_date: "2023-09-25T04:00:00.000Z",
        },
        {
          title: "7.2 Homework",
          course: "Calculus II",
          due_date: "2023-09-25T04:00:00.000Z",
        },
      ],
    },
  },
  "/api/user/active-courses": {
    requiresAuth: true,
    description:
      "Get the list of courses that the user is currently enrolled in.",
    response: {
      active_courses: [
        {
          name: "Computer Science Ethics",
          short_id: "CSCI2920",
          status: 0,
          credit_hours: 3,
          current_grade: 95,
        },
        {
          name: "Data Structures",
          short_id: "CSCI2720",
          status: 0,
          credit_hours: 3,
          current_grade: 95,
        },
        {
          name: "Calculus II",
          short_id: "MATH2212",
          status: 0,
          credit_hours: 4,
          current_grade: 100,
        },
        {
          name: "Environmental Science",
          short_id: "ENVS1401",
          status: 0,
          credit_hours: 3,
          current_grade: 95,
        },
        {
          name: "Environmental Science Lab",
          short_id: "ENVS1401L",
          status: 0,
          credit_hours: 1,
          current_grade: 95,
        },
      ],
    },
  },
};

type ExampleResponseBlockProps = {
  response: any;
};

function ExampleResponseBlock({ response }: ExampleResponseBlockProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Response</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-scroll rounded-md bg-accent/30 p-4 text-xs text-emerald-400">
          {JSON.stringify(response, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}

type EndpointBlockProps = {
  data: EndpointData & {
    endpoint: EndpointURL;
  };
};

function EndpointBlock({ data }: EndpointBlockProps) {
  const { endpoint, description, response, requiresAuth } = data;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-mono font-bold">{endpoint}</CardTitle>

          <CardDescription className="flex flex-row items-center justify-between">
            <span>{description}</span>

            {requiresAuth ? (
              <span className="text-red-500">Requires authentication.</span>
            ) : (
              <span className="text-green-500">
                Does not require authentication.
              </span>
            )}
          </CardDescription>
        </CardHeader>

        {response && (
          <CardContent>
            <ExampleResponseBlock response={response} />
          </CardContent>
        )}
      </Card>
    </>
  );
}

export default function DocsPage() {
  return (
    <>
      {entries(ENDPOINTS).map(([endpoint, { ...data }]) => (
        <EndpointBlock
          key={endpoint}
          data={{
            endpoint,
            ...data,
          }}
        />
      ))}
    </>
  );
}
