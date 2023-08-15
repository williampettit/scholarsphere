import dayjs from "dayjs";
import { DashboardData } from "./app/(dashboard)/dashboard/page";

type IdType = string

export interface Assignment {
  id: IdType;
  title: string;
  due_date: string;
  completed: boolean;
}

export interface Course {
  id: IdType;
  short_id: string;
  connected_semester_id: IdType | null;
  title: string;
  description: string;
  credit_hours: number;
  grade: number;
  assignments: Assignment[];
}

export interface Semester {
  id: IdType;
  custom_name: string | null;
  start_date: string;
  end_date: string;
  connected_course_ids: IdType[];
}

export interface User {
  id: IdType;
  vanity_name: string;
  email: string;
  avatar_url: string;
  semesters: Semester[];
  courses: Course[];
}

interface MockData {
  user: User;
}

export function mockGetUserData() {
  const user = MOCK_DATA.user;

  return {
    ...user,
    semesters: user.semesters.map((semester) => ({
      ...semester,
      status: (() => {
        // end date is in the past
        if (dayjs().isAfter(semester.end_date)) {
          return "complete";
        // start date is in the future
        } else if (dayjs().isBefore(semester.start_date)) {
          return "planned";
        // start date is in the past and end date is in the future
        } else if (dayjs().isBefore(semester.end_date)) {
          return "active";
        // start date is in the past and end date is in the past
        } else {
          return "complete";
        }
      })(),
    })),
  }
}

export function mockGetDashboardData(): DashboardData {
  const userData = mockGetUserData();
  
  let dashboardData: DashboardData = {
    upcomingAssignments: [],
    activeCourses: [],
    numCompletedCourses: 0,
    numCompletedCredits: 0,
    numSemesterCredits: 0,
    numPlannedCourses: 0,
    plannedSemesterIds: [],
  };

  dashboardData = userData.courses.reduce((acc, courseEntry) => {
    const courseStatus = userData.semesters.find((semester) => semester.id === courseEntry.connected_semester_id)?.status;

    switch (courseStatus) {
      // count completed courses and credits
      case "complete": {
        acc.numCompletedCredits += courseEntry.credit_hours;
        acc.numCompletedCourses += 1;
        break;
      }

      // Count active courses, credits, and upcoming assignments
      case "active": {
        acc.numSemesterCredits += courseEntry.credit_hours;
        acc.activeCourses.push(courseEntry);
        courseEntry.assignments.reduce((acc, assignment) => {
          if (
            assignment.due_date &&
            !dayjs().isBefore(assignment.due_date, "month")
          ) {
            acc.upcomingAssignments.push({
              ...assignment,
              courseTitle: courseEntry.title,
            });
          }
          return acc;
        }, acc);
        break;
      }

      // Count planned courses
      case "planned": {
        if (courseEntry.connected_semester_id) {
          acc.numPlannedCourses += 1;
          
          if (!acc.plannedSemesterIds.includes(courseEntry.connected_semester_id)) {
            acc.plannedSemesterIds.push(courseEntry.connected_semester_id);
          }
        }
        break;
      }
    }
    return acc;
  }, dashboardData);

  return dashboardData;
}

const MOCK_DATA: MockData = {
  user: {
    "id": "ad014f79-02ea-4385-bf09-3ff4a639a6bf",
    "email": "wm@uga.edu",
    "avatar_url": "https://avatars.githubusercontent.com/u/14142910?v=4",
    "vanity_name": "william",
    "semesters": [
      {
        "id": "4a52b3de-a899-41a0-8806-b03bbbf1739e",
        "start_date": "2022-01-06T00:00:00",
        "end_date": "2022-04-26T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "d2959c8e-ec13-4292-a23a-dc7f2cfbadfb",
          "fa9d53e9-cb9e-4686-915d-b31d4f015d97",
          "219a494a-5c3a-40c8-a4cd-8e7a132defac",
          "a9fd959d-7089-49c3-9176-af13eb59b779",
          "931c5906-bb87-40b1-ae76-760218db6b5f",
          "37973c89-ac8e-4e3f-ab22-a744de184cb8"
        ]
      },
      {
        "id": "cc15ba2a-db88-47c7-9006-0d8eac2fcef5",
        "start_date": "2022-06-02T00:00:00",
        "end_date": "2022-07-17T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "a20b7107-0b05-4f5c-ae55-a0fd2f082997",
          "14f14035-fb28-49bb-b535-b89a0d8ef28f"
        ]
      },
      {
        "id": "0b8f7943-ff5c-45c1-be1a-bd5f80206ddd",
        "start_date": "2022-08-05T00:00:00",
        "end_date": "2022-11-26T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "48bc0fc2-7348-4bca-9f71-9eb48915c63b",
          "72449912-ee27-46ec-9c62-4ab76377398a",
          "4805754b-9877-430f-8507-b4b8fb2a87a4",
          "1468af79-fe54-4eba-94c0-a45ce0dcd8b8",
          "7ada734e-b3f8-4ba4-a5f8-346df7d22a20",
          "384a828d-3a17-4bca-97c9-b2324c8189ec"
        ]
      },
      {
        "id": "c56d16a5-e015-4ecd-a4ac-85e1f75aa374",
        "start_date": "2023-01-06T00:00:00",
        "end_date": "2023-04-27T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "80c63bc9-471a-4507-b93d-db46c882fa8d",
          "03380466-bd9c-4ec9-ba4e-9d3f08c47f12",
          "d0481380-86b9-4e62-a75d-232198b5ff8e",
          "aec426f6-a5be-4a14-b108-74e32ab4161a",
          "cff4df2d-fc3b-4886-b8e9-b777e249dc00",
          "27d0d6ac-cd5c-40c6-9674-7d5a85962694"
        ]
      },
      {
        "id": "c302ef63-8d03-4440-91fa-8cd3581b07b9",
        "start_date": "2023-06-04T00:00:00",
        "end_date": "2023-07-22T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "467b90e5-dffe-410d-95b0-7cc01f66b1e5",
          "335d2e15-29fd-450d-b50b-2092a234630c"
        ]
      },
      {
        "id": "e7192159-1960-4961-b273-436bf9c561bb",
        "start_date": "2023-08-07T00:00:00",
        "end_date": "2023-11-21T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "c4432157-5224-4565-87bd-55109f319422",
          "e82ec8ad-2058-4568-aee0-2a5d5db1bd57",
          "19dbdf4e-ef0a-4f9c-85c5-184bf167330a",
          "f962d2af-0186-4ff2-8cdd-c470cc07060f"
        ]
      },
      {
        "id": "5719578e-b880-45af-820f-2e8f96542ad4",
        "start_date": "2024-01-07T00:00:00",
        "end_date": "2024-04-26T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "3890473e-e391-4143-859a-40e2a4e40926",
          "c1c0f4fa-09ed-457a-945e-2fa1b29bd4ad",
          "c38d155a-e9a6-403f-b94e-99e6d62be908",
          "0c3f4b48-6c11-4ed1-ad6f-008429fd65d6",
          "f2050ba6-8761-4fa6-bd8b-e1ba172c4b4e",
          "87a94b24-79e7-4790-964b-02a47596d9e1"
        ]
      },
      {
        "id": "1659b774-1766-4aa0-b8a9-f33f34d318bd",
        "start_date": "2024-06-02T00:00:00",
        "end_date": "2024-07-18T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "a4a298ef-3928-4bc2-9257-da3a33f32fd3",
          "88626314-4e48-4e43-b67f-a9120f400410"
        ]
      },
      {
        "id": "e0b8c789-0a66-46c7-9c70-6098ad0d2d77",
        "start_date": "2024-08-03T00:00:00",
        "end_date": "2024-11-26T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "25f49994-fb98-4046-80b2-e46aba9e5059",
          "ea57acbb-e9f2-4916-9d2c-801a920dc5f7",
          "fba7eefa-f93f-4944-9b4b-a32863c0a039",
          "04f8309e-af0c-4362-b4fc-4b744b58659b",
          "19c28eff-2110-4e61-b52f-1479c6b0be1b"
        ]
      },
      {
        "id": "82edb3d0-254c-4659-af93-1397f657b785",
        "start_date": "2025-01-08T00:00:00",
        "end_date": "2025-04-29T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "3f93c963-12c1-4ec4-a30f-f2e3da6425ca",
          "5fcee316-b9c2-4fa6-8bac-c6d05e40819d",
          "7b7fb4b5-0047-46c6-88d2-de7ddd95ec42",
          "713d555e-e1ec-4a4b-9dda-b19abda781a0",
          "4e906941-d187-4bb4-a988-97679f193a43",
          "617db69a-f6ed-4ab4-8bd1-d9251f4dee99"
        ]
      },
      {
        "id": "43817a57-78bc-46e1-966b-a1b71c30859d",
        "start_date": "2025-06-05T00:00:00",
        "end_date": "2025-07-22T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "8449eedb-ded8-4128-a0d3-81d769b43711"
        ]
      },
      {
        "id": "1566173d-0036-4949-b81c-32e99e13819c",
        "start_date": "2025-08-03T00:00:00",
        "end_date": "2025-11-23T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "12cd5cd7-60a7-43d1-8df2-2d34039096c2",
          "11833ee4-8450-46aa-9a90-ceb71379e315",
          "060e5ade-d728-40f1-833d-4a81c2110ef4",
          "22a4a4a3-bb79-4720-a8f9-0fef8121c8d2",
          "6ff0012e-1a1a-438b-afa1-fdfb55c9e7b7",
          "5f68ef4a-b420-43f1-8107-a97d2e6ad969"
        ]
      },
      {
        "id": "31b475c0-cedd-4a42-9337-f7d7f8bf37cc",
        "start_date": "2026-01-06T00:00:00",
        "end_date": "2026-04-25T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "e63610da-7a2a-406f-96f7-c2ebed7226cb",
          "e7df7672-5026-4eb1-bea5-f2769f505494",
          "5cefb496-5611-4fc1-ad7c-820665330096",
          "ce9b6fa1-1252-400b-b440-af34e71a7e5f"
        ]
      },
      {
        "id": "56f07187-7491-4e57-9af8-f92381c730ee",
        "start_date": "2026-06-05T00:00:00",
        "end_date": "2026-07-24T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "2d08645c-8afb-4838-8879-129e4f4c33f1"
        ]
      },
      {
        "id": "4c866a6d-5de6-4710-9583-f2d761e0eb47",
        "start_date": "2026-08-06T00:00:00",
        "end_date": "2026-11-23T00:00:00",
        "custom_name": null,
        "connected_course_ids": [
          "e5ec7dbc-3819-43c0-8ee7-54bd5ec0a83f",
          "fc4b4257-cb07-407b-b12a-0cb543a2c251",
          "c98cb907-3d1e-4ace-bb6c-4260ec2eec1f",
          "2a007c72-480c-4db5-a7a8-f653cc4a5fd2",
          "bff1365e-c51b-42f3-9e7c-a7d1016c0bd8",
          "337aa21f-0182-45f6-a654-8068fbf7358d"
        ]
      }
    ],
    "courses": [
      {
        "id": "d2959c8e-ec13-4292-a23a-dc7f2cfbadfb",
        "title": "Elementary Latin I",
        "credit_hours": 4,
        "short_id": "LATN 1001",
        "description": "The Latin language; pronunciation, fundamentals of grammar, reading, and translation.",
        "assignments": [
          {
            "id": "74dd2595-7b98-46d1-92a1-947fa7dcbaeb",
            "title": "Lab",
            "due_date": "2022-04-23T00:00:00",
            "completed": true
          },
          {
            "id": "09db55e7-94f2-42d3-868e-29c12d7f69cc",
            "title": "Essay",
            "due_date": "2022-04-22T00:00:00",
            "completed": false
          },
          {
            "id": "7a0d181a-be07-41aa-b2a2-97fa75166ef9",
            "title": "Final",
            "due_date": "2022-02-03T00:00:00",
            "completed": true
          },
          {
            "id": "3da04c2b-38f2-4406-9a9e-9551222ebabc",
            "title": "Reading",
            "due_date": "2022-02-16T00:00:00",
            "completed": true
          },
          {
            "id": "fc1214bf-167d-49dc-bd65-ad961a6cf273",
            "title": "Test",
            "due_date": "2022-03-10T00:00:00",
            "completed": true
          },
          {
            "id": "f8c238a9-b172-40c7-a590-54be843f554a",
            "title": "Reading",
            "due_date": "2022-02-16T00:00:00",
            "completed": false
          },
          {
            "id": "efc62735-3f45-4f9f-973c-369622ae465b",
            "title": "Paper",
            "due_date": "2022-04-17T00:00:00",
            "completed": true
          },
          {
            "id": "8c2a97f7-dfaa-4546-bd44-8133cb37b8fd",
            "title": "Discussion",
            "due_date": "2022-03-27T00:00:00",
            "completed": true
          },
          {
            "id": "28c84b4c-01a4-42cd-a45f-dbe616e74578",
            "title": "Lab",
            "due_date": "2022-04-04T00:00:00",
            "completed": true
          },
          {
            "id": "bdab8b6b-f9b5-4467-b096-65be021d6f2e",
            "title": "Homework",
            "due_date": "2022-01-15T00:00:00",
            "completed": true
          },
          {
            "id": "457f27ec-5a8f-45d6-999f-c3b9f9abcdd8",
            "title": "Presentation",
            "due_date": "2022-03-15T00:00:00",
            "completed": true
          },
          {
            "id": "731c0e38-e5b1-4cbe-93b0-af04f4e7e9ff",
            "title": "Final",
            "due_date": "2022-03-28T00:00:00",
            "completed": true
          },
          {
            "id": "52096bf2-0caf-43b4-a8d2-c0b4d54afb39",
            "title": "Lab",
            "due_date": "2022-01-20T00:00:00",
            "completed": true
          },
          {
            "id": "aa65509b-ab18-48d6-b5a7-9a5bac2b7070",
            "title": "Test",
            "due_date": "2022-01-11T00:00:00",
            "completed": true
          },
          {
            "id": "e7ece072-55a2-41f0-a9b5-29fe203eb05f",
            "title": "Test",
            "due_date": "2022-02-19T00:00:00",
            "completed": false
          },
          {
            "id": "dbcf0a72-790b-40c3-8980-b3d482444a1f",
            "title": "Homework",
            "due_date": "2022-02-13T00:00:00",
            "completed": true
          },
          {
            "id": "8adfac1e-e7c3-44b8-8ce0-609234fc049b",
            "title": "Discussion",
            "due_date": "2022-04-18T00:00:00",
            "completed": false
          },
          {
            "id": "a5213b50-a6a2-4091-bb59-7ec2fb0b5fd7",
            "title": "Essay",
            "due_date": "2022-02-22T00:00:00",
            "completed": false
          },
          {
            "id": "f32a8360-201c-43c7-887e-e81a429da461",
            "title": "Reading",
            "due_date": "2022-02-16T00:00:00",
            "completed": true
          },
          {
            "id": "94f18299-93be-4e75-84fe-78ae5b47c611",
            "title": "Lab",
            "due_date": "2022-03-26T00:00:00",
            "completed": false
          },
          {
            "id": "031e1f1c-f453-40b6-b9d8-51c9d53d5f18",
            "title": "Discussion",
            "due_date": "2022-02-07T00:00:00",
            "completed": true
          },
          {
            "id": "e24a6b66-a74f-4247-9743-f7f7b4f74ebc",
            "title": "Final",
            "due_date": "2022-02-26T00:00:00",
            "completed": true
          },
          {
            "id": "aa175ba7-b3ce-48e2-9910-ced6c6c354ee",
            "title": "Quiz",
            "due_date": "2022-01-13T00:00:00",
            "completed": false
          },
          {
            "id": "eff81195-369c-4f85-b7bb-0c2ca6284834",
            "title": "Quiz",
            "due_date": "2022-04-19T00:00:00",
            "completed": true
          },
          {
            "id": "54668ba5-10c5-4cc9-be2f-850a1c5d2c2d",
            "title": "Project",
            "due_date": "2022-02-17T00:00:00",
            "completed": true
          },
          {
            "id": "6c701a9a-d0d7-41e8-a75d-02d0e0b69482",
            "title": "Reading",
            "due_date": "2022-01-13T00:00:00",
            "completed": true
          },
          {
            "id": "b1013bfc-373a-4229-8d32-0e534f73a117",
            "title": "Homework",
            "due_date": "2022-02-14T00:00:00",
            "completed": false
          },
          {
            "id": "2f6ebf36-e758-4fad-9a55-dec1dd342e87",
            "title": "Paper",
            "due_date": "2022-01-13T00:00:00",
            "completed": false
          },
          {
            "id": "933ca9a4-ac76-4dd9-885f-da6b438cb6a8",
            "title": "Discussion",
            "due_date": "2022-03-09T00:00:00",
            "completed": false
          },
          {
            "id": "f8c4fa7c-cb6e-4c6d-bff2-ccff374da09c",
            "title": "Essay",
            "due_date": "2022-04-07T00:00:00",
            "completed": false
          },
          {
            "id": "ef771de8-12c4-4886-8791-aea1c50b3922",
            "title": "Reading",
            "due_date": "2022-03-03T00:00:00",
            "completed": false
          },
          {
            "id": "ee63a156-8b2e-4bdc-bda3-3aeb1ef41602",
            "title": "Test",
            "due_date": "2022-02-17T00:00:00",
            "completed": true
          },
          {
            "id": "9a8a4cc5-5143-4b4e-bc23-06f1a7c5da83",
            "title": "Discussion",
            "due_date": "2022-01-27T00:00:00",
            "completed": true
          },
          {
            "id": "4feeca70-1357-4aeb-87fc-535e51475d23",
            "title": "Quiz",
            "due_date": "2022-03-27T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "4a52b3de-a899-41a0-8806-b03bbbf1739e",
        "grade": 95.6
      },
      {
        "id": "fa9d53e9-cb9e-4686-915d-b31d4f015d97",
        "title": "Elementary Latin II",
        "credit_hours": 4,
        "short_id": "LATN 1002",
        "description": "Completion of study of Latin grammar and syntax begun in Elementary Latin I, with continuation of reading and translation.",
        "assignments": [
          {
            "id": "eb2ea914-3980-4548-b935-09f80434f387",
            "title": "Test",
            "due_date": "2022-02-11T00:00:00",
            "completed": true
          },
          {
            "id": "8b055e67-76f9-4e31-88ff-198913246087",
            "title": "Project",
            "due_date": "2022-03-03T00:00:00",
            "completed": false
          },
          {
            "id": "77dce7f1-197e-4583-a930-698d28b4eca0",
            "title": "Quiz",
            "due_date": "2022-01-09T00:00:00",
            "completed": false
          },
          {
            "id": "664e3177-5182-4f3a-a036-399f3a5848b8",
            "title": "Exam",
            "due_date": "2022-02-23T00:00:00",
            "completed": true
          },
          {
            "id": "af2fe25e-3ab1-46e3-a69d-18c2f2bf48dd",
            "title": "Quiz",
            "due_date": "2022-02-22T00:00:00",
            "completed": false
          },
          {
            "id": "7aaac895-9a2e-479b-b065-57cfde9e069e",
            "title": "Project",
            "due_date": "2022-01-26T00:00:00",
            "completed": false
          },
          {
            "id": "db8d0f8e-0845-431a-8230-47338f666602",
            "title": "Lab",
            "due_date": "2022-01-31T00:00:00",
            "completed": false
          },
          {
            "id": "2a33d84e-e470-4d62-8a6b-0999d678bda2",
            "title": "Final",
            "due_date": "2022-01-16T00:00:00",
            "completed": true
          },
          {
            "id": "cbe7dd27-1707-4513-9cb6-f526b61d9a7d",
            "title": "Test",
            "due_date": "2022-04-25T00:00:00",
            "completed": true
          },
          {
            "id": "965b654e-5865-4778-ab1f-e0f83d509535",
            "title": "Discussion",
            "due_date": "2022-03-27T00:00:00",
            "completed": true
          },
          {
            "id": "505a622d-8ec5-4be2-beb3-ae3c54adec3b",
            "title": "Test",
            "due_date": "2022-03-15T00:00:00",
            "completed": true
          },
          {
            "id": "a248bee3-befd-413b-8f69-213fa6d08f03",
            "title": "Test",
            "due_date": "2022-04-05T00:00:00",
            "completed": true
          },
          {
            "id": "9af5509a-066d-4e44-a5da-e6e81b84132c",
            "title": "Test",
            "due_date": "2022-03-30T00:00:00",
            "completed": false
          },
          {
            "id": "311f1c20-8b6b-445f-b213-5b80bc77bd1f",
            "title": "Final",
            "due_date": "2022-02-27T00:00:00",
            "completed": false
          },
          {
            "id": "bd6331d3-3679-4b94-a92c-6461775a77bf",
            "title": "Project",
            "due_date": "2022-03-04T00:00:00",
            "completed": true
          },
          {
            "id": "b1fcf9cf-cad5-43fb-b5db-45598ef662d7",
            "title": "Final",
            "due_date": "2022-01-25T00:00:00",
            "completed": false
          },
          {
            "id": "d7d125f8-86c7-420f-963a-88b429e1a003",
            "title": "Discussion",
            "due_date": "2022-03-02T00:00:00",
            "completed": true
          },
          {
            "id": "82bbf49a-fcc5-4a6a-9f57-8b01e81485cd",
            "title": "Reading",
            "due_date": "2022-03-09T00:00:00",
            "completed": true
          },
          {
            "id": "63fac329-8c19-4943-86a3-795325a8a32a",
            "title": "Homework",
            "due_date": "2022-03-11T00:00:00",
            "completed": true
          },
          {
            "id": "0990f41a-ac49-4ef2-9b26-e6d2fb2b9eda",
            "title": "Homework",
            "due_date": "2022-01-13T00:00:00",
            "completed": false
          },
          {
            "id": "d52c07e7-6c76-4bd3-b83b-ca9a5c5cb3cf",
            "title": "Discussion",
            "due_date": "2022-03-11T00:00:00",
            "completed": false
          },
          {
            "id": "a6a88dfe-0337-4880-b75b-943f89faa50b",
            "title": "Essay",
            "due_date": "2022-02-13T00:00:00",
            "completed": false
          },
          {
            "id": "4ee82f2c-9f77-46b5-a6fc-a03826b76a74",
            "title": "Quiz",
            "due_date": "2022-03-04T00:00:00",
            "completed": false
          },
          {
            "id": "b4690055-f557-475e-9fb6-fe9dcca32281",
            "title": "Project",
            "due_date": "2022-02-19T00:00:00",
            "completed": true
          },
          {
            "id": "99935cc7-383b-4419-95b8-8ce57ecdb056",
            "title": "Essay",
            "due_date": "2022-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "83342e58-3913-41d7-8581-2463edbb30de",
            "title": "Discussion",
            "due_date": "2022-03-15T00:00:00",
            "completed": false
          },
          {
            "id": "bd5a381b-eb45-4a61-ae28-0bd4f0311c0d",
            "title": "Final",
            "due_date": "2022-02-01T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "4a52b3de-a899-41a0-8806-b03bbbf1739e",
        "grade": 98.15
      },
      {
        "id": "219a494a-5c3a-40c8-a4cd-8e7a132defac",
        "title": "Mathematics of Decision Making",
        "credit_hours": 3,
        "short_id": "MATH 1060",
        "description": "Applications of modern mathematics to management and decision making including the solution of optimization problems using network theory, methods for optimal scheduling, voting methods, game theory, and related strategies. Applications include planning of postal delivery routes, placement of cable television lines, United States Congressional apportionment, and dispute resolution.",
        "assignments": [
          {
            "id": "ad34f581-8c76-4ca2-8c4c-8e08625fa4f3",
            "title": "Exam",
            "due_date": "2022-03-18T00:00:00",
            "completed": false
          },
          {
            "id": "f6ce4c9f-2a68-40d8-80fe-d552046d6f67",
            "title": "Reading",
            "due_date": "2022-02-13T00:00:00",
            "completed": true
          },
          {
            "id": "d321dd1d-ff6a-45ac-aa79-299bcc67762d",
            "title": "Paper",
            "due_date": "2022-03-11T00:00:00",
            "completed": false
          },
          {
            "id": "f8619ffb-3d7c-4af7-b458-6644d8446510",
            "title": "Paper",
            "due_date": "2022-02-28T00:00:00",
            "completed": true
          },
          {
            "id": "18cb303a-c647-4598-8bee-34766174f1c8",
            "title": "Discussion",
            "due_date": "2022-01-21T00:00:00",
            "completed": false
          },
          {
            "id": "eeedc804-75da-4aa3-a1df-6e577c9ce454",
            "title": "Lab",
            "due_date": "2022-02-07T00:00:00",
            "completed": true
          },
          {
            "id": "212fc322-d29b-4a97-879b-974db372544a",
            "title": "Homework",
            "due_date": "2022-03-16T00:00:00",
            "completed": true
          },
          {
            "id": "3da48d50-7b65-48f8-83c2-c8f1457cd9ea",
            "title": "Presentation",
            "due_date": "2022-03-19T00:00:00",
            "completed": false
          },
          {
            "id": "498cb23b-96e9-4cbd-a79e-64877f13228b",
            "title": "Quiz",
            "due_date": "2022-01-08T00:00:00",
            "completed": true
          },
          {
            "id": "51391525-6337-4607-b499-df30c74c038c",
            "title": "Paper",
            "due_date": "2022-02-25T00:00:00",
            "completed": true
          },
          {
            "id": "b52f7daa-5070-4da9-8f1e-f34ead19c0f0",
            "title": "Lab",
            "due_date": "2022-01-24T00:00:00",
            "completed": true
          },
          {
            "id": "54f0dd99-4753-4e20-8105-61ad6ab0ae54",
            "title": "Final",
            "due_date": "2022-04-10T00:00:00",
            "completed": false
          },
          {
            "id": "5807eb92-ea2e-4b6a-8b48-eb2aad85bb9f",
            "title": "Test",
            "due_date": "2022-01-30T00:00:00",
            "completed": false
          },
          {
            "id": "111d50cd-6a80-483a-acc3-71764fb44ee3",
            "title": "Exam",
            "due_date": "2022-02-22T00:00:00",
            "completed": true
          },
          {
            "id": "b6544c7d-39d5-4bae-81a4-6815051a6527",
            "title": "Reading",
            "due_date": "2022-03-31T00:00:00",
            "completed": true
          },
          {
            "id": "154aca5f-b21f-4f82-80ec-11f93881c3df",
            "title": "Quiz",
            "due_date": "2022-04-05T00:00:00",
            "completed": true
          },
          {
            "id": "47552297-28a7-443f-845d-f2f7a7c47919",
            "title": "Project",
            "due_date": "2022-02-27T00:00:00",
            "completed": true
          },
          {
            "id": "36155791-21d9-4b27-9e78-c7bb182d57ca",
            "title": "Discussion",
            "due_date": "2022-03-27T00:00:00",
            "completed": true
          },
          {
            "id": "56f8c0d0-7697-40e8-b84d-fe62e9167953",
            "title": "Test",
            "due_date": "2022-01-17T00:00:00",
            "completed": false
          },
          {
            "id": "217339ac-ab96-4bfb-8b80-b9a3110fd731",
            "title": "Lab",
            "due_date": "2022-02-07T00:00:00",
            "completed": false
          },
          {
            "id": "09a81bd5-e17c-4382-a447-f339fc0aeabb",
            "title": "Essay",
            "due_date": "2022-03-10T00:00:00",
            "completed": false
          },
          {
            "id": "88bf9d9f-220d-4fe0-9524-cb37ae3e6ac2",
            "title": "Test",
            "due_date": "2022-01-20T00:00:00",
            "completed": true
          },
          {
            "id": "96ae251e-14ed-445b-9803-39918ae6152a",
            "title": "Paper",
            "due_date": "2022-03-12T00:00:00",
            "completed": true
          },
          {
            "id": "cb0bc985-a396-4130-a6e9-29ec25cc3ce9",
            "title": "Test",
            "due_date": "2022-01-30T00:00:00",
            "completed": false
          },
          {
            "id": "ac2c1fc3-f4d9-4e38-91c9-ca593b9c74e8",
            "title": "Final",
            "due_date": "2022-02-16T00:00:00",
            "completed": true
          },
          {
            "id": "64adbb3b-7fe4-48de-a3f1-6adef2b53a08",
            "title": "Test",
            "due_date": "2022-02-08T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "4a52b3de-a899-41a0-8806-b03bbbf1739e",
        "grade": 93.25
      },
      {
        "id": "a9fd959d-7089-49c3-9176-af13eb59b779",
        "title": "History of African American Mathematicians",
        "credit_hours": 3,
        "short_id": "MATH 1070",
        "description": "A survey of the historical development of mathematics by African American mathematicians. The emphasis will be on mathematical concepts, problem-solving, and the challenges faced by African American academics to become mathematicians. The course will focus on three groups of African American mathematicians: pioneers, women, and mathematicians working today.",
        "assignments": [
          {
            "id": "f89f0212-787e-490e-b3e0-37e34810d35a",
            "title": "Homework",
            "due_date": "2022-02-19T00:00:00",
            "completed": false
          },
          {
            "id": "ce8c12cb-dad5-4bf1-bd56-83fdbbb22dba",
            "title": "Lab",
            "due_date": "2022-02-24T00:00:00",
            "completed": true
          },
          {
            "id": "17c13fc6-e32d-47f2-86e6-577764cd8d67",
            "title": "Presentation",
            "due_date": "2022-01-10T00:00:00",
            "completed": true
          },
          {
            "id": "87f32289-ee27-489e-956b-8c9eea41a95f",
            "title": "Discussion",
            "due_date": "2022-01-27T00:00:00",
            "completed": true
          },
          {
            "id": "13b49435-662e-4d9c-b834-c95e27b1f34d",
            "title": "Exam",
            "due_date": "2022-04-21T00:00:00",
            "completed": true
          },
          {
            "id": "2e32247f-4713-4456-9e73-b40750f1bb52",
            "title": "Lab",
            "due_date": "2022-03-27T00:00:00",
            "completed": true
          },
          {
            "id": "4c75ce0a-f2b9-40f1-a458-137f203a53ad",
            "title": "Project",
            "due_date": "2022-04-21T00:00:00",
            "completed": true
          },
          {
            "id": "db39b1ee-e949-4073-ba34-2e05ccc55ac7",
            "title": "Reading",
            "due_date": "2022-03-28T00:00:00",
            "completed": true
          },
          {
            "id": "91a61b31-9ee3-4cae-824c-1916749e99a2",
            "title": "Lab",
            "due_date": "2022-01-18T00:00:00",
            "completed": true
          },
          {
            "id": "45c22902-0dc7-47fc-a1e3-5d26233642d8",
            "title": "Homework",
            "due_date": "2022-04-07T00:00:00",
            "completed": false
          },
          {
            "id": "31bde35c-2e6d-4e5c-a0ff-7f0d5e6c1088",
            "title": "Test",
            "due_date": "2022-02-16T00:00:00",
            "completed": true
          },
          {
            "id": "738a6b15-a667-410c-8a66-42b8621411f7",
            "title": "Quiz",
            "due_date": "2022-03-28T00:00:00",
            "completed": true
          },
          {
            "id": "d75dce7f-24ea-4cff-a096-469c750e9ba6",
            "title": "Quiz",
            "due_date": "2022-04-14T00:00:00",
            "completed": true
          },
          {
            "id": "a224ce48-625c-4de8-80d3-cad1529fca58",
            "title": "Lab",
            "due_date": "2022-03-22T00:00:00",
            "completed": true
          },
          {
            "id": "cb4c6b82-4c01-4971-bc73-296c733f96f4",
            "title": "Final",
            "due_date": "2022-04-14T00:00:00",
            "completed": false
          },
          {
            "id": "3e684a5d-f084-4c34-a725-a8ebd5773e2a",
            "title": "Essay",
            "due_date": "2022-03-25T00:00:00",
            "completed": true
          },
          {
            "id": "34d75bcb-63b0-436a-a464-7cf3e7c9b550",
            "title": "Quiz",
            "due_date": "2022-02-13T00:00:00",
            "completed": false
          },
          {
            "id": "b759ad28-73ac-4ea8-9573-7d802cfbcd20",
            "title": "Essay",
            "due_date": "2022-01-13T00:00:00",
            "completed": false
          },
          {
            "id": "ce0fd71a-de5a-4f12-91d6-3569b0f84b27",
            "title": "Lab",
            "due_date": "2022-03-28T00:00:00",
            "completed": true
          },
          {
            "id": "091f4bf2-f621-4c39-82ef-5ec00f66bcca",
            "title": "Project",
            "due_date": "2022-02-08T00:00:00",
            "completed": true
          },
          {
            "id": "d42efcbe-b325-44e7-813c-f979baf3d03c",
            "title": "Final",
            "due_date": "2022-01-12T00:00:00",
            "completed": true
          },
          {
            "id": "23b68753-a92f-4950-a476-da3998239ab5",
            "title": "Essay",
            "due_date": "2022-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "f4e8d73e-17cc-4276-813a-af019035c519",
            "title": "Project",
            "due_date": "2022-02-22T00:00:00",
            "completed": false
          },
          {
            "id": "5c018284-2d06-43c0-be70-364afabf31cd",
            "title": "Final",
            "due_date": "2022-03-18T00:00:00",
            "completed": true
          },
          {
            "id": "fa1d6a51-1dd6-4c2b-9ecc-409e1bda56d3",
            "title": "Reading",
            "due_date": "2022-03-27T00:00:00",
            "completed": true
          },
          {
            "id": "c5f03175-bb1f-4e61-984d-3336ba420986",
            "title": "Final",
            "due_date": "2022-04-25T00:00:00",
            "completed": true
          },
          {
            "id": "e5dbb397-eccc-47d7-925e-f2a755004012",
            "title": "Paper",
            "due_date": "2022-02-28T00:00:00",
            "completed": false
          },
          {
            "id": "2f80cbed-b1bd-4ce0-bfa3-9c59947fdeee",
            "title": "Discussion",
            "due_date": "2022-04-09T00:00:00",
            "completed": false
          },
          {
            "id": "011ec00a-2556-4a82-827e-a32899e88d8d",
            "title": "Paper",
            "due_date": "2022-03-03T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "4a52b3de-a899-41a0-8806-b03bbbf1739e",
        "grade": 94.07
      },
      {
        "id": "931c5906-bb87-40b1-ae76-760218db6b5f",
        "title": "Introduction to Mathematical Modeling",
        "credit_hours": 3,
        "short_id": "MATH 1101",
        "description": "Mathematical modeling using graphical, numerical, symbolic, and verbal techniques to describe and explore real-world data and phenomena. The investigation and analysis of applied problems and questions, and of effective communication of quantitative concepts and results.",
        "assignments": [
          {
            "id": "50610146-f330-40f0-a26f-0512f815fd61",
            "title": "Essay",
            "due_date": "2022-02-10T00:00:00",
            "completed": true
          },
          {
            "id": "0f4f477a-ab6a-40a3-81e9-d63eb33facc7",
            "title": "Homework",
            "due_date": "2022-02-01T00:00:00",
            "completed": true
          },
          {
            "id": "d338f6d3-493f-42cf-baf4-bd5ee2dcce3a",
            "title": "Homework",
            "due_date": "2022-04-09T00:00:00",
            "completed": false
          },
          {
            "id": "5c25a5c1-183c-491b-838f-2b3e7c6356f9",
            "title": "Exam",
            "due_date": "2022-03-16T00:00:00",
            "completed": false
          },
          {
            "id": "a8a22aec-0f20-48f9-b588-58769a9106d8",
            "title": "Lab",
            "due_date": "2022-03-26T00:00:00",
            "completed": false
          },
          {
            "id": "596d17c8-e5bb-4be4-b3b3-519aa82e170d",
            "title": "Exam",
            "due_date": "2022-03-27T00:00:00",
            "completed": true
          },
          {
            "id": "09c54cce-4eca-47dd-89e8-3c4e09ffa122",
            "title": "Final",
            "due_date": "2022-02-22T00:00:00",
            "completed": false
          },
          {
            "id": "6dda4af1-518f-4eb3-8368-b1af282514da",
            "title": "Lab",
            "due_date": "2022-01-12T00:00:00",
            "completed": true
          },
          {
            "id": "245be369-9f99-4542-ab1e-a38c93eb0fb3",
            "title": "Paper",
            "due_date": "2022-03-22T00:00:00",
            "completed": true
          },
          {
            "id": "43946eaf-8c9b-4427-898d-bbc6c8abde29",
            "title": "Lab",
            "due_date": "2022-01-24T00:00:00",
            "completed": true
          },
          {
            "id": "1d3d2c3a-58de-4d81-949a-5a2c3d149850",
            "title": "Essay",
            "due_date": "2022-03-19T00:00:00",
            "completed": true
          },
          {
            "id": "4985074f-ea88-4190-9c4e-98083c8e0df9",
            "title": "Discussion",
            "due_date": "2022-01-12T00:00:00",
            "completed": true
          },
          {
            "id": "f575a2f5-8747-4a44-8316-2bbd972b1da5",
            "title": "Project",
            "due_date": "2022-04-20T00:00:00",
            "completed": false
          },
          {
            "id": "b5fc8f90-3df3-4d12-803c-585af5d7eaf3",
            "title": "Test",
            "due_date": "2022-02-26T00:00:00",
            "completed": true
          },
          {
            "id": "76ab7330-9d59-43cb-bbd2-88a62d659829",
            "title": "Homework",
            "due_date": "2022-03-14T00:00:00",
            "completed": true
          },
          {
            "id": "d5437004-db3d-4e73-953e-6b21d2e2ec70",
            "title": "Presentation",
            "due_date": "2022-03-03T00:00:00",
            "completed": true
          },
          {
            "id": "1e95c852-a2f8-4de7-90e9-08db390d65b4",
            "title": "Lab",
            "due_date": "2022-02-26T00:00:00",
            "completed": false
          },
          {
            "id": "b829a9b9-2679-42bb-a892-5da104b1c4cc",
            "title": "Final",
            "due_date": "2022-03-13T00:00:00",
            "completed": true
          },
          {
            "id": "d018b2d7-7ee2-4e03-b816-d28a36a7c6e8",
            "title": "Exam",
            "due_date": "2022-01-21T00:00:00",
            "completed": false
          },
          {
            "id": "0ea5286d-7547-46f7-98cb-e43a9df53904",
            "title": "Essay",
            "due_date": "2022-03-18T00:00:00",
            "completed": false
          },
          {
            "id": "19574da9-ddde-42c6-98c9-7198201e7b8a",
            "title": "Final",
            "due_date": "2022-04-04T00:00:00",
            "completed": true
          },
          {
            "id": "87560c8b-7c8e-4a82-95f0-1cc9e526e32a",
            "title": "Lab",
            "due_date": "2022-04-14T00:00:00",
            "completed": false
          },
          {
            "id": "7ef13100-e81e-4c86-8c18-af852e2503b4",
            "title": "Homework",
            "due_date": "2022-03-26T00:00:00",
            "completed": true
          },
          {
            "id": "fec25d60-b4cf-4958-8e34-1658cf6c9ad6",
            "title": "Project",
            "due_date": "2022-04-13T00:00:00",
            "completed": false
          },
          {
            "id": "a0352993-4259-4973-aff1-785ec12730e6",
            "title": "Final",
            "due_date": "2022-04-09T00:00:00",
            "completed": true
          },
          {
            "id": "6c2287d1-44a9-464c-82df-eec241f648e7",
            "title": "Presentation",
            "due_date": "2022-02-27T00:00:00",
            "completed": false
          },
          {
            "id": "781ca39b-a8bc-4ce3-aae6-91cf4b60647a",
            "title": "Final",
            "due_date": "2022-01-08T00:00:00",
            "completed": true
          },
          {
            "id": "19d9f678-983b-4a41-838c-29eed6052e3a",
            "title": "Essay",
            "due_date": "2022-03-05T00:00:00",
            "completed": true
          },
          {
            "id": "9c5e2cb7-0656-434b-9aaf-f3c6611165a5",
            "title": "Presentation",
            "due_date": "2022-04-17T00:00:00",
            "completed": true
          },
          {
            "id": "b9fc02e2-48cc-48fb-8569-e2ba4a4ba738",
            "title": "Exam",
            "due_date": "2022-04-15T00:00:00",
            "completed": false
          },
          {
            "id": "9f547847-fab8-4e60-8651-e25cb440cec8",
            "title": "Lab",
            "due_date": "2022-01-21T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "4a52b3de-a899-41a0-8806-b03bbbf1739e",
        "grade": 97.69
      },
      {
        "id": "37973c89-ac8e-4e3f-ab22-a744de184cb8",
        "title": "Precalculus",
        "credit_hours": 3,
        "short_id": "MATH 1113",
        "description": "Preparation for calculus, including an intensive study of algebraic, exponential, logarithmic, and trigonometric functions and their graphs. Applications include simple maximum/minimum problems, exponential growth and decay, and surveying problems.",
        "assignments": [
          {
            "id": "d9b13d9c-8a90-4318-be4a-09d8161d0031",
            "title": "Project",
            "due_date": "2022-02-13T00:00:00",
            "completed": true
          },
          {
            "id": "050e886a-2159-4b4d-84d6-131097dc7e1b",
            "title": "Essay",
            "due_date": "2022-02-10T00:00:00",
            "completed": true
          },
          {
            "id": "56889a3e-f3e5-406a-98a5-b9027804efe4",
            "title": "Quiz",
            "due_date": "2022-01-19T00:00:00",
            "completed": false
          },
          {
            "id": "1b88dd89-8bf4-4685-8519-e223a146b363",
            "title": "Project",
            "due_date": "2022-03-17T00:00:00",
            "completed": true
          },
          {
            "id": "46ef706b-b847-47e5-a124-e4d89b2a5bb4",
            "title": "Reading",
            "due_date": "2022-03-30T00:00:00",
            "completed": false
          },
          {
            "id": "f39cddbd-e151-4db3-bc83-49a74f80a914",
            "title": "Essay",
            "due_date": "2022-03-15T00:00:00",
            "completed": true
          },
          {
            "id": "359d2abe-d648-4229-a062-75fb03820850",
            "title": "Reading",
            "due_date": "2022-03-15T00:00:00",
            "completed": false
          },
          {
            "id": "d97afbfc-1a14-47bf-b87c-d31f9005319b",
            "title": "Paper",
            "due_date": "2022-01-11T00:00:00",
            "completed": true
          },
          {
            "id": "f9e9d620-f1f8-43d6-bc37-d733680e03c3",
            "title": "Presentation",
            "due_date": "2022-04-02T00:00:00",
            "completed": true
          },
          {
            "id": "ece6a9e1-4965-4d20-beb1-de2eefdf657f",
            "title": "Paper",
            "due_date": "2022-04-09T00:00:00",
            "completed": true
          },
          {
            "id": "9be2f71e-8388-4db5-b0ba-9271b7d7d6ab",
            "title": "Test",
            "due_date": "2022-03-27T00:00:00",
            "completed": false
          },
          {
            "id": "9f8e57b0-a190-4b5c-98a6-2c950f1dada0",
            "title": "Project",
            "due_date": "2022-02-19T00:00:00",
            "completed": true
          },
          {
            "id": "76d2a1f0-e4f2-4de0-882d-39914832094c",
            "title": "Exam",
            "due_date": "2022-04-08T00:00:00",
            "completed": true
          },
          {
            "id": "28dae639-7fb7-4923-a3dd-30ae7594a2c8",
            "title": "Discussion",
            "due_date": "2022-03-05T00:00:00",
            "completed": true
          },
          {
            "id": "46359a80-f3db-4e00-8869-b85408280a4f",
            "title": "Lab",
            "due_date": "2022-03-13T00:00:00",
            "completed": true
          },
          {
            "id": "704cb9f4-d893-4a75-9c5c-b2a9172426a6",
            "title": "Homework",
            "due_date": "2022-01-25T00:00:00",
            "completed": false
          },
          {
            "id": "5e5dbabf-4311-49f3-b678-e7707496e7ee",
            "title": "Lab",
            "due_date": "2022-04-07T00:00:00",
            "completed": true
          },
          {
            "id": "38355b95-9c1c-4e60-9537-66fb811dd9a8",
            "title": "Presentation",
            "due_date": "2022-01-07T00:00:00",
            "completed": true
          },
          {
            "id": "71c2735e-496b-4572-b926-90b289279120",
            "title": "Project",
            "due_date": "2022-03-14T00:00:00",
            "completed": true
          },
          {
            "id": "b24aade8-8175-4417-9a48-7068f4f4eb15",
            "title": "Lab",
            "due_date": "2022-04-25T00:00:00",
            "completed": true
          },
          {
            "id": "3e41ff76-03ee-4aaa-bf3b-91a9e9401ebc",
            "title": "Final",
            "due_date": "2022-02-09T00:00:00",
            "completed": true
          },
          {
            "id": "e47272ff-596c-4a15-b1d7-7bd8461baee2",
            "title": "Quiz",
            "due_date": "2022-01-14T00:00:00",
            "completed": true
          },
          {
            "id": "c0d595e3-62b9-440d-8a6c-3d6422dec243",
            "title": "Essay",
            "due_date": "2022-03-09T00:00:00",
            "completed": false
          },
          {
            "id": "c51d6e69-7fc3-4e53-b60d-8e95b8f190b4",
            "title": "Final",
            "due_date": "2022-03-28T00:00:00",
            "completed": true
          },
          {
            "id": "9638149b-b2a2-47ad-a8f2-3fa8eac57bc5",
            "title": "Discussion",
            "due_date": "2022-02-07T00:00:00",
            "completed": true
          },
          {
            "id": "e8d659bb-0836-4060-bfe5-7bec843014b7",
            "title": "Project",
            "due_date": "2022-03-25T00:00:00",
            "completed": true
          },
          {
            "id": "1841bcc9-7080-4f3a-8a6a-6ec910f13194",
            "title": "Paper",
            "due_date": "2022-02-09T00:00:00",
            "completed": true
          },
          {
            "id": "0e237b3a-f448-4b28-8b01-feb53b8167f0",
            "title": "Essay",
            "due_date": "2022-02-02T00:00:00",
            "completed": true
          },
          {
            "id": "2951bc14-54ab-458f-a5a9-eaff424231b7",
            "title": "Final",
            "due_date": "2022-01-23T00:00:00",
            "completed": true
          },
          {
            "id": "7ea5da45-184c-419d-8558-08b200488164",
            "title": "Project",
            "due_date": "2022-02-10T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "4a52b3de-a899-41a0-8806-b03bbbf1739e",
        "grade": 92.25
      },
      {
        "id": "a20b7107-0b05-4f5c-ae55-a0fd2f082997",
        "title": "Computer Modeling and Science",
        "credit_hours": 3,
        "short_id": "CSCI 1210",
        "description": "Introduction to computer models used as tools of scientific investigation, including historically important examples in the natural and social sciences. Lectures cover topics of current public interest, including economics, epidemiology, and ecological sustainability.",
        "assignments": [
          {
            "id": "6939149b-f47e-405c-9edd-aefd5366636a",
            "title": "Final",
            "due_date": "2022-07-16T00:00:00",
            "completed": true
          },
          {
            "id": "71a0f935-da1a-474c-8229-6fc78a4be28e",
            "title": "Presentation",
            "due_date": "2022-06-07T00:00:00",
            "completed": true
          },
          {
            "id": "72bf1520-5ce1-477e-ae1b-732aed859943",
            "title": "Final",
            "due_date": "2022-06-02T00:00:00",
            "completed": true
          },
          {
            "id": "81a057d0-50d3-47e9-8a0c-9a1c97baee1c",
            "title": "Lab",
            "due_date": "2022-06-23T00:00:00",
            "completed": true
          },
          {
            "id": "b5608c56-f0c1-4655-9eb7-8a887ab02321",
            "title": "Exam",
            "due_date": "2022-06-30T00:00:00",
            "completed": true
          },
          {
            "id": "eddd0669-01a9-4d9c-b82a-e38a9887eeff",
            "title": "Homework",
            "due_date": "2022-07-02T00:00:00",
            "completed": true
          },
          {
            "id": "83f0b8ec-2deb-41dc-a2b7-29fbfc2078d7",
            "title": "Discussion",
            "due_date": "2022-06-04T00:00:00",
            "completed": true
          },
          {
            "id": "812f8d10-e428-4f50-8b63-dc9383956941",
            "title": "Reading",
            "due_date": "2022-06-26T00:00:00",
            "completed": true
          },
          {
            "id": "920b5b85-a5be-424e-ac25-a6d8d15fca63",
            "title": "Essay",
            "due_date": "2022-06-23T00:00:00",
            "completed": true
          },
          {
            "id": "afab6af8-ba97-4c69-8a83-c54307731f5a",
            "title": "Project",
            "due_date": "2022-07-01T00:00:00",
            "completed": false
          },
          {
            "id": "5aadd4bb-b378-4515-85cc-eff1376ccf16",
            "title": "Lab",
            "due_date": "2022-06-22T00:00:00",
            "completed": false
          },
          {
            "id": "ebdce7cd-9c45-4dd3-a118-ab7a9da56940",
            "title": "Paper",
            "due_date": "2022-06-20T00:00:00",
            "completed": true
          },
          {
            "id": "69468b50-e4c0-4377-8210-10712f5624d5",
            "title": "Presentation",
            "due_date": "2022-06-24T00:00:00",
            "completed": false
          },
          {
            "id": "2622ed31-a991-443e-8c83-63a3968abf15",
            "title": "Lab",
            "due_date": "2022-06-14T00:00:00",
            "completed": true
          },
          {
            "id": "be404438-8ded-4612-b0ed-e3bbfacc6b2f",
            "title": "Paper",
            "due_date": "2022-07-05T00:00:00",
            "completed": true
          },
          {
            "id": "13a5d2c0-9995-471c-9b90-f88942455fe8",
            "title": "Quiz",
            "due_date": "2022-06-23T00:00:00",
            "completed": true
          },
          {
            "id": "5c81d9de-72fc-4cfd-8746-427d57c0b5b0",
            "title": "Discussion",
            "due_date": "2022-07-13T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "cc15ba2a-db88-47c7-9006-0d8eac2fcef5",
        "grade": 96.93
      },
      {
        "id": "14f14035-fb28-49bb-b535-b89a0d8ef28f",
        "title": "Software Development",
        "credit_hours": 4,
        "short_id": "CSCI 1302",
        "description": "Software development techniques in an object-oriented computer language. An intermediate programming course emphasizing systems methods, top-down design, testing, modularity, and structured techniques. Applications from areas of numeric and non-numeric processing and data structures.",
        "assignments": [
          {
            "id": "b53f3679-5120-4cf7-8408-bb2738101bb8",
            "title": "Discussion",
            "due_date": "2022-07-08T00:00:00",
            "completed": true
          },
          {
            "id": "2ab63d5e-99e2-4deb-94b1-5fa22e600334",
            "title": "Essay",
            "due_date": "2022-06-20T00:00:00",
            "completed": true
          },
          {
            "id": "6aa48f77-a1c8-4ad0-b348-d631c6bdfc00",
            "title": "Homework",
            "due_date": "2022-06-16T00:00:00",
            "completed": true
          },
          {
            "id": "da068a60-bf82-450c-b57e-b51dee548dec",
            "title": "Final",
            "due_date": "2022-06-29T00:00:00",
            "completed": true
          },
          {
            "id": "8421267e-3a40-4041-8f56-aa4fabe664af",
            "title": "Project",
            "due_date": "2022-06-20T00:00:00",
            "completed": true
          },
          {
            "id": "566bad91-f43b-4719-abb9-677e1746d512",
            "title": "Paper",
            "due_date": "2022-07-14T00:00:00",
            "completed": true
          },
          {
            "id": "be64e622-6bd4-41a7-9cd6-549d7dd3bbf7",
            "title": "Final",
            "due_date": "2022-06-18T00:00:00",
            "completed": false
          },
          {
            "id": "cf593e2b-8fc0-4c2f-ae30-2714fb6b2572",
            "title": "Homework",
            "due_date": "2022-07-15T00:00:00",
            "completed": true
          },
          {
            "id": "f7b40fbd-7400-4737-9d63-647cadc060eb",
            "title": "Exam",
            "due_date": "2022-06-24T00:00:00",
            "completed": false
          },
          {
            "id": "fea633cb-2a12-4635-807d-7857d7e05cf6",
            "title": "Final",
            "due_date": "2022-06-15T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "cc15ba2a-db88-47c7-9006-0d8eac2fcef5",
        "grade": 92.26
      },
      {
        "id": "48bc0fc2-7348-4bca-9f71-9eb48915c63b",
        "title": "Foundations for Informatics and Data Analytics",
        "credit_hours": 4,
        "short_id": "CSCI 1360",
        "description": "An introduction to concepts in scientific programming and data science using the Python language. Students are given hands-on opportunities to learn techniques applicable to quantitative analyses across a broad range of fields. Core programming concepts are taught in tandem with real-world applications.",
        "assignments": [
          {
            "id": "915243e5-3ea6-4833-8957-e0d74df88b58",
            "title": "Reading",
            "due_date": "2022-08-13T00:00:00",
            "completed": false
          },
          {
            "id": "d12876f1-cfd7-4de9-a2a6-fca72d4f696f",
            "title": "Homework",
            "due_date": "2022-11-04T00:00:00",
            "completed": true
          },
          {
            "id": "40f3a8c2-c70b-4717-8800-832b70045b22",
            "title": "Exam",
            "due_date": "2022-10-01T00:00:00",
            "completed": true
          },
          {
            "id": "12a55d0b-4bd7-40e6-854b-f03153f9c461",
            "title": "Discussion",
            "due_date": "2022-10-05T00:00:00",
            "completed": false
          },
          {
            "id": "e9af8bdb-7d89-4498-ac49-337fd1e94664",
            "title": "Reading",
            "due_date": "2022-10-27T00:00:00",
            "completed": true
          },
          {
            "id": "d37e7e37-c518-43c9-97a6-7a9b5a9e6a1d",
            "title": "Presentation",
            "due_date": "2022-09-15T00:00:00",
            "completed": true
          },
          {
            "id": "a8aed48c-4266-4a77-a4d3-ebbe5dbceaae",
            "title": "Exam",
            "due_date": "2022-08-14T00:00:00",
            "completed": true
          },
          {
            "id": "c91dfa92-a8fc-43b1-b74a-b1e747fe5ae8",
            "title": "Quiz",
            "due_date": "2022-08-06T00:00:00",
            "completed": false
          },
          {
            "id": "698dbffa-1173-42d2-b5ac-c4215025a570",
            "title": "Paper",
            "due_date": "2022-10-01T00:00:00",
            "completed": false
          },
          {
            "id": "1a46880e-9675-48c8-b69a-f8dcf8def883",
            "title": "Lab",
            "due_date": "2022-08-09T00:00:00",
            "completed": true
          },
          {
            "id": "eecf46cf-b388-4a35-a2c7-968685d18ba4",
            "title": "Discussion",
            "due_date": "2022-09-18T00:00:00",
            "completed": true
          },
          {
            "id": "3149dca6-af0a-454b-899a-43b9b2b9cf8d",
            "title": "Paper",
            "due_date": "2022-08-11T00:00:00",
            "completed": false
          },
          {
            "id": "62d7fd30-4e18-40e5-9e4b-36537fe02869",
            "title": "Homework",
            "due_date": "2022-09-26T00:00:00",
            "completed": true
          },
          {
            "id": "c6f24a9e-387c-4392-9d80-f41c2da7de29",
            "title": "Quiz",
            "due_date": "2022-10-10T00:00:00",
            "completed": true
          },
          {
            "id": "e80a6d7c-4fd4-4ddc-a8de-904c2f55406e",
            "title": "Paper",
            "due_date": "2022-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "55a40fc7-6c08-47d5-b956-b3efdf629aea",
            "title": "Discussion",
            "due_date": "2022-09-17T00:00:00",
            "completed": true
          },
          {
            "id": "80b62819-0a0c-4d41-b35f-961d25ca6e1c",
            "title": "Test",
            "due_date": "2022-09-07T00:00:00",
            "completed": true
          },
          {
            "id": "5b70315b-aef6-480f-b83f-b0cb692dac52",
            "title": "Quiz",
            "due_date": "2022-08-16T00:00:00",
            "completed": true
          },
          {
            "id": "d38c2080-7ef6-402d-ac3d-9d583b098cb2",
            "title": "Discussion",
            "due_date": "2022-11-14T00:00:00",
            "completed": true
          },
          {
            "id": "7b42b67a-e06f-4684-a32d-7ef19623db8f",
            "title": "Reading",
            "due_date": "2022-08-21T00:00:00",
            "completed": true
          },
          {
            "id": "56bf894b-f6ef-40fd-9ccf-be52ac271231",
            "title": "Exam",
            "due_date": "2022-09-02T00:00:00",
            "completed": true
          },
          {
            "id": "668b816a-a111-4c0d-ba08-6926155ca421",
            "title": "Presentation",
            "due_date": "2022-08-20T00:00:00",
            "completed": false
          },
          {
            "id": "cb317f71-c24e-41d5-88a1-32a2188dd64a",
            "title": "Paper",
            "due_date": "2022-09-13T00:00:00",
            "completed": false
          },
          {
            "id": "81d82e0e-3b59-4e90-8b5b-da28a8910279",
            "title": "Project",
            "due_date": "2022-10-02T00:00:00",
            "completed": true
          },
          {
            "id": "b393bf54-8f71-40ec-8e0a-3c002a76362d",
            "title": "Discussion",
            "due_date": "2022-09-13T00:00:00",
            "completed": true
          },
          {
            "id": "63129db7-fb51-4429-97c9-e5097ed4367c",
            "title": "Homework",
            "due_date": "2022-11-15T00:00:00",
            "completed": false
          },
          {
            "id": "f84200b9-9bc1-41de-9c0b-e9150a83d123",
            "title": "Paper",
            "due_date": "2022-10-19T00:00:00",
            "completed": true
          },
          {
            "id": "b300be38-c71d-45d7-8578-460c58fb44e5",
            "title": "Reading",
            "due_date": "2022-09-08T00:00:00",
            "completed": true
          },
          {
            "id": "7fa0461c-a953-4f5a-95df-39087574947f",
            "title": "Lab",
            "due_date": "2022-08-16T00:00:00",
            "completed": true
          },
          {
            "id": "5d2310e0-6beb-4ecc-bc1f-1668e006cb26",
            "title": "Test",
            "due_date": "2022-10-30T00:00:00",
            "completed": true
          },
          {
            "id": "980e0ed3-a119-4cce-a06a-0bcdb92e7dd6",
            "title": "Lab",
            "due_date": "2022-09-01T00:00:00",
            "completed": true
          },
          {
            "id": "03b4c033-6eb7-494a-b940-6b6a9915a628",
            "title": "Reading",
            "due_date": "2022-11-03T00:00:00",
            "completed": true
          },
          {
            "id": "b136539c-4d21-430f-a059-b18b21775f1f",
            "title": "Paper",
            "due_date": "2022-09-18T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "0b8f7943-ff5c-45c1-be1a-bd5f80206ddd",
        "grade": 96.95
      },
      {
        "id": "72449912-ee27-46ec-9c62-4ab76377398a",
        "title": "Systems Programming",
        "credit_hours": 4,
        "short_id": "CSCI 1730",
        "description": "Programs and programming techniques used in systems programming in Unix environments. Focus on Unix system call interfaces and the interface between the Unix kernel and application software running in Unix environments. Students will learn the basics of Unix systems programming, including file and directory structures, basic and advanced file I/O, process creation, and inter-process communication.",
        "assignments": [
          {
            "id": "42280e5c-8d23-42c0-904c-31b079cfc3d6",
            "title": "Homework",
            "due_date": "2022-08-17T00:00:00",
            "completed": false
          },
          {
            "id": "64fcdacd-bb69-41bf-8393-fe13d0d53aa1",
            "title": "Exam",
            "due_date": "2022-08-25T00:00:00",
            "completed": true
          },
          {
            "id": "b91d742e-c621-431a-a8fd-26847bc72a0c",
            "title": "Reading",
            "due_date": "2022-10-08T00:00:00",
            "completed": true
          },
          {
            "id": "8faf6366-f364-4a18-8016-52ed5fcf28f4",
            "title": "Discussion",
            "due_date": "2022-10-27T00:00:00",
            "completed": true
          },
          {
            "id": "cb33c33b-a36b-48c9-a655-fb54ed36e97d",
            "title": "Quiz",
            "due_date": "2022-09-22T00:00:00",
            "completed": true
          },
          {
            "id": "472bd2dc-c37c-4faa-b53e-c3d3fdb49e71",
            "title": "Essay",
            "due_date": "2022-08-27T00:00:00",
            "completed": true
          },
          {
            "id": "4a9d823c-4920-4015-a583-34f03355944d",
            "title": "Presentation",
            "due_date": "2022-09-06T00:00:00",
            "completed": true
          },
          {
            "id": "55ebeb50-6de7-44e1-98fc-bd9c96da32d0",
            "title": "Presentation",
            "due_date": "2022-11-23T00:00:00",
            "completed": true
          },
          {
            "id": "3a4062e8-e50f-4493-8274-1c3a776f5268",
            "title": "Essay",
            "due_date": "2022-08-26T00:00:00",
            "completed": true
          },
          {
            "id": "7cc63cc2-ff54-4b30-8a50-64db5118a74d",
            "title": "Discussion",
            "due_date": "2022-08-25T00:00:00",
            "completed": true
          },
          {
            "id": "d250fecb-5800-42b5-ad2b-5f50dc35cebe",
            "title": "Homework",
            "due_date": "2022-10-16T00:00:00",
            "completed": true
          },
          {
            "id": "b2d4cac3-3602-441c-bc61-3c849e9476ac",
            "title": "Final",
            "due_date": "2022-10-19T00:00:00",
            "completed": false
          },
          {
            "id": "7cf36c5c-2f48-411f-904c-d910d46ecda5",
            "title": "Test",
            "due_date": "2022-10-11T00:00:00",
            "completed": true
          },
          {
            "id": "26e3cd81-0e04-4173-a786-bae5213055eb",
            "title": "Presentation",
            "due_date": "2022-10-10T00:00:00",
            "completed": false
          },
          {
            "id": "953c8270-58e2-4b17-82a4-3feb81979c26",
            "title": "Quiz",
            "due_date": "2022-09-20T00:00:00",
            "completed": true
          },
          {
            "id": "73ce8107-0c91-432f-81ff-9f3d48b994e0",
            "title": "Discussion",
            "due_date": "2022-11-22T00:00:00",
            "completed": true
          },
          {
            "id": "61af244e-6557-4853-944f-9a8f43091cad",
            "title": "Homework",
            "due_date": "2022-11-19T00:00:00",
            "completed": true
          },
          {
            "id": "6f53ff94-d7f3-4f22-add8-19cc18a12986",
            "title": "Project",
            "due_date": "2022-10-09T00:00:00",
            "completed": true
          },
          {
            "id": "2a746344-52c2-40e8-8d77-3a2f5cf78430",
            "title": "Homework",
            "due_date": "2022-11-10T00:00:00",
            "completed": true
          },
          {
            "id": "4567b17e-a03e-4181-b0d5-171dbd58cb06",
            "title": "Reading",
            "due_date": "2022-08-09T00:00:00",
            "completed": false
          },
          {
            "id": "00bacc4f-ebca-4883-bd54-3108e7881ad8",
            "title": "Quiz",
            "due_date": "2022-10-10T00:00:00",
            "completed": false
          },
          {
            "id": "5da40fe4-f1eb-445a-9720-1e3d17f0592d",
            "title": "Exam",
            "due_date": "2022-08-20T00:00:00",
            "completed": true
          },
          {
            "id": "c23cff65-2533-4bdb-9aa6-fe29eab8b99b",
            "title": "Paper",
            "due_date": "2022-10-10T00:00:00",
            "completed": true
          },
          {
            "id": "72ec6b76-c7f9-4da8-b645-9c3a0cb48409",
            "title": "Final",
            "due_date": "2022-08-25T00:00:00",
            "completed": true
          },
          {
            "id": "b75421c1-6acc-4bf2-8165-d8691862e6a1",
            "title": "Reading",
            "due_date": "2022-11-06T00:00:00",
            "completed": false
          },
          {
            "id": "81389360-907c-4daa-9f39-a9b5c4b1f85f",
            "title": "Presentation",
            "due_date": "2022-09-29T00:00:00",
            "completed": true
          },
          {
            "id": "d263bead-f274-4ca6-9287-b72d13ce26e1",
            "title": "Quiz",
            "due_date": "2022-10-26T00:00:00",
            "completed": true
          },
          {
            "id": "820a5a03-824d-49ee-90a2-bca248340d56",
            "title": "Presentation",
            "due_date": "2022-08-11T00:00:00",
            "completed": true
          },
          {
            "id": "656e1150-234f-4e6b-9f34-99cd9b476ab6",
            "title": "Test",
            "due_date": "2022-10-25T00:00:00",
            "completed": true
          },
          {
            "id": "b7bcadbb-4a7c-49f2-aa12-4c7f263cb6e9",
            "title": "Essay",
            "due_date": "2022-11-07T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "0b8f7943-ff5c-45c1-be1a-bd5f80206ddd",
        "grade": 95.06
      },
      {
        "id": "4805754b-9877-430f-8507-b4b8fb2a87a4",
        "title": "Computer Science Special Topic",
        "credit_hours": 1,
        "short_id": "CSCI 1900",
        "description": "A topic in elementary computer science not covered by any other lower-division computer science course.",
        "assignments": [
          {
            "id": "6103c4ec-aec8-4079-ba6d-7655cf561eae",
            "title": "Exam",
            "due_date": "2022-10-19T00:00:00",
            "completed": true
          },
          {
            "id": "e79c9428-109c-4a17-afb8-f8789378e8b1",
            "title": "Essay",
            "due_date": "2022-09-11T00:00:00",
            "completed": true
          },
          {
            "id": "b7441e89-bb52-4a12-8ec5-4cef4e1a796c",
            "title": "Essay",
            "due_date": "2022-09-01T00:00:00",
            "completed": false
          },
          {
            "id": "596e6ab4-a7e0-417c-9e25-d26c332bbb64",
            "title": "Project",
            "due_date": "2022-08-23T00:00:00",
            "completed": true
          },
          {
            "id": "ee1815d4-da63-45a3-83f3-878dab0715d1",
            "title": "Final",
            "due_date": "2022-10-13T00:00:00",
            "completed": true
          },
          {
            "id": "3326338a-4452-4bca-a4c8-eb1def1521bf",
            "title": "Quiz",
            "due_date": "2022-09-22T00:00:00",
            "completed": true
          },
          {
            "id": "1560c512-b9ad-4e8b-a73a-485dde892c79",
            "title": "Homework",
            "due_date": "2022-08-21T00:00:00",
            "completed": true
          },
          {
            "id": "54130276-9270-4332-8d78-8b609709bc04",
            "title": "Reading",
            "due_date": "2022-10-27T00:00:00",
            "completed": true
          },
          {
            "id": "850587c1-2279-4026-ada0-0f31fc928c6a",
            "title": "Reading",
            "due_date": "2022-09-01T00:00:00",
            "completed": true
          },
          {
            "id": "f35ca169-2ea4-491d-aec0-e2f2127dbbd2",
            "title": "Exam",
            "due_date": "2022-11-20T00:00:00",
            "completed": false
          },
          {
            "id": "3200d983-1b41-497f-92f7-7dc38b5f4bf4",
            "title": "Reading",
            "due_date": "2022-09-03T00:00:00",
            "completed": true
          },
          {
            "id": "a0b7ff47-c83e-4d02-b9b5-6654aa437360",
            "title": "Paper",
            "due_date": "2022-09-30T00:00:00",
            "completed": false
          },
          {
            "id": "6ea77ba2-9d20-4958-aeba-47885d1e3c9e",
            "title": "Discussion",
            "due_date": "2022-09-12T00:00:00",
            "completed": true
          },
          {
            "id": "e8a22473-a525-4072-b78f-422ba68b7251",
            "title": "Presentation",
            "due_date": "2022-11-25T00:00:00",
            "completed": true
          },
          {
            "id": "ffc9f547-842e-4eec-b5c4-c6956165d31f",
            "title": "Project",
            "due_date": "2022-10-06T00:00:00",
            "completed": true
          },
          {
            "id": "f7b2138c-5066-4dcd-a594-458d01259d5a",
            "title": "Reading",
            "due_date": "2022-11-07T00:00:00",
            "completed": false
          },
          {
            "id": "f818669c-1c43-4157-8357-bc9396ea2117",
            "title": "Quiz",
            "due_date": "2022-11-19T00:00:00",
            "completed": true
          },
          {
            "id": "0a362cda-9e08-4818-9255-c5011f157448",
            "title": "Final",
            "due_date": "2022-08-28T00:00:00",
            "completed": false
          },
          {
            "id": "fa001149-3e30-4782-9e81-b5cc76cdfccb",
            "title": "Exam",
            "due_date": "2022-08-24T00:00:00",
            "completed": false
          },
          {
            "id": "14f406c7-90c8-4ff7-8528-5228d36118d4",
            "title": "Homework",
            "due_date": "2022-11-26T00:00:00",
            "completed": true
          },
          {
            "id": "6d8e42d2-264d-4c11-a0a1-b94cecbe303e",
            "title": "Paper",
            "due_date": "2022-09-27T00:00:00",
            "completed": true
          },
          {
            "id": "90ae62a2-7b8f-499f-a0d2-550340c3e339",
            "title": "Final",
            "due_date": "2022-10-12T00:00:00",
            "completed": true
          },
          {
            "id": "1514906c-04bd-4527-b0e7-d32ee39e3604",
            "title": "Essay",
            "due_date": "2022-08-14T00:00:00",
            "completed": true
          },
          {
            "id": "72460226-5d74-460c-aec2-25edcefd89e9",
            "title": "Quiz",
            "due_date": "2022-08-25T00:00:00",
            "completed": true
          },
          {
            "id": "f6ab7024-8b02-4f76-8808-2e9e671de67b",
            "title": "Quiz",
            "due_date": "2022-09-13T00:00:00",
            "completed": false
          },
          {
            "id": "d636048c-a941-457b-9ddb-01b94fefa44e",
            "title": "Presentation",
            "due_date": "2022-10-08T00:00:00",
            "completed": false
          },
          {
            "id": "e58a8b72-0e0e-4dc2-bdcc-59f6f8806c7c",
            "title": "Discussion",
            "due_date": "2022-10-02T00:00:00",
            "completed": false
          },
          {
            "id": "32b440e1-4e6b-4261-b199-793a04cf73c6",
            "title": "Final",
            "due_date": "2022-10-10T00:00:00",
            "completed": false
          },
          {
            "id": "e01607a4-0284-4be7-a1b0-48fe2aca8a63",
            "title": "Exam",
            "due_date": "2022-10-25T00:00:00",
            "completed": true
          },
          {
            "id": "4c496006-1249-42a8-ba77-76fa41239280",
            "title": "Discussion",
            "due_date": "2022-09-12T00:00:00",
            "completed": true
          },
          {
            "id": "64f64022-1ad1-4cbf-a63e-e95a00b6c7c8",
            "title": "Quiz",
            "due_date": "2022-10-24T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "0b8f7943-ff5c-45c1-be1a-bd5f80206ddd",
        "grade": 96.95
      },
      {
        "id": "1468af79-fe54-4eba-94c0-a45ce0dcd8b8",
        "title": "Intermediate Latin I",
        "credit_hours": 3,
        "short_id": "LATN 2001",
        "description": "Translating continuous Latin passages through prose readings from the works of Julius Caesar and verse readings from the works of Catullus and/or Ovid. Course content will be balanced between prose and poetry. Systematic review of Latin grammar and syntax.",
        "assignments": [
          {
            "id": "a6bddbe7-ab03-45d1-a316-df6faefe4aff",
            "title": "Test",
            "due_date": "2022-09-10T00:00:00",
            "completed": true
          },
          {
            "id": "89640db1-e7e8-4152-92e6-3ec3bdb1a8c2",
            "title": "Paper",
            "due_date": "2022-10-22T00:00:00",
            "completed": true
          },
          {
            "id": "a75c332d-9ca7-4833-bcfe-9ffd78250285",
            "title": "Reading",
            "due_date": "2022-10-12T00:00:00",
            "completed": true
          },
          {
            "id": "0ca60207-f708-498e-aca9-694ac804dc1b",
            "title": "Presentation",
            "due_date": "2022-10-31T00:00:00",
            "completed": true
          },
          {
            "id": "315c1889-85d0-43f6-8f3d-e43e193d3cfa",
            "title": "Exam",
            "due_date": "2022-10-18T00:00:00",
            "completed": false
          },
          {
            "id": "f60bef7c-7bad-46b8-8b69-705b9fb7953a",
            "title": "Reading",
            "due_date": "2022-11-21T00:00:00",
            "completed": true
          },
          {
            "id": "b411b095-213c-4a50-ae1c-51df58735bcc",
            "title": "Project",
            "due_date": "2022-08-28T00:00:00",
            "completed": true
          },
          {
            "id": "2777c959-09b3-4859-82a8-d3e606015955",
            "title": "Lab",
            "due_date": "2022-09-26T00:00:00",
            "completed": false
          },
          {
            "id": "16e0c703-bb73-4e19-afa1-842a68f05e4c",
            "title": "Final",
            "due_date": "2022-08-07T00:00:00",
            "completed": false
          },
          {
            "id": "5059568f-5019-4a7a-ba37-d5288071b51d",
            "title": "Quiz",
            "due_date": "2022-09-16T00:00:00",
            "completed": false
          },
          {
            "id": "91a2c862-e182-403f-a16c-84a0a4c0f276",
            "title": "Essay",
            "due_date": "2022-09-09T00:00:00",
            "completed": true
          },
          {
            "id": "3253349a-ae3a-439c-99ae-d84276ddafab",
            "title": "Lab",
            "due_date": "2022-10-07T00:00:00",
            "completed": false
          },
          {
            "id": "9fee5b75-3b53-4f7a-bf44-db6e09bffcbf",
            "title": "Final",
            "due_date": "2022-08-30T00:00:00",
            "completed": true
          },
          {
            "id": "d6f95be2-0536-4577-bd6d-0c2aa91537e0",
            "title": "Lab",
            "due_date": "2022-08-19T00:00:00",
            "completed": false
          },
          {
            "id": "464d5fae-b552-4a9a-9f08-bc0e8bf63c75",
            "title": "Presentation",
            "due_date": "2022-09-15T00:00:00",
            "completed": false
          },
          {
            "id": "105e3adc-4ab4-44dc-891e-ce5771c1591a",
            "title": "Essay",
            "due_date": "2022-08-16T00:00:00",
            "completed": true
          },
          {
            "id": "e39dbf65-fcd9-4012-b2b1-61472edf46db",
            "title": "Final",
            "due_date": "2022-09-23T00:00:00",
            "completed": false
          },
          {
            "id": "da35d2e6-dffc-4e3b-b7aa-5140c56e2f65",
            "title": "Exam",
            "due_date": "2022-10-14T00:00:00",
            "completed": false
          },
          {
            "id": "2613c39b-b483-4ff1-b39b-e4730097b1ed",
            "title": "Discussion",
            "due_date": "2022-11-12T00:00:00",
            "completed": false
          },
          {
            "id": "8cd14f83-bf94-4893-9125-80c24d3f2bcd",
            "title": "Quiz",
            "due_date": "2022-11-02T00:00:00",
            "completed": false
          },
          {
            "id": "28b49a46-d42a-4b7a-9bf0-b75a444e81fe",
            "title": "Reading",
            "due_date": "2022-10-03T00:00:00",
            "completed": true
          },
          {
            "id": "4e6d6ec3-a540-4b91-99b7-939509e218ee",
            "title": "Reading",
            "due_date": "2022-10-10T00:00:00",
            "completed": true
          },
          {
            "id": "c8518464-cee2-4027-ae01-c8b8780ef7dc",
            "title": "Project",
            "due_date": "2022-09-01T00:00:00",
            "completed": false
          },
          {
            "id": "5fd4fb51-a583-4896-b5e2-d9fe674b36dc",
            "title": "Lab",
            "due_date": "2022-08-21T00:00:00",
            "completed": false
          },
          {
            "id": "ea73057a-f737-455e-949d-b01aa40807ed",
            "title": "Discussion",
            "due_date": "2022-09-25T00:00:00",
            "completed": true
          },
          {
            "id": "1102a971-8671-4268-934f-db08b6daf672",
            "title": "Final",
            "due_date": "2022-08-27T00:00:00",
            "completed": true
          },
          {
            "id": "e82fd9ba-fa8a-4d48-97bb-5b2d54b48ce4",
            "title": "Test",
            "due_date": "2022-10-09T00:00:00",
            "completed": true
          },
          {
            "id": "1fa79c06-6040-40e4-9fbc-c2f59f0016ce",
            "title": "Paper",
            "due_date": "2022-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "e73a2824-ef40-4cef-a8fb-f10d7a14c702",
            "title": "Essay",
            "due_date": "2022-10-22T00:00:00",
            "completed": true
          },
          {
            "id": "57f7b7c7-80d7-4d2f-8bdc-041f3806e9b6",
            "title": "Lab",
            "due_date": "2022-08-21T00:00:00",
            "completed": true
          },
          {
            "id": "975f3fbb-03e3-4bb6-a244-2d235c7bd37e",
            "title": "Presentation",
            "due_date": "2022-08-25T00:00:00",
            "completed": true
          },
          {
            "id": "808a3e81-d888-4605-8535-3f7fb349bf70",
            "title": "Paper",
            "due_date": "2022-09-08T00:00:00",
            "completed": false
          },
          {
            "id": "7ff6f24b-91cd-43e3-a6af-95caf1c66150",
            "title": "Lab",
            "due_date": "2022-11-01T00:00:00",
            "completed": true
          },
          {
            "id": "aac90825-47c8-4c66-82b4-0f386ef73d5b",
            "title": "Exam",
            "due_date": "2022-08-17T00:00:00",
            "completed": false
          },
          {
            "id": "7e6d9410-e5e1-4d51-9af6-0c627812d318",
            "title": "Test",
            "due_date": "2022-08-10T00:00:00",
            "completed": false
          },
          {
            "id": "16152799-d2c9-4173-8bc5-cce45cf8fd50",
            "title": "Homework",
            "due_date": "2022-08-19T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "0b8f7943-ff5c-45c1-be1a-bd5f80206ddd",
        "grade": 97.6
      },
      {
        "id": "7ada734e-b3f8-4ba4-a5f8-346df7d22a20",
        "title": "Intermediate Latin II: Golden Age Latin Literature",
        "credit_hours": 3,
        "short_id": "LATN 2002",
        "description": "Golden Age Latin prose and poetry, with prose readings from the works of Cicero and verse readings from the works of Vergil and/or Horace. Course content will be balanced between prose and poetry.",
        "assignments": [
          {
            "id": "8b27d0c4-d780-4970-af94-7426811d89cf",
            "title": "Homework",
            "due_date": "2022-08-24T00:00:00",
            "completed": false
          },
          {
            "id": "0fce1c60-e7d7-47b8-af1e-2c8f50b6a468",
            "title": "Essay",
            "due_date": "2022-11-18T00:00:00",
            "completed": true
          },
          {
            "id": "b64f8721-305f-4edf-9f10-8f289912bd01",
            "title": "Reading",
            "due_date": "2022-10-28T00:00:00",
            "completed": true
          },
          {
            "id": "42cb0ff8-4f04-403a-8ff4-bb5427e063d3",
            "title": "Quiz",
            "due_date": "2022-08-12T00:00:00",
            "completed": false
          },
          {
            "id": "01b3ce80-1790-4fd3-a529-1198ebc92c8a",
            "title": "Test",
            "due_date": "2022-08-14T00:00:00",
            "completed": true
          },
          {
            "id": "8d835d82-ffab-4e72-a2d5-46de656efc3d",
            "title": "Quiz",
            "due_date": "2022-09-11T00:00:00",
            "completed": true
          },
          {
            "id": "673562c9-1b7e-4456-9a83-2e79c05eadf8",
            "title": "Homework",
            "due_date": "2022-11-01T00:00:00",
            "completed": true
          },
          {
            "id": "13bd5346-7464-46df-9b08-ab5cbfc4f7fb",
            "title": "Presentation",
            "due_date": "2022-09-25T00:00:00",
            "completed": true
          },
          {
            "id": "66f9f786-501a-4351-96a8-681e192a7373",
            "title": "Test",
            "due_date": "2022-09-18T00:00:00",
            "completed": true
          },
          {
            "id": "33211369-b7bd-40be-bdfc-1ec68616a389",
            "title": "Homework",
            "due_date": "2022-11-10T00:00:00",
            "completed": true
          },
          {
            "id": "01e22b06-deca-477c-8466-66fcbe6c75f6",
            "title": "Reading",
            "due_date": "2022-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "b2092f50-3098-4001-a75e-988c27ab6b83",
            "title": "Reading",
            "due_date": "2022-10-06T00:00:00",
            "completed": false
          },
          {
            "id": "3243182c-f7e8-4470-ade7-fd2a014c085c",
            "title": "Project",
            "due_date": "2022-08-19T00:00:00",
            "completed": true
          },
          {
            "id": "bd740987-8253-4413-bcfd-42161c9c5ac2",
            "title": "Final",
            "due_date": "2022-08-23T00:00:00",
            "completed": true
          },
          {
            "id": "bf16aa5b-3bb4-456f-9608-21e56a0afc19",
            "title": "Quiz",
            "due_date": "2022-08-05T00:00:00",
            "completed": true
          },
          {
            "id": "0073a43e-262b-40c6-865e-caf4d385563a",
            "title": "Test",
            "due_date": "2022-11-16T00:00:00",
            "completed": true
          },
          {
            "id": "6f21ab4e-d17b-4523-a008-3ec75c1fee46",
            "title": "Final",
            "due_date": "2022-08-17T00:00:00",
            "completed": true
          },
          {
            "id": "c22be634-8259-4ede-8e9e-b78969b1e4f6",
            "title": "Test",
            "due_date": "2022-11-19T00:00:00",
            "completed": true
          },
          {
            "id": "73da7dc7-88b3-4ee8-bcff-42b878cba47c",
            "title": "Homework",
            "due_date": "2022-08-25T00:00:00",
            "completed": true
          },
          {
            "id": "9b2cc4e2-12a5-4bb7-8b92-c9fc836a7b94",
            "title": "Paper",
            "due_date": "2022-11-22T00:00:00",
            "completed": true
          },
          {
            "id": "2f9d4263-91f2-4318-94ed-6b62671b990b",
            "title": "Discussion",
            "due_date": "2022-11-25T00:00:00",
            "completed": true
          },
          {
            "id": "b9a467c8-bb4c-4870-9b2b-08bdc1fa5f22",
            "title": "Presentation",
            "due_date": "2022-11-02T00:00:00",
            "completed": true
          },
          {
            "id": "10a6c7ab-c720-4248-aa09-c50d0c6fdde4",
            "title": "Final",
            "due_date": "2022-08-09T00:00:00",
            "completed": false
          },
          {
            "id": "10b7f579-cbd6-47a5-9d2d-708f74e1563c",
            "title": "Final",
            "due_date": "2022-08-23T00:00:00",
            "completed": true
          },
          {
            "id": "f9865425-1a7e-4b72-aab3-89b9be476cf8",
            "title": "Reading",
            "due_date": "2022-11-05T00:00:00",
            "completed": true
          },
          {
            "id": "c16ecf40-bd84-41b0-9351-29d051b8a3a6",
            "title": "Homework",
            "due_date": "2022-10-27T00:00:00",
            "completed": false
          },
          {
            "id": "95e17817-0d63-4295-9423-a37c837403b1",
            "title": "Lab",
            "due_date": "2022-08-20T00:00:00",
            "completed": true
          },
          {
            "id": "24028172-5289-48e3-a572-d014ac49a84c",
            "title": "Reading",
            "due_date": "2022-08-08T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "0b8f7943-ff5c-45c1-be1a-bd5f80206ddd",
        "grade": 98.9
      },
      {
        "id": "384a828d-3a17-4bca-97c9-b2324c8189ec",
        "title": "Intensive Elementary Latin I",
        "credit_hours": 3,
        "short_id": "LATN 2050",
        "description": "An intensive introduction to the Latin language. This includes pronunciation, fundamentals of grammar, reading, and translation.",
        "assignments": [
          {
            "id": "f2af4b59-e821-44ed-a2be-08d49b72d078",
            "title": "Homework",
            "due_date": "2022-08-05T00:00:00",
            "completed": false
          },
          {
            "id": "dc8578fc-823c-4c53-bac5-440e4a3c69b0",
            "title": "Paper",
            "due_date": "2022-11-05T00:00:00",
            "completed": true
          },
          {
            "id": "156c2f0d-4bcf-4ff2-8f92-3a915fee2a67",
            "title": "Homework",
            "due_date": "2022-09-22T00:00:00",
            "completed": true
          },
          {
            "id": "404f7401-06c6-47dd-92ee-660128f973ce",
            "title": "Exam",
            "due_date": "2022-10-27T00:00:00",
            "completed": true
          },
          {
            "id": "c8147315-6cca-4eef-be4a-7104c787ba5d",
            "title": "Final",
            "due_date": "2022-11-03T00:00:00",
            "completed": true
          },
          {
            "id": "8039daf2-40fb-48f5-9c60-f51df0cea23a",
            "title": "Exam",
            "due_date": "2022-10-22T00:00:00",
            "completed": true
          },
          {
            "id": "76c931ec-0bed-4c44-b095-0aec5c5cf321",
            "title": "Exam",
            "due_date": "2022-11-10T00:00:00",
            "completed": true
          },
          {
            "id": "6271d261-02f5-4ed1-b28b-5e51efe8fa62",
            "title": "Essay",
            "due_date": "2022-08-09T00:00:00",
            "completed": true
          },
          {
            "id": "089faf08-9306-4905-81d9-633912bee83d",
            "title": "Homework",
            "due_date": "2022-10-07T00:00:00",
            "completed": false
          },
          {
            "id": "d7b02bd1-9002-465b-9fe5-7f2bd333cd0e",
            "title": "Reading",
            "due_date": "2022-11-19T00:00:00",
            "completed": false
          },
          {
            "id": "ba11633a-9ddb-4578-bc7a-76d442d5ea6f",
            "title": "Presentation",
            "due_date": "2022-09-21T00:00:00",
            "completed": true
          },
          {
            "id": "698f5ffa-359c-4d18-a67f-f97d2500c262",
            "title": "Final",
            "due_date": "2022-09-24T00:00:00",
            "completed": false
          },
          {
            "id": "2549f3a1-2f0c-4f17-9319-69c18e756f7d",
            "title": "Quiz",
            "due_date": "2022-11-13T00:00:00",
            "completed": true
          },
          {
            "id": "b4fd8106-f3da-49a1-9e66-48964380e74f",
            "title": "Essay",
            "due_date": "2022-08-06T00:00:00",
            "completed": true
          },
          {
            "id": "2adb0e10-b8dc-49ab-a876-2446f43eb621",
            "title": "Exam",
            "due_date": "2022-10-31T00:00:00",
            "completed": true
          },
          {
            "id": "5a0619f1-dfde-4801-b388-3de0bcb7270c",
            "title": "Exam",
            "due_date": "2022-09-02T00:00:00",
            "completed": false
          },
          {
            "id": "28798bda-02f2-4f9d-a6e9-a5053f8e6feb",
            "title": "Final",
            "due_date": "2022-08-07T00:00:00",
            "completed": false
          },
          {
            "id": "c5e0b358-7f10-451d-8b00-0742147164c9",
            "title": "Presentation",
            "due_date": "2022-10-05T00:00:00",
            "completed": false
          },
          {
            "id": "41cc643d-4dd9-47f5-81dd-45c419736adc",
            "title": "Presentation",
            "due_date": "2022-11-03T00:00:00",
            "completed": true
          },
          {
            "id": "8108e200-c3f9-47af-a643-03e7243c6930",
            "title": "Quiz",
            "due_date": "2022-10-10T00:00:00",
            "completed": true
          },
          {
            "id": "2b5a5d0f-6c00-4629-ad77-7898f971982d",
            "title": "Exam",
            "due_date": "2022-09-20T00:00:00",
            "completed": true
          },
          {
            "id": "a0c22549-b377-48b2-aa15-588d578c886e",
            "title": "Exam",
            "due_date": "2022-08-06T00:00:00",
            "completed": false
          },
          {
            "id": "ab70b2ce-e371-47b3-9293-89d11704b748",
            "title": "Reading",
            "due_date": "2022-09-08T00:00:00",
            "completed": true
          },
          {
            "id": "00914840-877a-403b-baec-48fc8091f0d5",
            "title": "Paper",
            "due_date": "2022-11-12T00:00:00",
            "completed": true
          },
          {
            "id": "5ff70ee3-66cd-454a-8a4d-73be66ab0a0c",
            "title": "Paper",
            "due_date": "2022-08-15T00:00:00",
            "completed": false
          },
          {
            "id": "0093f6a4-e580-4d49-ac32-573f645a2f2e",
            "title": "Exam",
            "due_date": "2022-11-21T00:00:00",
            "completed": false
          },
          {
            "id": "862fe2d6-1ec7-406e-bd10-050b609fa519",
            "title": "Test",
            "due_date": "2022-10-26T00:00:00",
            "completed": false
          },
          {
            "id": "596caaf2-343c-46d7-a08d-c95018baa34e",
            "title": "Lab",
            "due_date": "2022-08-27T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "0b8f7943-ff5c-45c1-be1a-bd5f80206ddd",
        "grade": 91.98
      },
      {
        "id": "80c63bc9-471a-4507-b93d-db46c882fa8d",
        "title": "Intensive Elementary Latin II",
        "credit_hours": 3,
        "short_id": "LATN 2060",
        "description": "Completion of the study of Latin grammar and syntax begun in Intensive Elementary Latin I, with continuation of reading and translation.",
        "assignments": [
          {
            "id": "4bc6a0f9-28d5-42ee-8e24-def46df4013a",
            "title": "Discussion",
            "due_date": "2023-01-27T00:00:00",
            "completed": true
          },
          {
            "id": "1c53ba83-5ffe-4754-9aae-0f8c23963bdc",
            "title": "Quiz",
            "due_date": "2023-01-12T00:00:00",
            "completed": false
          },
          {
            "id": "42885549-f0f9-4ae3-b6f9-26cf93c2b2ce",
            "title": "Exam",
            "due_date": "2023-01-30T00:00:00",
            "completed": true
          },
          {
            "id": "d571d75e-08b5-4a97-99e0-d918a00626e4",
            "title": "Quiz",
            "due_date": "2023-02-04T00:00:00",
            "completed": true
          },
          {
            "id": "bcebaed5-7827-4214-8407-208240060909",
            "title": "Essay",
            "due_date": "2023-01-30T00:00:00",
            "completed": false
          },
          {
            "id": "086f3a51-cc8b-427b-ba05-eb1fbc41a0e1",
            "title": "Discussion",
            "due_date": "2023-03-29T00:00:00",
            "completed": false
          },
          {
            "id": "2ee14d0c-bfcc-472b-9e98-2fed221294b9",
            "title": "Project",
            "due_date": "2023-04-06T00:00:00",
            "completed": false
          },
          {
            "id": "c1d8ed17-faf0-4477-9063-11bb4cc568fd",
            "title": "Test",
            "due_date": "2023-02-06T00:00:00",
            "completed": false
          },
          {
            "id": "1e426437-e4bb-4b09-92a7-8ae2289546ea",
            "title": "Reading",
            "due_date": "2023-02-20T00:00:00",
            "completed": true
          },
          {
            "id": "fb6c76ed-384b-47ca-a61e-246b5c32484a",
            "title": "Quiz",
            "due_date": "2023-04-13T00:00:00",
            "completed": true
          },
          {
            "id": "4db5c5c8-9c7e-46ca-85d6-d4d0d2ac760e",
            "title": "Reading",
            "due_date": "2023-04-18T00:00:00",
            "completed": false
          },
          {
            "id": "e7730625-5d81-4bf8-81c2-05eabbb025b8",
            "title": "Reading",
            "due_date": "2023-03-07T00:00:00",
            "completed": true
          },
          {
            "id": "415d3c92-6f7b-4325-aba1-3c5f0b644cfe",
            "title": "Lab",
            "due_date": "2023-04-26T00:00:00",
            "completed": false
          },
          {
            "id": "165b7ad7-dfd8-45a9-add9-28d8a5d78ae5",
            "title": "Essay",
            "due_date": "2023-03-01T00:00:00",
            "completed": true
          },
          {
            "id": "07c9eb4c-c611-48db-b2a3-f06fd781f125",
            "title": "Test",
            "due_date": "2023-03-27T00:00:00",
            "completed": true
          },
          {
            "id": "a4a40250-6bbf-481c-86ba-9e24a54f577d",
            "title": "Discussion",
            "due_date": "2023-03-23T00:00:00",
            "completed": false
          },
          {
            "id": "3f1a62c7-ca49-4f65-bab5-8bcfd619098b",
            "title": "Quiz",
            "due_date": "2023-02-25T00:00:00",
            "completed": false
          },
          {
            "id": "dd6aabe8-ca83-4039-98fc-cb69b0454d9a",
            "title": "Homework",
            "due_date": "2023-01-18T00:00:00",
            "completed": false
          },
          {
            "id": "ae358539-9ffb-4994-aea5-b46e73dd7e68",
            "title": "Presentation",
            "due_date": "2023-03-29T00:00:00",
            "completed": true
          },
          {
            "id": "8709308a-0592-486f-9eca-daaac61b5c10",
            "title": "Discussion",
            "due_date": "2023-02-09T00:00:00",
            "completed": false
          },
          {
            "id": "b619428b-24f4-4738-8dad-44cfc43076e2",
            "title": "Paper",
            "due_date": "2023-04-14T00:00:00",
            "completed": false
          },
          {
            "id": "dbbd8756-ef9b-4d50-89e8-414c9d6398e7",
            "title": "Discussion",
            "due_date": "2023-04-15T00:00:00",
            "completed": true
          },
          {
            "id": "04885ba5-2edb-4877-b24f-821b586f84a6",
            "title": "Homework",
            "due_date": "2023-02-05T00:00:00",
            "completed": true
          },
          {
            "id": "e4230a77-9067-4df2-9a48-1a67a22f12b6",
            "title": "Final",
            "due_date": "2023-01-23T00:00:00",
            "completed": true
          },
          {
            "id": "fa9afacb-f92c-42ca-89cc-1fe9a6c957b8",
            "title": "Quiz",
            "due_date": "2023-04-11T00:00:00",
            "completed": true
          },
          {
            "id": "3f89ad9f-b9ce-4b8a-9874-5655c58c4cf8",
            "title": "Reading",
            "due_date": "2023-03-21T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "c56d16a5-e015-4ecd-a4ac-85e1f75aa374",
        "grade": 93.39
      },
      {
        "id": "03380466-bd9c-4ec9-ba4e-9d3f08c47f12",
        "title": "Calculus for Economics",
        "credit_hours": 3,
        "short_id": "MATH 2110",
        "description": "Topics specifically chosen to meet the needs of the student of economics: the definite integral, functions of several variables, partial derivatives, Lagrange multipliers, and matrices.",
        "assignments": [
          {
            "id": "e280bddb-44d5-4bbe-84da-3d135ec41db2",
            "title": "Discussion",
            "due_date": "2023-04-12T00:00:00",
            "completed": false
          },
          {
            "id": "c828655f-e083-4952-9485-e1984b464e4e",
            "title": "Project",
            "due_date": "2023-01-24T00:00:00",
            "completed": false
          },
          {
            "id": "e4bdd26c-6a83-4695-a877-27b8666f6245",
            "title": "Test",
            "due_date": "2023-01-21T00:00:00",
            "completed": true
          },
          {
            "id": "a2a94a3e-2907-4658-a852-3d584489cbd9",
            "title": "Paper",
            "due_date": "2023-03-25T00:00:00",
            "completed": true
          },
          {
            "id": "b5f79416-e9cb-47cb-8553-da42e48a9fb1",
            "title": "Reading",
            "due_date": "2023-03-20T00:00:00",
            "completed": true
          },
          {
            "id": "b99e0e46-12b6-4faf-9a00-c14aa829959e",
            "title": "Quiz",
            "due_date": "2023-01-10T00:00:00",
            "completed": true
          },
          {
            "id": "ef3c1163-a6bf-4b42-a3d3-70e6926cae8b",
            "title": "Reading",
            "due_date": "2023-03-14T00:00:00",
            "completed": false
          },
          {
            "id": "b2ae502e-59fa-4792-a7fc-b326fd4b2c5a",
            "title": "Lab",
            "due_date": "2023-04-07T00:00:00",
            "completed": false
          },
          {
            "id": "63d8396f-6bfe-42d1-9783-cb93086c9b6f",
            "title": "Paper",
            "due_date": "2023-02-25T00:00:00",
            "completed": false
          },
          {
            "id": "f2885740-085f-4e9e-a040-bbf6df9218ed",
            "title": "Exam",
            "due_date": "2023-03-02T00:00:00",
            "completed": true
          },
          {
            "id": "4c15c951-6b28-4eaf-8ad2-0ed1a5ba79ec",
            "title": "Final",
            "due_date": "2023-04-27T00:00:00",
            "completed": false
          },
          {
            "id": "4b775d20-bda1-473a-9a72-49b58ce84583",
            "title": "Final",
            "due_date": "2023-04-20T00:00:00",
            "completed": true
          },
          {
            "id": "528dac48-aa81-4ebb-9d59-b28127eeafc9",
            "title": "Discussion",
            "due_date": "2023-03-10T00:00:00",
            "completed": false
          },
          {
            "id": "322bbe16-31c9-4d39-ac97-fe576a4e3c28",
            "title": "Quiz",
            "due_date": "2023-02-19T00:00:00",
            "completed": false
          },
          {
            "id": "351e8f17-963c-46fc-9534-a575f6db50ea",
            "title": "Paper",
            "due_date": "2023-03-23T00:00:00",
            "completed": true
          },
          {
            "id": "ce0b01bf-e4a6-43b7-962c-1b40b15a769c",
            "title": "Lab",
            "due_date": "2023-03-19T00:00:00",
            "completed": true
          },
          {
            "id": "cf537b70-461d-4f0d-889f-ec68f899e703",
            "title": "Reading",
            "due_date": "2023-02-15T00:00:00",
            "completed": true
          },
          {
            "id": "4fc6af73-9646-469e-9b5e-450e71e202f4",
            "title": "Paper",
            "due_date": "2023-01-26T00:00:00",
            "completed": false
          },
          {
            "id": "6bebb431-a42e-4d6b-90d2-74fabdb9a15b",
            "title": "Exam",
            "due_date": "2023-01-21T00:00:00",
            "completed": false
          },
          {
            "id": "565780a0-327e-4e89-b174-4538769ebc3c",
            "title": "Project",
            "due_date": "2023-01-26T00:00:00",
            "completed": false
          },
          {
            "id": "10044757-2921-457a-8e4a-3b65ef216f14",
            "title": "Essay",
            "due_date": "2023-02-20T00:00:00",
            "completed": true
          },
          {
            "id": "ab7c5bf9-73d2-4748-b64a-4ef060e59dc9",
            "title": "Exam",
            "due_date": "2023-03-17T00:00:00",
            "completed": false
          },
          {
            "id": "0d9874eb-006b-41d4-b7e8-5298ddf858a1",
            "title": "Homework",
            "due_date": "2023-02-23T00:00:00",
            "completed": true
          },
          {
            "id": "fec34ee2-5cb3-4d6c-b5d6-3db394fee7aa",
            "title": "Exam",
            "due_date": "2023-01-11T00:00:00",
            "completed": true
          },
          {
            "id": "100ddc64-9b84-4411-92fd-fd7953d99316",
            "title": "Final",
            "due_date": "2023-02-13T00:00:00",
            "completed": true
          },
          {
            "id": "7f039a9d-42cf-4678-8c6c-c638f18ca527",
            "title": "Reading",
            "due_date": "2023-03-14T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "c56d16a5-e015-4ecd-a4ac-85e1f75aa374",
        "grade": 99.11
      },
      {
        "id": "d0481380-86b9-4e62-a75d-232198b5ff8e",
        "title": "Analytic Geometry and Calculus",
        "credit_hours": 4,
        "short_id": "MATH 2200",
        "description": "Introductory differential calculus and its applications. Topics include limits, continuity, differentiability, derivatives of trigonometric, exponential and logarithmic functions, optimization, curve sketching, antiderivatives, differential equations, and applications.",
        "assignments": [
          {
            "id": "4341f205-292b-41ad-9f75-f12096bb9dca",
            "title": "Lab",
            "due_date": "2023-02-18T00:00:00",
            "completed": true
          },
          {
            "id": "88a91395-f716-4b8e-81ac-0db94bd9152a",
            "title": "Test",
            "due_date": "2023-04-09T00:00:00",
            "completed": true
          },
          {
            "id": "558cc1dd-85a1-4862-b81d-fe4a90400ef7",
            "title": "Essay",
            "due_date": "2023-01-15T00:00:00",
            "completed": true
          },
          {
            "id": "c6b7b072-4f1b-48e2-b5bd-c993bde912c6",
            "title": "Homework",
            "due_date": "2023-01-22T00:00:00",
            "completed": false
          },
          {
            "id": "2b251969-0eea-48c8-9358-695121ce349c",
            "title": "Final",
            "due_date": "2023-02-20T00:00:00",
            "completed": true
          },
          {
            "id": "488f5304-e609-4d77-9cf6-d7679d01364f",
            "title": "Homework",
            "due_date": "2023-03-27T00:00:00",
            "completed": true
          },
          {
            "id": "2329e4b8-6c9a-4591-97d9-ff8586746b8c",
            "title": "Exam",
            "due_date": "2023-02-07T00:00:00",
            "completed": true
          },
          {
            "id": "7cfe786e-2868-4d76-aa70-adc99e6c4c6e",
            "title": "Test",
            "due_date": "2023-04-05T00:00:00",
            "completed": true
          },
          {
            "id": "598ff579-5eb0-42fa-be36-134508a6c9c4",
            "title": "Quiz",
            "due_date": "2023-02-14T00:00:00",
            "completed": false
          },
          {
            "id": "c5bab7bc-0333-4787-9964-23d3c47c6455",
            "title": "Test",
            "due_date": "2023-03-18T00:00:00",
            "completed": true
          },
          {
            "id": "04c06787-d2e0-409d-9d07-de9993fccb4b",
            "title": "Final",
            "due_date": "2023-01-24T00:00:00",
            "completed": false
          },
          {
            "id": "e0907c13-6265-4a1c-9113-7212e57aaf10",
            "title": "Homework",
            "due_date": "2023-04-25T00:00:00",
            "completed": false
          },
          {
            "id": "8f69db61-a8bb-4d0f-b7f4-c7c9930e18db",
            "title": "Paper",
            "due_date": "2023-03-04T00:00:00",
            "completed": true
          },
          {
            "id": "20080aa0-8eab-4e3e-839a-ac0c74827af4",
            "title": "Reading",
            "due_date": "2023-01-19T00:00:00",
            "completed": false
          },
          {
            "id": "55771ee3-84b4-486c-9ca7-07bc6ec5c0be",
            "title": "Final",
            "due_date": "2023-01-06T00:00:00",
            "completed": true
          },
          {
            "id": "b269e2d4-d7eb-4b39-b895-9c1463e236a6",
            "title": "Lab",
            "due_date": "2023-02-09T00:00:00",
            "completed": true
          },
          {
            "id": "9de09a3f-0382-4d84-b4d4-0c0f49610b85",
            "title": "Project",
            "due_date": "2023-01-27T00:00:00",
            "completed": true
          },
          {
            "id": "67b04c50-8c2e-4098-bfd0-bf28db369817",
            "title": "Lab",
            "due_date": "2023-03-27T00:00:00",
            "completed": true
          },
          {
            "id": "38a51805-fcc7-41fa-a68f-640c73c0574e",
            "title": "Paper",
            "due_date": "2023-04-10T00:00:00",
            "completed": true
          },
          {
            "id": "686346e5-e429-449b-b368-3bb0bdb7b900",
            "title": "Final",
            "due_date": "2023-03-22T00:00:00",
            "completed": false
          },
          {
            "id": "9263ddc8-b243-4bc5-b737-08226a2412b4",
            "title": "Reading",
            "due_date": "2023-01-07T00:00:00",
            "completed": true
          },
          {
            "id": "9f08a0e0-8fa0-4fd3-90ec-280cb42cf5b4",
            "title": "Lab",
            "due_date": "2023-04-17T00:00:00",
            "completed": true
          },
          {
            "id": "6a79312c-5b87-4332-90bd-767c9690c65e",
            "title": "Lab",
            "due_date": "2023-02-18T00:00:00",
            "completed": false
          },
          {
            "id": "d5e60979-53c9-4e5d-90b5-893e26b26d1b",
            "title": "Test",
            "due_date": "2023-04-12T00:00:00",
            "completed": true
          },
          {
            "id": "9b8c14d3-b789-4f2a-9703-434443aa97f9",
            "title": "Exam",
            "due_date": "2023-01-26T00:00:00",
            "completed": true
          },
          {
            "id": "c8215d22-e75c-42c2-a836-247f8548a8d8",
            "title": "Project",
            "due_date": "2023-01-19T00:00:00",
            "completed": true
          },
          {
            "id": "1601669f-e2b4-4290-a1b9-ef4f3ebdd4c5",
            "title": "Project",
            "due_date": "2023-01-22T00:00:00",
            "completed": true
          },
          {
            "id": "c333f2f1-43e0-4124-b47f-802028321d2d",
            "title": "Exam",
            "due_date": "2023-03-29T00:00:00",
            "completed": true
          },
          {
            "id": "59936e3a-e9d7-4ce3-a75f-c6b04e1be225",
            "title": "Paper",
            "due_date": "2023-02-18T00:00:00",
            "completed": true
          },
          {
            "id": "3963c3c8-f14d-43b9-b47d-dc63fcf45c10",
            "title": "Presentation",
            "due_date": "2023-01-20T00:00:00",
            "completed": false
          },
          {
            "id": "e5218212-3e2d-41ff-a960-f75ebfc0d1c5",
            "title": "Essay",
            "due_date": "2023-03-08T00:00:00",
            "completed": false
          },
          {
            "id": "4b1e43ad-17ca-41df-ae04-ec5e867d35dd",
            "title": "Quiz",
            "due_date": "2023-04-10T00:00:00",
            "completed": true
          },
          {
            "id": "8909776a-e404-4bd4-bcb2-b3fe3fd156ec",
            "title": "Project",
            "due_date": "2023-03-25T00:00:00",
            "completed": true
          },
          {
            "id": "8404eb6c-067c-4ee0-8af2-924085df6d44",
            "title": "Exam",
            "due_date": "2023-02-12T00:00:00",
            "completed": true
          },
          {
            "id": "e988d1d8-702c-4462-90f1-eb24bce1288e",
            "title": "Test",
            "due_date": "2023-04-03T00:00:00",
            "completed": false
          },
          {
            "id": "1b906dab-1a44-4dff-b74d-490c15ea9328",
            "title": "Paper",
            "due_date": "2023-02-13T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "c56d16a5-e015-4ecd-a4ac-85e1f75aa374",
        "grade": 99.84
      },
      {
        "id": "aec426f6-a5be-4a14-b108-74e32ab4161a",
        "title": "Calculus I for Science and Engineering",
        "credit_hours": 4,
        "short_id": "MATH 2250",
        "description": "Students will use the derivative to understand the behavior of functions and will discuss the limit, the derivative, and the antiderivative, both conceptually and computationally, culminating in the Fundamental Theorem of Calculus. Students will use calculus concepts to model and solve problems in science and engineering, with emphasis on graphs, optimization, and basic integration.",
        "assignments": [
          {
            "id": "7bec11f3-384a-4a2f-9a77-ab201cee8a84",
            "title": "Presentation",
            "due_date": "2023-03-26T00:00:00",
            "completed": false
          },
          {
            "id": "672294a2-a65a-42d1-b1d0-c95fc4fdf11b",
            "title": "Discussion",
            "due_date": "2023-04-12T00:00:00",
            "completed": false
          },
          {
            "id": "363d554a-8e71-4c3f-9c9c-ca22808706d8",
            "title": "Discussion",
            "due_date": "2023-03-09T00:00:00",
            "completed": true
          },
          {
            "id": "44477423-2fe4-4374-9447-b54e9c2908e9",
            "title": "Test",
            "due_date": "2023-03-03T00:00:00",
            "completed": true
          },
          {
            "id": "21be7c10-25ab-4d1c-a9c8-df37a87723f5",
            "title": "Essay",
            "due_date": "2023-03-17T00:00:00",
            "completed": true
          },
          {
            "id": "a773ca13-06cd-49ce-b27f-15cda6c59d72",
            "title": "Project",
            "due_date": "2023-02-19T00:00:00",
            "completed": false
          },
          {
            "id": "b6c03216-41ba-4372-9520-ca5cae8c8616",
            "title": "Presentation",
            "due_date": "2023-03-31T00:00:00",
            "completed": false
          },
          {
            "id": "a52048ad-a3b4-4bda-bb35-6e764df781d3",
            "title": "Presentation",
            "due_date": "2023-04-04T00:00:00",
            "completed": true
          },
          {
            "id": "f0d2f88d-afa4-4411-ab1c-583f39c0b349",
            "title": "Quiz",
            "due_date": "2023-01-15T00:00:00",
            "completed": false
          },
          {
            "id": "bf48417a-f4dd-4e4a-99fd-5426ca0f2635",
            "title": "Lab",
            "due_date": "2023-01-26T00:00:00",
            "completed": true
          },
          {
            "id": "8c5f80a3-6a37-44bd-86a1-abe40abc19b1",
            "title": "Exam",
            "due_date": "2023-01-30T00:00:00",
            "completed": true
          },
          {
            "id": "7753ee3f-6ef4-495d-a5aa-8ed63e0c473d",
            "title": "Lab",
            "due_date": "2023-02-27T00:00:00",
            "completed": false
          },
          {
            "id": "bec9bfad-e2e7-49f8-bc24-516f03378962",
            "title": "Test",
            "due_date": "2023-02-01T00:00:00",
            "completed": true
          },
          {
            "id": "04403ae1-bf9a-4f1e-86aa-8a48b94226c0",
            "title": "Discussion",
            "due_date": "2023-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "74a203eb-0fc0-4ceb-a6e7-20832a05961c",
            "title": "Test",
            "due_date": "2023-03-31T00:00:00",
            "completed": false
          },
          {
            "id": "45120253-ef64-4b0b-b78f-e5df88395a6b",
            "title": "Exam",
            "due_date": "2023-03-29T00:00:00",
            "completed": true
          },
          {
            "id": "4c104b3d-777e-4e1b-a073-27de46507e24",
            "title": "Reading",
            "due_date": "2023-03-07T00:00:00",
            "completed": false
          },
          {
            "id": "4361af48-b2c4-4ebb-ab87-30c2f723e3c1",
            "title": "Discussion",
            "due_date": "2023-02-08T00:00:00",
            "completed": false
          },
          {
            "id": "f928628b-918f-466e-a94d-6bb7485d1884",
            "title": "Lab",
            "due_date": "2023-04-13T00:00:00",
            "completed": false
          },
          {
            "id": "2affc116-04e5-4079-a8ae-3d0fc3771e10",
            "title": "Reading",
            "due_date": "2023-03-31T00:00:00",
            "completed": true
          },
          {
            "id": "876b6072-677c-43ee-a343-c5eb7740736b",
            "title": "Test",
            "due_date": "2023-02-24T00:00:00",
            "completed": true
          },
          {
            "id": "031b0908-ba11-4a7d-b965-2f2e340e13b0",
            "title": "Test",
            "due_date": "2023-01-22T00:00:00",
            "completed": true
          },
          {
            "id": "4ddd54cd-4af2-4e00-9dde-de77c84198c2",
            "title": "Project",
            "due_date": "2023-02-08T00:00:00",
            "completed": false
          },
          {
            "id": "13275221-c076-472e-bb10-c41e2a872e80",
            "title": "Reading",
            "due_date": "2023-03-03T00:00:00",
            "completed": false
          },
          {
            "id": "3dff5b35-a3f5-4bc1-8b11-69d2c043bf0a",
            "title": "Test",
            "due_date": "2023-01-31T00:00:00",
            "completed": true
          },
          {
            "id": "7d50a737-2af5-47b5-809f-64d6d3ce2333",
            "title": "Paper",
            "due_date": "2023-04-25T00:00:00",
            "completed": true
          },
          {
            "id": "b4f843b1-9fd1-4c1c-aadd-65722f9c99eb",
            "title": "Lab",
            "due_date": "2023-04-26T00:00:00",
            "completed": true
          },
          {
            "id": "05660c4f-0aa2-4765-b129-ac20896068e6",
            "title": "Lab",
            "due_date": "2023-02-16T00:00:00",
            "completed": false
          },
          {
            "id": "44ae9f45-6835-4c7d-8510-2194461d4383",
            "title": "Essay",
            "due_date": "2023-02-27T00:00:00",
            "completed": true
          },
          {
            "id": "69af2c83-1fdf-47dd-b348-8597660ade64",
            "title": "Quiz",
            "due_date": "2023-03-26T00:00:00",
            "completed": true
          },
          {
            "id": "bc2e2b6b-c158-4e22-b3e0-3377d94dc1bb",
            "title": "Discussion",
            "due_date": "2023-04-01T00:00:00",
            "completed": true
          },
          {
            "id": "fbef4722-5cc9-4a3a-9dd5-cfe521fe26be",
            "title": "Test",
            "due_date": "2023-01-08T00:00:00",
            "completed": true
          },
          {
            "id": "d4e1d16c-402b-4a33-9474-80420dc9539f",
            "title": "Homework",
            "due_date": "2023-01-15T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "c56d16a5-e015-4ecd-a4ac-85e1f75aa374",
        "grade": 96.36
      },
      {
        "id": "cff4df2d-fc3b-4886-b8e9-b777e249dc00",
        "title": "Special Topics in Integral Calculus",
        "credit_hours": 4,
        "short_id": "MATH 2255",
        "description": "A review of basic algebra, precalculus, and differential calculus concepts that are needed for topics such as techniques and interpretation of integration and sequences and series in Calculus II. The course includes strategies for problem-solving in the context of Calculus II problems.",
        "assignments": [
          {
            "id": "65b5359b-d340-44a8-b236-ce1755f2b252",
            "title": "Final",
            "due_date": "2023-02-10T00:00:00",
            "completed": true
          },
          {
            "id": "720d8ed5-0751-42a8-9046-c913fe3634bb",
            "title": "Exam",
            "due_date": "2023-04-10T00:00:00",
            "completed": false
          },
          {
            "id": "dcb4dfc2-b95a-4030-b5b3-684f03ec7df6",
            "title": "Reading",
            "due_date": "2023-02-16T00:00:00",
            "completed": false
          },
          {
            "id": "ca06b579-3313-46fc-9f27-c740bcc004cf",
            "title": "Presentation",
            "due_date": "2023-01-07T00:00:00",
            "completed": true
          },
          {
            "id": "ef543ab0-d87d-4710-9b19-36395a4b49b0",
            "title": "Quiz",
            "due_date": "2023-03-24T00:00:00",
            "completed": true
          },
          {
            "id": "c561c1a8-50e9-40fc-a28d-50a85bc4c266",
            "title": "Exam",
            "due_date": "2023-03-24T00:00:00",
            "completed": false
          },
          {
            "id": "33440327-2b9e-4268-8b2c-1ff5f6824c70",
            "title": "Homework",
            "due_date": "2023-04-14T00:00:00",
            "completed": false
          },
          {
            "id": "6ad4061d-ea28-4cfb-96be-55e1a3b97f93",
            "title": "Lab",
            "due_date": "2023-02-11T00:00:00",
            "completed": true
          },
          {
            "id": "75d0412c-a54e-48b8-b10d-1190ef7315ee",
            "title": "Homework",
            "due_date": "2023-04-21T00:00:00",
            "completed": false
          },
          {
            "id": "e4698601-85d5-4f67-afd9-5dda775dad27",
            "title": "Final",
            "due_date": "2023-04-11T00:00:00",
            "completed": false
          },
          {
            "id": "3b5d8669-d941-4703-80b7-936ec05d4c2f",
            "title": "Homework",
            "due_date": "2023-01-15T00:00:00",
            "completed": false
          },
          {
            "id": "9e2f9490-da50-486c-8622-2d5bbee0e986",
            "title": "Final",
            "due_date": "2023-03-25T00:00:00",
            "completed": true
          },
          {
            "id": "2a065726-e5df-4088-b585-bcd88c1e8db0",
            "title": "Lab",
            "due_date": "2023-02-07T00:00:00",
            "completed": true
          },
          {
            "id": "32c0e0ca-7d9a-49c9-bea9-a2b84fc1f652",
            "title": "Lab",
            "due_date": "2023-02-02T00:00:00",
            "completed": false
          },
          {
            "id": "34887a35-d124-4ab7-a875-670e2bab4a61",
            "title": "Essay",
            "due_date": "2023-01-07T00:00:00",
            "completed": true
          },
          {
            "id": "43f33f3f-0b99-49c3-b392-cf970f677e26",
            "title": "Homework",
            "due_date": "2023-01-09T00:00:00",
            "completed": true
          },
          {
            "id": "5a77f9c6-7d18-4356-818c-43451a7e673a",
            "title": "Paper",
            "due_date": "2023-03-12T00:00:00",
            "completed": false
          },
          {
            "id": "a65fd5e1-111f-4b6b-86d3-d8d6d4a465c1",
            "title": "Homework",
            "due_date": "2023-02-22T00:00:00",
            "completed": true
          },
          {
            "id": "213d0254-18e5-49e7-ab69-e3af977e135e",
            "title": "Test",
            "due_date": "2023-04-08T00:00:00",
            "completed": false
          },
          {
            "id": "6446a461-151f-449f-9019-48c0807f7438",
            "title": "Final",
            "due_date": "2023-04-14T00:00:00",
            "completed": true
          },
          {
            "id": "cc3a12ba-79ff-423b-bd90-1937639c3a33",
            "title": "Reading",
            "due_date": "2023-04-03T00:00:00",
            "completed": true
          },
          {
            "id": "d0f9f039-4ec1-4094-98bc-6a8ad76ea25a",
            "title": "Presentation",
            "due_date": "2023-03-09T00:00:00",
            "completed": true
          },
          {
            "id": "8a3692ba-a769-4964-a53b-43cde4bd4d44",
            "title": "Test",
            "due_date": "2023-04-22T00:00:00",
            "completed": true
          },
          {
            "id": "d88fec7c-b7c3-450b-b5bc-f22e27e52a09",
            "title": "Test",
            "due_date": "2023-01-19T00:00:00",
            "completed": true
          },
          {
            "id": "ec3c9b41-43cd-44b7-99db-4092e8fe2a83",
            "title": "Test",
            "due_date": "2023-04-20T00:00:00",
            "completed": true
          },
          {
            "id": "a0778407-9f14-449b-9e6c-388fd9660939",
            "title": "Final",
            "due_date": "2023-03-30T00:00:00",
            "completed": false
          },
          {
            "id": "84f5b492-0905-47f3-838e-0ef7bc39bbc0",
            "title": "Final",
            "due_date": "2023-02-27T00:00:00",
            "completed": true
          },
          {
            "id": "2efe1ca1-4b8a-4989-8e7d-5c135413719b",
            "title": "Project",
            "due_date": "2023-02-07T00:00:00",
            "completed": true
          },
          {
            "id": "8a8c293f-3bec-4793-a5bf-c8171ecec7a1",
            "title": "Final",
            "due_date": "2023-03-23T00:00:00",
            "completed": false
          },
          {
            "id": "4cf0f8de-01ad-4afe-98a6-0252b5d71d86",
            "title": "Paper",
            "due_date": "2023-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "dacd7b87-56c7-4a73-b8a4-4fc9f90c6edb",
            "title": "Quiz",
            "due_date": "2023-02-26T00:00:00",
            "completed": true
          },
          {
            "id": "7c9e83ff-e154-431d-92f4-6cbe3e8665c0",
            "title": "Lab",
            "due_date": "2023-03-29T00:00:00",
            "completed": true
          },
          {
            "id": "c09ca856-94a9-434a-a378-36eb8e99872a",
            "title": "Final",
            "due_date": "2023-03-31T00:00:00",
            "completed": true
          },
          {
            "id": "4a0c9493-4f09-453f-a971-ba733d9d5f07",
            "title": "Exam",
            "due_date": "2023-04-14T00:00:00",
            "completed": true
          },
          {
            "id": "2964e832-e7f5-4c00-8ab7-49b47b18745b",
            "title": "Lab",
            "due_date": "2023-03-02T00:00:00",
            "completed": true
          },
          {
            "id": "7e402bb9-c6d0-4c35-8ef3-c6cf2ce785c0",
            "title": "Discussion",
            "due_date": "2023-03-26T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "c56d16a5-e015-4ecd-a4ac-85e1f75aa374",
        "grade": 97.89
      },
      {
        "id": "27d0d6ac-cd5c-40c6-9674-7d5a85962694",
        "title": "Calculus II for Science and Engineering",
        "credit_hours": 4,
        "short_id": "MATH 2260",
        "description": "Volumes, arclength, work, separable differential equations. Techniques of integration. Sequences and series, convergence tests, power series and Taylor series. Vectors in three-dimensional space, dot product, cross product, lines and planes.",
        "assignments": [
          {
            "id": "ff231d6f-388e-466d-815d-d4918f4073c8",
            "title": "Exam",
            "due_date": "2023-01-08T00:00:00",
            "completed": true
          },
          {
            "id": "1ef41d6c-a9c2-4a59-99aa-fc53bf878c28",
            "title": "Reading",
            "due_date": "2023-02-09T00:00:00",
            "completed": true
          },
          {
            "id": "2f503b46-9a7b-45a6-8808-80ee9de3e007",
            "title": "Homework",
            "due_date": "2023-03-02T00:00:00",
            "completed": true
          },
          {
            "id": "63bea48a-4c2b-40d8-8d94-fc3018bf6ed4",
            "title": "Discussion",
            "due_date": "2023-02-24T00:00:00",
            "completed": true
          },
          {
            "id": "69bef7ee-8c33-4cd0-a734-2befb9a7ac4c",
            "title": "Essay",
            "due_date": "2023-04-16T00:00:00",
            "completed": true
          },
          {
            "id": "bc38aa3f-85a6-4de8-9209-04acbe63b8ea",
            "title": "Quiz",
            "due_date": "2023-01-31T00:00:00",
            "completed": true
          },
          {
            "id": "f8eb9be6-dd7a-4e1a-9a2c-5d4433224c7a",
            "title": "Discussion",
            "due_date": "2023-02-20T00:00:00",
            "completed": true
          },
          {
            "id": "29d77699-454c-4dc9-b15d-68a7df8aa4d7",
            "title": "Project",
            "due_date": "2023-03-31T00:00:00",
            "completed": false
          },
          {
            "id": "0e17fd57-83d7-4d97-8993-a5cabb0a2e59",
            "title": "Test",
            "due_date": "2023-03-19T00:00:00",
            "completed": true
          },
          {
            "id": "8bbc66a4-badb-4b6b-ae80-d7776d2b00ba",
            "title": "Homework",
            "due_date": "2023-04-11T00:00:00",
            "completed": true
          },
          {
            "id": "26393abd-0351-4eee-a7a2-0bb8dbe9ee62",
            "title": "Reading",
            "due_date": "2023-02-27T00:00:00",
            "completed": true
          },
          {
            "id": "8ce009af-311b-4c24-9fbc-a4aa83aa2377",
            "title": "Project",
            "due_date": "2023-02-20T00:00:00",
            "completed": false
          },
          {
            "id": "1f18a6db-e6a8-4df9-9c3c-c7f1498c96ba",
            "title": "Final",
            "due_date": "2023-02-15T00:00:00",
            "completed": true
          },
          {
            "id": "1765ab6a-79da-47d1-90d9-5d9c3aa32d52",
            "title": "Lab",
            "due_date": "2023-01-29T00:00:00",
            "completed": true
          },
          {
            "id": "01543d3a-792a-4fad-b3f4-1f2359eaa3e0",
            "title": "Paper",
            "due_date": "2023-01-23T00:00:00",
            "completed": false
          },
          {
            "id": "f24fe74a-98ae-42e9-b1c3-78bcf474d59f",
            "title": "Project",
            "due_date": "2023-01-29T00:00:00",
            "completed": false
          },
          {
            "id": "95eca594-d499-453f-8ca6-88d13c7185cd",
            "title": "Final",
            "due_date": "2023-01-30T00:00:00",
            "completed": true
          },
          {
            "id": "44bdff05-2a86-4b6d-989d-d935e8992b87",
            "title": "Lab",
            "due_date": "2023-01-17T00:00:00",
            "completed": false
          },
          {
            "id": "b4796c30-b316-4dbc-abf8-db52c61df60e",
            "title": "Paper",
            "due_date": "2023-01-29T00:00:00",
            "completed": true
          },
          {
            "id": "80f49422-81ff-4f77-9ce6-33f4f1541ae3",
            "title": "Paper",
            "due_date": "2023-01-08T00:00:00",
            "completed": true
          },
          {
            "id": "1b491ef8-4937-4d21-b03b-a09387f57969",
            "title": "Final",
            "due_date": "2023-04-17T00:00:00",
            "completed": true
          },
          {
            "id": "f2e199ea-fbbc-46b6-a87b-b80c4589f10e",
            "title": "Project",
            "due_date": "2023-04-25T00:00:00",
            "completed": true
          },
          {
            "id": "bbcf3d62-b723-49ad-9fe6-d59f4515c844",
            "title": "Lab",
            "due_date": "2023-02-16T00:00:00",
            "completed": true
          },
          {
            "id": "98d9a6d6-9cdb-4e47-a123-eca5de8bf610",
            "title": "Discussion",
            "due_date": "2023-02-11T00:00:00",
            "completed": true
          },
          {
            "id": "aef10c39-ea8a-4ddd-acb5-b8e41d2adf5f",
            "title": "Test",
            "due_date": "2023-03-29T00:00:00",
            "completed": true
          },
          {
            "id": "bf237184-dc40-4843-99d9-91fa06fd876f",
            "title": "Reading",
            "due_date": "2023-02-25T00:00:00",
            "completed": false
          },
          {
            "id": "328166d9-2609-4e2d-83df-b633a9e9610c",
            "title": "Lab",
            "due_date": "2023-02-07T00:00:00",
            "completed": true
          },
          {
            "id": "ef497d58-6733-4b33-b270-884ed4c5a0a1",
            "title": "Quiz",
            "due_date": "2023-03-26T00:00:00",
            "completed": true
          },
          {
            "id": "850f5ccb-67c4-4d44-bdd8-da79734b2d9a",
            "title": "Discussion",
            "due_date": "2023-01-26T00:00:00",
            "completed": true
          },
          {
            "id": "28e1b085-8777-4103-a904-1eccfc5b8696",
            "title": "Discussion",
            "due_date": "2023-01-29T00:00:00",
            "completed": false
          },
          {
            "id": "dd8811f6-92f4-49d4-a276-9cbcb02c8064",
            "title": "Final",
            "due_date": "2023-01-12T00:00:00",
            "completed": true
          },
          {
            "id": "b587251d-9360-4dbd-be53-e76545fe54b3",
            "title": "Test",
            "due_date": "2023-03-09T00:00:00",
            "completed": false
          },
          {
            "id": "5cd14abc-c1d3-48fa-9658-790c9f0ec952",
            "title": "Homework",
            "due_date": "2023-02-12T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "c56d16a5-e015-4ecd-a4ac-85e1f75aa374",
        "grade": 93.8
      },
      {
        "id": "467b90e5-dffe-410d-95b0-7cc01f66b1e5",
        "title": "Calculus III for Science and Mathematics",
        "credit_hours": 4,
        "short_id": "MATH 2270",
        "description": "Calculus of functions of two and three variables: Parametric curves and applications to planetary motion. Derivatives, the gradient, Lagrange multipliers. Multiple integration, area, volume, and physical applications, polar, cylindrical, and spherical coordinates. Line and surface integrals, Green's, Stokes's, and Divergence theorems, with applications to physics.",
        "assignments": [
          {
            "id": "06c60f84-82d4-4146-b18f-2787e3f067bd",
            "title": "Lab",
            "due_date": "2023-07-15T00:00:00",
            "completed": true
          },
          {
            "id": "a67c0f2f-d91e-4343-ae67-9948a15f504d",
            "title": "Presentation",
            "due_date": "2023-07-08T00:00:00",
            "completed": false
          },
          {
            "id": "03c22976-5fd4-410c-88d9-0f398e235a49",
            "title": "Essay",
            "due_date": "2023-07-08T00:00:00",
            "completed": true
          },
          {
            "id": "d77f9352-5a27-4882-96c7-aefec5c10e26",
            "title": "Lab",
            "due_date": "2023-06-06T00:00:00",
            "completed": false
          },
          {
            "id": "29d884c3-b81a-4fad-98e6-637910afe1ba",
            "title": "Essay",
            "due_date": "2023-06-10T00:00:00",
            "completed": true
          },
          {
            "id": "c67ce640-615f-47b6-af10-d5d8d240a7a1",
            "title": "Project",
            "due_date": "2023-07-08T00:00:00",
            "completed": true
          },
          {
            "id": "3ed3c00c-71e9-4ad7-b3d6-9e0cee6141c2",
            "title": "Presentation",
            "due_date": "2023-06-27T00:00:00",
            "completed": true
          },
          {
            "id": "1a1f7e3f-3915-4cf5-959e-abfbeb7aa405",
            "title": "Test",
            "due_date": "2023-06-29T00:00:00",
            "completed": true
          },
          {
            "id": "06534cfa-b241-42cb-aa5a-4bcafd968927",
            "title": "Paper",
            "due_date": "2023-06-26T00:00:00",
            "completed": true
          },
          {
            "id": "4a19a758-2513-4581-87ec-f2cd323331d5",
            "title": "Reading",
            "due_date": "2023-06-14T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "c302ef63-8d03-4440-91fa-8cd3581b07b9",
        "grade": 98.39
      },
      {
        "id": "335d2e15-29fd-450d-b50b-2092a234630c",
        "title": "Differential Calculus with Theory",
        "credit_hours": 4,
        "short_id": "MATH 2400",
        "description": "A rigorous and extensive treatment of differential calculus. Topics include the real numbers, the least upper bound property, limits, continuity, differentiability, and applications.",
        "assignments": [
          {
            "id": "14ac82d8-9628-498d-92c2-b316a6d08491",
            "title": "Paper",
            "due_date": "2023-07-08T00:00:00",
            "completed": false
          },
          {
            "id": "c9d9ed44-2da5-4d13-9f72-bb8a25572a0d",
            "title": "Presentation",
            "due_date": "2023-06-16T00:00:00",
            "completed": true
          },
          {
            "id": "a0e3367e-5adb-4308-8475-58cea850a2f8",
            "title": "Exam",
            "due_date": "2023-07-16T00:00:00",
            "completed": true
          },
          {
            "id": "3430a5ca-a3b9-4107-b808-8a8d3ca54f37",
            "title": "Final",
            "due_date": "2023-06-07T00:00:00",
            "completed": false
          },
          {
            "id": "d7774aa1-1458-4f4c-8bf3-99cd50f9cea3",
            "title": "Presentation",
            "due_date": "2023-07-08T00:00:00",
            "completed": true
          },
          {
            "id": "d96c0c47-d181-4004-8bea-3d56d7f355a1",
            "title": "Presentation",
            "due_date": "2023-06-17T00:00:00",
            "completed": true
          },
          {
            "id": "0dfb9b55-0cfc-4d35-b72e-e8c26cf3386a",
            "title": "Essay",
            "due_date": "2023-07-17T00:00:00",
            "completed": true
          },
          {
            "id": "bf1d2baa-1c1d-4ff1-a0c9-5d48fe8ad54c",
            "title": "Test",
            "due_date": "2023-06-20T00:00:00",
            "completed": false
          },
          {
            "id": "b7d58abe-be7e-4184-ad55-7f1545f8bb14",
            "title": "Project",
            "due_date": "2023-06-11T00:00:00",
            "completed": true
          },
          {
            "id": "7b3a2750-3705-4c33-be27-f43883ec62e5",
            "title": "Test",
            "due_date": "2023-07-11T00:00:00",
            "completed": true
          }
        ],
        "connected_semester_id": "c302ef63-8d03-4440-91fa-8cd3581b07b9",
        "grade": 91.42
      },
      {
        "id": "c4432157-5224-4565-87bd-55109f319422",
        "title": "Integral Calculus with Theory",
        "credit_hours": 4,
        "short_id": "MATH 2410",
        "description": "A rigorous and extensive treatment of integral calculus. Topics include the Fundamental Theorem of calculus, applications of integration, logarithms and exponentials, Taylor polynomials, `sequences, series, and uniform convergence.",
        "assignments": [
          {
            "id": "eb1b21c0-5978-45cb-8465-59cde5f64d39",
            "title": "Quiz",
            "due_date": "2023-09-07T00:00:00",
            "completed": false
          },
          {
            "id": "d4f08bd7-9114-46a5-8954-6e4680027c2e",
            "title": "Lab",
            "due_date": "2023-11-15T00:00:00",
            "completed": false
          },
          {
            "id": "8cc56f64-7190-4ebc-b2df-9127a7267829",
            "title": "Essay",
            "due_date": "2023-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "0016015a-509a-4ac2-be6b-1e3757399e2d",
            "title": "Presentation",
            "due_date": "2023-10-19T00:00:00",
            "completed": false
          },
          {
            "id": "42bb78ae-7c5f-44e0-a7be-44b6eb360cdd",
            "title": "Test",
            "due_date": "2023-10-03T00:00:00",
            "completed": false
          },
          {
            "id": "8c09ca29-91ee-418d-a833-dfc68283c40c",
            "title": "Quiz",
            "due_date": "2023-10-05T00:00:00",
            "completed": false
          },
          {
            "id": "ef4bb437-d3b0-400b-9b80-12f17f7b363b",
            "title": "Quiz",
            "due_date": "2023-11-18T00:00:00",
            "completed": false
          },
          {
            "id": "971b7754-ee40-469c-bbd0-653349816401",
            "title": "Discussion",
            "due_date": "2023-11-18T00:00:00",
            "completed": false
          },
          {
            "id": "1c54a8a8-9ed3-49d0-ac5c-62fddf4d3957",
            "title": "Final",
            "due_date": "2023-09-03T00:00:00",
            "completed": false
          },
          {
            "id": "5357ed9c-1ce3-4250-8f7e-8ef7bc83f498",
            "title": "Discussion",
            "due_date": "2023-11-07T00:00:00",
            "completed": false
          },
          {
            "id": "cd649cad-6573-4856-b836-836490d235aa",
            "title": "Presentation",
            "due_date": "2023-09-12T00:00:00",
            "completed": false
          },
          {
            "id": "9960f57e-6934-49d4-b9b1-45ee120c3427",
            "title": "Discussion",
            "due_date": "2023-09-30T00:00:00",
            "completed": false
          },
          {
            "id": "ea1ff037-af8b-4dac-8477-592b6ca3610e",
            "title": "Discussion",
            "due_date": "2023-11-08T00:00:00",
            "completed": false
          },
          {
            "id": "9455c64b-0fef-40d5-ac69-04700aeba66f",
            "title": "Test",
            "due_date": "2023-09-19T00:00:00",
            "completed": false
          },
          {
            "id": "f2448b2c-157c-4ea7-bafd-d1322ce63a15",
            "title": "Paper",
            "due_date": "2023-10-06T00:00:00",
            "completed": false
          },
          {
            "id": "4ac7e9f8-5645-4505-bcb6-590c01d4cf4a",
            "title": "Quiz",
            "due_date": "2023-09-29T00:00:00",
            "completed": false
          },
          {
            "id": "72f97639-3066-42de-96ad-653f7b8e3778",
            "title": "Project",
            "due_date": "2023-11-14T00:00:00",
            "completed": false
          },
          {
            "id": "7c1dcc56-15d8-4477-9438-9276f63b43d7",
            "title": "Project",
            "due_date": "2023-10-06T00:00:00",
            "completed": false
          },
          {
            "id": "c25d19c3-c6e3-4486-b6c4-efbbd335bb15",
            "title": "Essay",
            "due_date": "2023-10-10T00:00:00",
            "completed": false
          },
          {
            "id": "8c9bf6ef-c32e-4a79-b119-f6ec5e88d7d8",
            "title": "Reading",
            "due_date": "2023-09-22T00:00:00",
            "completed": false
          },
          {
            "id": "f5764a49-0f1d-41e4-885e-dccd2cf43543",
            "title": "Lab",
            "due_date": "2023-11-15T00:00:00",
            "completed": false
          },
          {
            "id": "230ef6ca-71fd-4381-bf91-76134647c08b",
            "title": "Presentation",
            "due_date": "2023-09-23T00:00:00",
            "completed": false
          },
          {
            "id": "f5b20293-b464-4bb0-93c6-fe89caa1414d",
            "title": "Exam",
            "due_date": "2023-08-16T00:00:00",
            "completed": false
          },
          {
            "id": "d11b0b77-d707-4477-8122-dc0218bab8dd",
            "title": "Quiz",
            "due_date": "2023-11-04T00:00:00",
            "completed": false
          },
          {
            "id": "4c39a1d3-f52c-4682-8557-6f25d3415785",
            "title": "Lab",
            "due_date": "2023-09-03T00:00:00",
            "completed": false
          },
          {
            "id": "48680000-bc2b-45df-b63d-f52a4bb17a97",
            "title": "Project",
            "due_date": "2023-08-29T00:00:00",
            "completed": false
          },
          {
            "id": "1bc987f4-18b0-4276-8a6f-ee8915cf8b72",
            "title": "Paper",
            "due_date": "2023-09-05T00:00:00",
            "completed": false
          },
          {
            "id": "8794f98d-d993-4f0a-b13f-c7dbf73434bb",
            "title": "Test",
            "due_date": "2023-08-10T00:00:00",
            "completed": true
          },
          {
            "id": "ce1a7080-bb0d-487a-8ed9-94bc184da620",
            "title": "Final",
            "due_date": "2023-08-22T00:00:00",
            "completed": false
          },
          {
            "id": "57494338-a493-4621-a332-c3dc80b30fe7",
            "title": "Test",
            "due_date": "2023-11-05T00:00:00",
            "completed": false
          },
          {
            "id": "388c4a64-be22-4d50-8777-63dd6cd6bf8d",
            "title": "Presentation",
            "due_date": "2023-11-06T00:00:00",
            "completed": false
          },
          {
            "id": "23134cae-f5de-4b42-8f9a-67ceb1fc86bd",
            "title": "Project",
            "due_date": "2023-10-10T00:00:00",
            "completed": false
          },
          {
            "id": "b732b2e9-9f01-4cb8-a41d-3f18f833c3ee",
            "title": "Homework",
            "due_date": "2023-09-18T00:00:00",
            "completed": false
          },
          {
            "id": "3bf2e015-db79-437b-906c-10ec11663817",
            "title": "Project",
            "due_date": "2023-08-26T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "e7192159-1960-4961-b273-436bf9c561bb",
        "grade": 91.17
      },
      {
        "id": "e82ec8ad-2058-4568-aee0-2a5d5db1bd57",
        "title": "Accelerated Calculus III for Engineering Students",
        "credit_hours": 3,
        "short_id": "MATH 2500",
        "description": "Calculus of functions of two and three variables: Parametric curves, derivatives, gradient, Lagrange multipliers. Multiple integration, area, volume, polar, cylindrical, and spherical coordinates. Line integrals and Green's Theorem. Introduction to surface integrals and Stokes's and Divergence Theorems. This is an accelerated version of Calculus III for Science and Engineering that covers fewer topics and applications.",
        "assignments": [
          {
            "id": "04cdef3e-f77c-4647-9078-16e7d29ba243",
            "title": "Discussion",
            "due_date": "2023-09-07T00:00:00",
            "completed": false
          },
          {
            "id": "f8cd094c-07aa-4101-bfb0-a92a59bc97ea",
            "title": "Exam",
            "due_date": "2023-08-16T00:00:00",
            "completed": false
          },
          {
            "id": "3465cb32-c1e1-4ee7-9f02-0ba7ca2b89aa",
            "title": "Final",
            "due_date": "2023-09-12T00:00:00",
            "completed": false
          },
          {
            "id": "a452085e-3908-4c1a-93ab-0b4ffee51309",
            "title": "Project",
            "due_date": "2023-11-08T00:00:00",
            "completed": false
          },
          {
            "id": "9f295417-cec4-4cc2-956b-097ec6d05002",
            "title": "Final",
            "due_date": "2023-11-20T00:00:00",
            "completed": false
          },
          {
            "id": "e07bc1df-e2bc-4989-8882-b68c36547a44",
            "title": "Homework",
            "due_date": "2023-10-01T00:00:00",
            "completed": false
          },
          {
            "id": "13b394c4-a733-47ef-8ae5-3505a7439f76",
            "title": "Exam",
            "due_date": "2023-10-15T00:00:00",
            "completed": false
          },
          {
            "id": "67fbd806-f74b-45b9-bbb2-8b358cacaee3",
            "title": "Project",
            "due_date": "2023-10-25T00:00:00",
            "completed": false
          },
          {
            "id": "3a23c83f-b09f-41c1-b7ac-318b650d7c20",
            "title": "Essay",
            "due_date": "2023-11-19T00:00:00",
            "completed": false
          },
          {
            "id": "ec799b61-e45e-4d80-83ae-1c42adb07b8b",
            "title": "Presentation",
            "due_date": "2023-08-31T00:00:00",
            "completed": false
          },
          {
            "id": "f01f5505-fd55-46c8-bc19-ed558e043b60",
            "title": "Exam",
            "due_date": "2023-08-30T00:00:00",
            "completed": false
          },
          {
            "id": "5527e685-2177-4c21-9fd5-838bf1ad2ee4",
            "title": "Project",
            "due_date": "2023-10-14T00:00:00",
            "completed": false
          },
          {
            "id": "7db32378-9023-4c33-80a7-42aac911fe90",
            "title": "Paper",
            "due_date": "2023-10-23T00:00:00",
            "completed": false
          },
          {
            "id": "33e65a7a-f534-45ce-a512-4580e26a1ac2",
            "title": "Discussion",
            "due_date": "2023-09-10T00:00:00",
            "completed": false
          },
          {
            "id": "23cf8c64-3493-4cf1-88da-9411c2fd14ab",
            "title": "Final",
            "due_date": "2023-10-13T00:00:00",
            "completed": false
          },
          {
            "id": "adc0c576-2ce8-48f6-b7ab-9fb91967c29e",
            "title": "Lab",
            "due_date": "2023-10-03T00:00:00",
            "completed": false
          },
          {
            "id": "4646e771-4f7c-48c2-a796-1d23e0bad3dd",
            "title": "Essay",
            "due_date": "2023-09-18T00:00:00",
            "completed": false
          },
          {
            "id": "4549d4c0-0cb8-4c6d-b5c3-50efe4636e62",
            "title": "Lab",
            "due_date": "2023-11-09T00:00:00",
            "completed": false
          },
          {
            "id": "b7d1e5ce-3955-4995-ad8d-5e5b857672e6",
            "title": "Project",
            "due_date": "2023-11-15T00:00:00",
            "completed": false
          },
          {
            "id": "682f0dd6-91e9-4a43-891b-43af0fe9c47d",
            "title": "Paper",
            "due_date": "2023-09-12T00:00:00",
            "completed": false
          },
          {
            "id": "38470162-309b-4c4a-a779-a69fb1a1ecb4",
            "title": "Essay",
            "due_date": "2023-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "47d237ca-c22a-4c3b-99a6-dfce50fd0146",
            "title": "Discussion",
            "due_date": "2023-08-10T00:00:00",
            "completed": false
          },
          {
            "id": "7137f3ad-a90b-4381-a170-4b675376595c",
            "title": "Final",
            "due_date": "2023-11-20T00:00:00",
            "completed": false
          },
          {
            "id": "d3ec3223-d321-495c-bd18-89e6d75cc773",
            "title": "Test",
            "due_date": "2023-11-06T00:00:00",
            "completed": false
          },
          {
            "id": "01acdaf9-6d36-467e-8141-05f9b75a8367",
            "title": "Project",
            "due_date": "2023-11-10T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "e7192159-1960-4961-b273-436bf9c561bb",
        "grade": 96.21
      },
      {
        "id": "19dbdf4e-ef0a-4f9c-85c5-184bf167330a",
        "title": "Discrete Mathematics for Computer Science",
        "credit_hours": 4,
        "short_id": "CSCI 2610",
        "description": "A survey of the fundamental mathematical tools used in Computer Science: sets, relations, and functions; propositional and predicate logic; proof writing strategies such as direct, contradiction, and induction; summations and recurrences; elementary asymptotics and timing analysis; counting and discrete probability with applications in computer science.",
        "assignments": [
          {
            "id": "9d9b571a-0e35-4221-bf46-f26fe6c7e1f0",
            "title": "Test",
            "due_date": "2023-11-17T00:00:00",
            "completed": false
          },
          {
            "id": "b6fafaed-b11e-4436-83fe-9baa45dc2f46",
            "title": "Essay",
            "due_date": "2023-10-20T00:00:00",
            "completed": false
          },
          {
            "id": "c82f0a0f-10eb-46ef-b72d-a70183c181a9",
            "title": "Paper",
            "due_date": "2023-10-12T00:00:00",
            "completed": false
          },
          {
            "id": "605093ba-06ec-49c5-b698-c3c826d4b49f",
            "title": "Reading",
            "due_date": "2023-08-21T00:00:00",
            "completed": false
          },
          {
            "id": "9d79233d-b196-44ab-a64c-b227edbdf7f1",
            "title": "Exam",
            "due_date": "2023-09-18T00:00:00",
            "completed": false
          },
          {
            "id": "f28bff4d-401e-4484-923f-d882b4c9167e",
            "title": "Test",
            "due_date": "2023-08-16T00:00:00",
            "completed": false
          },
          {
            "id": "86b7a33b-98ad-47a9-bce9-870efeb1af5a",
            "title": "Homework",
            "due_date": "2023-11-16T00:00:00",
            "completed": false
          },
          {
            "id": "b4030e5f-6762-442e-9f89-52db4426149b",
            "title": "Lab",
            "due_date": "2023-08-16T00:00:00",
            "completed": false
          },
          {
            "id": "34969b7e-d0f8-44c8-8c1b-3d266ae068a7",
            "title": "Paper",
            "due_date": "2023-09-09T00:00:00",
            "completed": false
          },
          {
            "id": "5b051d19-7f50-474e-97cf-44af36c35fea",
            "title": "Quiz",
            "due_date": "2023-09-05T00:00:00",
            "completed": false
          },
          {
            "id": "4dedc20f-1dbf-4137-ba9d-fe72d17e44f2",
            "title": "Essay",
            "due_date": "2023-10-09T00:00:00",
            "completed": false
          },
          {
            "id": "0ef57d89-7357-410f-8bf2-5bff16c65001",
            "title": "Quiz",
            "due_date": "2023-09-08T00:00:00",
            "completed": false
          },
          {
            "id": "9030515d-3880-448a-9e4a-5480accf3ba5",
            "title": "Essay",
            "due_date": "2023-10-06T00:00:00",
            "completed": false
          },
          {
            "id": "c2748e7a-e26d-4e0c-b712-8061d2964d4e",
            "title": "Quiz",
            "due_date": "2023-08-19T00:00:00",
            "completed": false
          },
          {
            "id": "a8c3241e-61a6-4865-92df-756462c45f58",
            "title": "Essay",
            "due_date": "2023-08-24T00:00:00",
            "completed": false
          },
          {
            "id": "f5b40097-b768-4fb3-828d-e8a5ea60d01c",
            "title": "Project",
            "due_date": "2023-10-24T00:00:00",
            "completed": false
          },
          {
            "id": "b41de1f6-2d65-416b-a43c-95124ef6d9a1",
            "title": "Reading",
            "due_date": "2023-11-03T00:00:00",
            "completed": false
          },
          {
            "id": "19b87d5e-6ed9-4db8-b089-521d773ab730",
            "title": "Exam",
            "due_date": "2023-09-23T00:00:00",
            "completed": false
          },
          {
            "id": "d458b7e1-d195-455d-a025-2c45e5c506d0",
            "title": "Presentation",
            "due_date": "2023-11-17T00:00:00",
            "completed": false
          },
          {
            "id": "9cded1ca-bf8b-4dd0-9624-e50a1e416df5",
            "title": "Lab",
            "due_date": "2023-10-30T00:00:00",
            "completed": false
          },
          {
            "id": "b133f170-3464-45a5-ae94-4972085c0e82",
            "title": "Reading",
            "due_date": "2023-09-26T00:00:00",
            "completed": false
          },
          {
            "id": "0be09990-c421-4ebd-a8d9-d30b685c24e5",
            "title": "Test",
            "due_date": "2023-10-24T00:00:00",
            "completed": false
          },
          {
            "id": "6a66f7db-d838-4eaa-acb2-cbd2d362e8dc",
            "title": "Final",
            "due_date": "2023-11-09T00:00:00",
            "completed": false
          },
          {
            "id": "54536627-0add-4907-bbaf-9ea37f9d63a7",
            "title": "Discussion",
            "due_date": "2023-09-14T00:00:00",
            "completed": false
          },
          {
            "id": "d8c2ba12-d2ce-4df2-86ec-e56c51230790",
            "title": "Discussion",
            "due_date": "2023-09-05T00:00:00",
            "completed": false
          },
          {
            "id": "afd6d13d-9a7c-4b15-ae5f-6cb03ab932af",
            "title": "Paper",
            "due_date": "2023-11-02T00:00:00",
            "completed": false
          },
          {
            "id": "41cc25ab-ff18-4288-a205-8d3591211b92",
            "title": "Exam",
            "due_date": "2023-09-05T00:00:00",
            "completed": false
          },
          {
            "id": "aff3143b-1e25-493f-b897-7af8f5d308d6",
            "title": "Exam",
            "due_date": "2023-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "18272e67-473d-4e76-9e3f-f1f537610577",
            "title": "Discussion",
            "due_date": "2023-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "c599c695-8606-4038-98e7-eb2d94d8bf4d",
            "title": "Homework",
            "due_date": "2023-09-21T00:00:00",
            "completed": false
          },
          {
            "id": "5892f274-1ff8-4278-9474-fe592e2433ff",
            "title": "Paper",
            "due_date": "2023-08-21T00:00:00",
            "completed": false
          },
          {
            "id": "205a5d17-3007-4779-a4dd-7afed246084f",
            "title": "Presentation",
            "due_date": "2023-09-28T00:00:00",
            "completed": false
          },
          {
            "id": "d89b10e1-9482-4c39-9233-68829dc469f6",
            "title": "Lab",
            "due_date": "2023-09-22T00:00:00",
            "completed": false
          },
          {
            "id": "e15fafca-56b2-479b-bdc9-d30c73b9bf2b",
            "title": "Lab",
            "due_date": "2023-11-05T00:00:00",
            "completed": false
          },
          {
            "id": "ca4dd2d3-dac1-42bd-b228-b56ab8392161",
            "title": "Paper",
            "due_date": "2023-11-07T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "e7192159-1960-4961-b273-436bf9c561bb",
        "grade": 92.87
      },
      {
        "id": "f962d2af-0186-4ff2-8cdd-c470cc07060f",
        "title": "Discrete Mathematics for Engineers",
        "credit_hours": 3,
        "short_id": "CSCI 2611",
        "description": "A survey of the fundamental mathematical tools used in computer engineering: sets, relations, and functions; propositional and predicate logic; proof writing strategies, such as direct, contradiction and induction; summations and recurrences; counting and discrete probability; undirected and directed graphs with applications in computer engineering.",
        "assignments": [
          {
            "id": "db3445be-e21c-4795-821c-d9495de1fa76",
            "title": "Discussion",
            "due_date": "2023-09-06T00:00:00",
            "completed": false
          },
          {
            "id": "bdda9f86-e4e2-4090-81da-e6516eddeec1",
            "title": "Exam",
            "due_date": "2023-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "4bfbbd98-8199-4b76-93d7-890bf32f4cba",
            "title": "Test",
            "due_date": "2023-10-14T00:00:00",
            "completed": false
          },
          {
            "id": "03866468-66a2-420f-aa18-a21be42e05d0",
            "title": "Paper",
            "due_date": "2023-08-29T00:00:00",
            "completed": false
          },
          {
            "id": "8f765b8c-4942-4509-8307-b20a30cf8442",
            "title": "Presentation",
            "due_date": "2023-10-24T00:00:00",
            "completed": false
          },
          {
            "id": "99f44512-9b35-4b54-8032-6c9ae7e6281a",
            "title": "Discussion",
            "due_date": "2023-10-31T00:00:00",
            "completed": false
          },
          {
            "id": "33c9753d-a715-4149-9924-1a5963143799",
            "title": "Final",
            "due_date": "2023-10-18T00:00:00",
            "completed": false
          },
          {
            "id": "8858b0da-4bf0-4a82-a5bf-7026f74c088f",
            "title": "Final",
            "due_date": "2023-11-20T00:00:00",
            "completed": false
          },
          {
            "id": "f898efb1-bc1a-4d6e-9b73-275c00b8ec9b",
            "title": "Homework",
            "due_date": "2023-09-25T00:00:00",
            "completed": false
          },
          {
            "id": "2a47c4d2-3256-4862-9a51-dc492dbb4e25",
            "title": "Discussion",
            "due_date": "2023-10-08T00:00:00",
            "completed": false
          },
          {
            "id": "a25acbab-8c71-41c8-948c-a7f7cfc9cf18",
            "title": "Exam",
            "due_date": "2023-11-06T00:00:00",
            "completed": false
          },
          {
            "id": "df45b85b-f2eb-4757-9486-1e2bcf7f15ea",
            "title": "Exam",
            "due_date": "2023-11-18T00:00:00",
            "completed": false
          },
          {
            "id": "b5a65aca-fbfe-454a-9b9d-835ec5cc73b6",
            "title": "Test",
            "due_date": "2023-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "67959ea1-cf14-417a-a1c6-cd136f41cff8",
            "title": "Reading",
            "due_date": "2023-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "c8be9865-aad7-4d5d-9d3e-73687b4abb43",
            "title": "Quiz",
            "due_date": "2023-10-12T00:00:00",
            "completed": false
          },
          {
            "id": "334db351-3b45-4c20-8109-3805b11b7daf",
            "title": "Reading",
            "due_date": "2023-10-16T00:00:00",
            "completed": false
          },
          {
            "id": "e43c00e2-d239-4af0-90ac-d089844f3eaf",
            "title": "Presentation",
            "due_date": "2023-10-08T00:00:00",
            "completed": false
          },
          {
            "id": "4a9f0c30-a0f5-43ed-8001-96c2d7ea4928",
            "title": "Test",
            "due_date": "2023-10-15T00:00:00",
            "completed": false
          },
          {
            "id": "053ab446-f463-4fed-a3eb-718aa975895a",
            "title": "Essay",
            "due_date": "2023-08-22T00:00:00",
            "completed": false
          },
          {
            "id": "f848083b-fc6a-4335-a330-06222c1a5e64",
            "title": "Exam",
            "due_date": "2023-09-23T00:00:00",
            "completed": false
          },
          {
            "id": "55b11890-f37b-42c3-8e8e-4cfcd04f22f0",
            "title": "Discussion",
            "due_date": "2023-10-20T00:00:00",
            "completed": false
          },
          {
            "id": "74b8e0b1-f99e-4d49-a6d2-ad58324e29a4",
            "title": "Final",
            "due_date": "2023-09-28T00:00:00",
            "completed": false
          },
          {
            "id": "348125f1-d242-452b-9d0b-0d637ffc03a1",
            "title": "Presentation",
            "due_date": "2023-09-08T00:00:00",
            "completed": false
          },
          {
            "id": "22e296a3-1ca8-4cdf-be3c-9f6fa4b39205",
            "title": "Final",
            "due_date": "2023-08-19T00:00:00",
            "completed": false
          },
          {
            "id": "53a53090-8181-4135-9a15-ba4ea9a565bd",
            "title": "Discussion",
            "due_date": "2023-09-15T00:00:00",
            "completed": false
          },
          {
            "id": "3bac0748-8ad5-4ea8-ac5a-c4162f714c74",
            "title": "Final",
            "due_date": "2023-10-30T00:00:00",
            "completed": false
          },
          {
            "id": "435a29a8-10ce-49f5-abcb-12d1eadfa849",
            "title": "Reading",
            "due_date": "2023-11-12T00:00:00",
            "completed": false
          },
          {
            "id": "f3b960e8-6bd7-4f6c-b4f0-fb3f54544a09",
            "title": "Project",
            "due_date": "2023-11-16T00:00:00",
            "completed": false
          },
          {
            "id": "28c88cad-8c8e-4414-95cb-ee6478583704",
            "title": "Essay",
            "due_date": "2023-09-24T00:00:00",
            "completed": false
          },
          {
            "id": "4a916a5c-1e45-41ba-80ab-a86967493922",
            "title": "Essay",
            "due_date": "2023-08-16T00:00:00",
            "completed": false
          },
          {
            "id": "dd6d3e1b-c76b-41c4-a875-52b332ecc743",
            "title": "Homework",
            "due_date": "2023-09-10T00:00:00",
            "completed": false
          },
          {
            "id": "6be51a69-eef9-416c-92dc-634403e560a2",
            "title": "Discussion",
            "due_date": "2023-09-22T00:00:00",
            "completed": false
          },
          {
            "id": "a1e75f75-2add-4725-b492-9a0e124756db",
            "title": "Lab",
            "due_date": "2023-09-07T00:00:00",
            "completed": false
          },
          {
            "id": "9ef39ed5-5f77-4f33-9a82-0d3bac0e3ee2",
            "title": "Paper",
            "due_date": "2023-11-21T00:00:00",
            "completed": false
          },
          {
            "id": "589ff70d-7dbd-49a2-8841-e549faefb425",
            "title": "Paper",
            "due_date": "2023-10-18T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "e7192159-1960-4961-b273-436bf9c561bb",
        "grade": 98.31
      },
      {
        "id": "3890473e-e391-4143-859a-40e2a4e40926",
        "title": "Introduction to Theory of Computing",
        "credit_hours": 4,
        "short_id": "CSCI 2670",
        "description": "The theory of computing, including finite automata, regular expressions and languages, context-free grammars and languages, push-down automata, pumping lemmas, the Chomsky hierarchy of language classes, Turing machines and computability, undecidability of the halting problem, reducibilities among decision problems and languages, time and space complexity, and NP-completeness and tractability.",
        "assignments": [
          {
            "id": "baa32ec7-a15e-4e21-85ff-35619beb98d3",
            "title": "Discussion",
            "due_date": "2024-04-23T00:00:00",
            "completed": false
          },
          {
            "id": "29488fa3-8c54-452a-bd69-2f3b86635038",
            "title": "Reading",
            "due_date": "2024-03-22T00:00:00",
            "completed": false
          },
          {
            "id": "3c2f636d-e625-49bb-acbd-07e88ca87e8d",
            "title": "Reading",
            "due_date": "2024-04-10T00:00:00",
            "completed": false
          },
          {
            "id": "0483276c-1136-419b-9b43-c9724558dec5",
            "title": "Exam",
            "due_date": "2024-03-21T00:00:00",
            "completed": false
          },
          {
            "id": "52e9f906-c3b6-4708-b036-6fef366f06eb",
            "title": "Homework",
            "due_date": "2024-04-16T00:00:00",
            "completed": false
          },
          {
            "id": "040bc020-d16e-4362-8d97-33cc64af28e0",
            "title": "Exam",
            "due_date": "2024-03-15T00:00:00",
            "completed": false
          },
          {
            "id": "ab4ab3a5-3339-4279-99c2-a56301d12ee1",
            "title": "Final",
            "due_date": "2024-02-12T00:00:00",
            "completed": false
          },
          {
            "id": "f4a2b80a-89f3-480b-83b0-0c7146a3b1d1",
            "title": "Homework",
            "due_date": "2024-01-27T00:00:00",
            "completed": false
          },
          {
            "id": "d6106a6f-b036-4e16-a1d2-bb5794763ac2",
            "title": "Homework",
            "due_date": "2024-03-25T00:00:00",
            "completed": false
          },
          {
            "id": "820688c4-91a8-4262-985a-866e67984d96",
            "title": "Final",
            "due_date": "2024-04-17T00:00:00",
            "completed": false
          },
          {
            "id": "7503989d-6cb6-4ba3-ba14-a50772f3c452",
            "title": "Presentation",
            "due_date": "2024-02-03T00:00:00",
            "completed": false
          },
          {
            "id": "9dd942d3-4d0b-4304-b585-3e9cfc17bd01",
            "title": "Exam",
            "due_date": "2024-04-02T00:00:00",
            "completed": false
          },
          {
            "id": "520f3ba0-caec-4f93-9a5c-785c55176d25",
            "title": "Test",
            "due_date": "2024-04-26T00:00:00",
            "completed": false
          },
          {
            "id": "0fb0c842-1475-4152-9214-7cebb8287b2c",
            "title": "Final",
            "due_date": "2024-01-09T00:00:00",
            "completed": false
          },
          {
            "id": "1decdc7a-f364-4b04-adc0-3e3a375d4901",
            "title": "Quiz",
            "due_date": "2024-03-10T00:00:00",
            "completed": false
          },
          {
            "id": "494d4dc8-d999-4a44-9b3c-7bf6f9f5ab97",
            "title": "Homework",
            "due_date": "2024-04-07T00:00:00",
            "completed": false
          },
          {
            "id": "8c20cc5b-896b-4515-9a5a-5dff2eda8f44",
            "title": "Project",
            "due_date": "2024-01-12T00:00:00",
            "completed": false
          },
          {
            "id": "f7c55dc6-7a7e-4b02-8f68-67b22388cccf",
            "title": "Test",
            "due_date": "2024-01-13T00:00:00",
            "completed": false
          },
          {
            "id": "ac5d20e8-0035-432d-b602-1fe497237879",
            "title": "Homework",
            "due_date": "2024-02-27T00:00:00",
            "completed": false
          },
          {
            "id": "378bcf00-e92f-4b2a-bdc1-9683bf6baa0c",
            "title": "Presentation",
            "due_date": "2024-02-01T00:00:00",
            "completed": false
          },
          {
            "id": "96357ee7-a477-436e-aced-4e6f734b6320",
            "title": "Quiz",
            "due_date": "2024-01-12T00:00:00",
            "completed": false
          },
          {
            "id": "4e27a1ef-57a1-4645-bdd6-19d560d32e72",
            "title": "Test",
            "due_date": "2024-01-11T00:00:00",
            "completed": false
          },
          {
            "id": "29fec658-e241-47ac-b445-81960a3e84b7",
            "title": "Exam",
            "due_date": "2024-04-19T00:00:00",
            "completed": false
          },
          {
            "id": "8e5218b7-d667-4d83-9661-15f45fa22dd1",
            "title": "Paper",
            "due_date": "2024-01-07T00:00:00",
            "completed": false
          },
          {
            "id": "6323ee59-e324-4278-8396-3c06daa90d26",
            "title": "Homework",
            "due_date": "2024-02-28T00:00:00",
            "completed": false
          },
          {
            "id": "c5d89a38-98ff-4c08-9010-b1911f0f9d0f",
            "title": "Discussion",
            "due_date": "2024-04-25T00:00:00",
            "completed": false
          },
          {
            "id": "e133e178-325e-45fa-97ef-5e1fce7b2e44",
            "title": "Paper",
            "due_date": "2024-01-08T00:00:00",
            "completed": false
          },
          {
            "id": "ac215661-7b14-4dfd-946f-eafb2f6d48b2",
            "title": "Paper",
            "due_date": "2024-04-03T00:00:00",
            "completed": false
          },
          {
            "id": "3ea092a6-7073-448e-a04e-edbeab3c4cd1",
            "title": "Homework",
            "due_date": "2024-01-13T00:00:00",
            "completed": false
          },
          {
            "id": "f5d9a836-1c89-4d9e-98d5-516012567284",
            "title": "Project",
            "due_date": "2024-02-02T00:00:00",
            "completed": false
          },
          {
            "id": "00b50219-2208-4189-be29-6f0520af0b94",
            "title": "Lab",
            "due_date": "2024-01-16T00:00:00",
            "completed": false
          },
          {
            "id": "2fa18f26-ab8b-4b94-b412-d4c960704e43",
            "title": "Lab",
            "due_date": "2024-02-16T00:00:00",
            "completed": false
          },
          {
            "id": "be87245d-6d64-45a0-b254-d653c540ff09",
            "title": "Test",
            "due_date": "2024-04-17T00:00:00",
            "completed": false
          },
          {
            "id": "abded596-0898-4a59-8197-940fb8010891",
            "title": "Presentation",
            "due_date": "2024-03-17T00:00:00",
            "completed": false
          },
          {
            "id": "fe530d9f-ca29-4996-b028-89da18b4598c",
            "title": "Quiz",
            "due_date": "2024-04-11T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "5719578e-b880-45af-820f-2e8f96542ad4",
        "grade": 96.01
      },
      {
        "id": "c1c0f4fa-09ed-457a-945e-2fa1b29bd4ad",
        "title": "Elementary Differential Equations",
        "credit_hours": 3,
        "short_id": "MATH 2700",
        "description": "First- and second-order ordinary differential equations, including physical and biological applications, numerical solutions, and mathematical modeling.",
        "assignments": [
          {
            "id": "7e62ac0a-6857-4430-81a4-da85204930cf",
            "title": "Lab",
            "due_date": "2024-03-20T00:00:00",
            "completed": false
          },
          {
            "id": "3610b37f-ccf3-4729-923e-ce991f7a7deb",
            "title": "Exam",
            "due_date": "2024-04-03T00:00:00",
            "completed": false
          },
          {
            "id": "e9659580-b8a7-4e9d-a09d-4cbf81c7312a",
            "title": "Discussion",
            "due_date": "2024-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "caf0a1bc-2920-4b9f-b0df-930b49b30ed2",
            "title": "Presentation",
            "due_date": "2024-04-18T00:00:00",
            "completed": false
          },
          {
            "id": "a671039c-3ea9-48d7-b506-5409a5dc6422",
            "title": "Exam",
            "due_date": "2024-02-05T00:00:00",
            "completed": false
          },
          {
            "id": "f7b5c7f2-6c3d-4185-a522-75c9cbc15520",
            "title": "Reading",
            "due_date": "2024-03-23T00:00:00",
            "completed": false
          },
          {
            "id": "1eda823d-0be7-414a-b2cf-d9ec7477b738",
            "title": "Final",
            "due_date": "2024-04-15T00:00:00",
            "completed": false
          },
          {
            "id": "71b25af9-3daa-49db-8f2e-fa12a2e599d1",
            "title": "Discussion",
            "due_date": "2024-01-27T00:00:00",
            "completed": false
          },
          {
            "id": "90ed4636-f221-465a-ac7b-c3a1afca5a06",
            "title": "Quiz",
            "due_date": "2024-03-21T00:00:00",
            "completed": false
          },
          {
            "id": "c45e63f9-bed3-4cc1-8c66-2cd0b9b700de",
            "title": "Discussion",
            "due_date": "2024-01-23T00:00:00",
            "completed": false
          },
          {
            "id": "f7666ffc-111c-44ca-b3bf-f6b1883bdefd",
            "title": "Final",
            "due_date": "2024-01-31T00:00:00",
            "completed": false
          },
          {
            "id": "7edba612-b5ed-4b9b-b517-bcd2dfda4c5f",
            "title": "Essay",
            "due_date": "2024-03-10T00:00:00",
            "completed": false
          },
          {
            "id": "c47d922d-f0bb-409e-87de-3e64bd8cb7b3",
            "title": "Project",
            "due_date": "2024-04-16T00:00:00",
            "completed": false
          },
          {
            "id": "08d39255-ab04-4479-93b8-36f95bb87923",
            "title": "Presentation",
            "due_date": "2024-01-31T00:00:00",
            "completed": false
          },
          {
            "id": "9170e1f8-4115-4e9d-ab56-0a50e858319d",
            "title": "Quiz",
            "due_date": "2024-02-15T00:00:00",
            "completed": false
          },
          {
            "id": "fda2bd00-47c1-419e-ba8f-702e92ba12b1",
            "title": "Homework",
            "due_date": "2024-02-10T00:00:00",
            "completed": false
          },
          {
            "id": "e6763a70-0304-4e6f-802e-d4af7f6928dd",
            "title": "Project",
            "due_date": "2024-02-03T00:00:00",
            "completed": false
          },
          {
            "id": "050c0d07-7a1b-49ae-bb55-fa2a11fdd32f",
            "title": "Test",
            "due_date": "2024-03-05T00:00:00",
            "completed": false
          },
          {
            "id": "a29d0a9c-329d-4476-8dc9-48804755bfc8",
            "title": "Project",
            "due_date": "2024-04-02T00:00:00",
            "completed": false
          },
          {
            "id": "fa5f3452-8809-4471-91f4-349501e25ff4",
            "title": "Exam",
            "due_date": "2024-03-15T00:00:00",
            "completed": false
          },
          {
            "id": "ee7e6513-0e92-45de-a99d-abd5e41f2077",
            "title": "Project",
            "due_date": "2024-04-14T00:00:00",
            "completed": false
          },
          {
            "id": "6ddbac05-7816-4839-a311-d18b64324414",
            "title": "Reading",
            "due_date": "2024-03-14T00:00:00",
            "completed": false
          },
          {
            "id": "a59b3ce9-36e2-4d83-9c22-c67d88c939f0",
            "title": "Discussion",
            "due_date": "2024-01-08T00:00:00",
            "completed": false
          },
          {
            "id": "d4a852ab-6680-4e1a-989b-d9dabd2f032e",
            "title": "Lab",
            "due_date": "2024-04-22T00:00:00",
            "completed": false
          },
          {
            "id": "8532efaf-f711-41e3-ab24-8a35da7cd022",
            "title": "Homework",
            "due_date": "2024-01-15T00:00:00",
            "completed": false
          },
          {
            "id": "410ab28d-ba5b-403c-b3c7-9c9593fb02e4",
            "title": "Paper",
            "due_date": "2024-04-18T00:00:00",
            "completed": false
          },
          {
            "id": "57a0a2f8-b37d-4eff-ae0c-dddfc7229840",
            "title": "Homework",
            "due_date": "2024-01-24T00:00:00",
            "completed": false
          },
          {
            "id": "622ff2c1-74e9-4837-82d8-57e436e6cf36",
            "title": "Presentation",
            "due_date": "2024-02-20T00:00:00",
            "completed": false
          },
          {
            "id": "62569516-b964-4b39-acea-e2d7fa0435e4",
            "title": "Exam",
            "due_date": "2024-03-17T00:00:00",
            "completed": false
          },
          {
            "id": "44862f93-f633-415f-941f-c6987d7bcca0",
            "title": "Lab",
            "due_date": "2024-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "fc95d1f3-e30a-4a53-be32-129a0b352112",
            "title": "Reading",
            "due_date": "2024-02-06T00:00:00",
            "completed": false
          },
          {
            "id": "c19292f2-72ea-42c5-9e32-bbbc07c900ec",
            "title": "Presentation",
            "due_date": "2024-01-31T00:00:00",
            "completed": false
          },
          {
            "id": "fa01ee55-02ea-44aa-8750-92c5918be63f",
            "title": "Homework",
            "due_date": "2024-02-01T00:00:00",
            "completed": false
          },
          {
            "id": "11294090-2ee3-4144-be3b-df704eff5a87",
            "title": "Paper",
            "due_date": "2024-01-30T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "5719578e-b880-45af-820f-2e8f96542ad4",
        "grade": 94.64
      },
      {
        "id": "c38d155a-e9a6-403f-b94e-99e6d62be908",
        "title": "Data Structures",
        "credit_hours": 4,
        "short_id": "CSCI 2720",
        "description": "The design, analysis, and implementation of data structures and their associated algorithms. Lists, stacks, queues and priority queues, trees, graphs, dictionaries, time and space complexity, sorting and searching, advanced problem-solving, and algorithm design strategies.",
        "assignments": [
          {
            "id": "dff3a804-c79a-4883-b6e1-b15ccfa69dab",
            "title": "Discussion",
            "due_date": "2024-01-23T00:00:00",
            "completed": false
          },
          {
            "id": "93e75ad9-9d7d-4c8d-b77e-9f09eda24ea2",
            "title": "Homework",
            "due_date": "2024-01-07T00:00:00",
            "completed": false
          },
          {
            "id": "bf40a450-1baa-4fab-9be5-31f2ee5343a6",
            "title": "Reading",
            "due_date": "2024-03-20T00:00:00",
            "completed": false
          },
          {
            "id": "fe153e10-672a-426f-8324-66ab159b69a7",
            "title": "Presentation",
            "due_date": "2024-04-15T00:00:00",
            "completed": false
          },
          {
            "id": "a01a250d-7217-46b6-94cf-4e40746ee037",
            "title": "Quiz",
            "due_date": "2024-03-18T00:00:00",
            "completed": false
          },
          {
            "id": "23e61f63-3624-48a8-a3a9-2df8189c6ce1",
            "title": "Reading",
            "due_date": "2024-01-13T00:00:00",
            "completed": false
          },
          {
            "id": "96bd9231-fc60-4df5-9884-96afd3365604",
            "title": "Homework",
            "due_date": "2024-03-29T00:00:00",
            "completed": false
          },
          {
            "id": "2c316158-962e-4380-8627-13e3d76761e3",
            "title": "Presentation",
            "due_date": "2024-01-07T00:00:00",
            "completed": false
          },
          {
            "id": "0f41522a-79c2-48f0-a443-4d8496533c27",
            "title": "Test",
            "due_date": "2024-01-15T00:00:00",
            "completed": false
          },
          {
            "id": "d4ec5ca8-a500-412b-9ad3-f315101f9984",
            "title": "Lab",
            "due_date": "2024-04-22T00:00:00",
            "completed": false
          },
          {
            "id": "0943b020-7d32-403b-bbcb-497098fd3d61",
            "title": "Paper",
            "due_date": "2024-01-27T00:00:00",
            "completed": false
          },
          {
            "id": "c3fb6795-cddf-4f7e-9e1c-9c7c2a0d28ab",
            "title": "Final",
            "due_date": "2024-01-20T00:00:00",
            "completed": false
          },
          {
            "id": "8ca217b4-f845-4136-b4f7-491a875379b4",
            "title": "Homework",
            "due_date": "2024-04-02T00:00:00",
            "completed": false
          },
          {
            "id": "d2366b97-e676-4653-819a-98a1984c84ee",
            "title": "Project",
            "due_date": "2024-03-28T00:00:00",
            "completed": false
          },
          {
            "id": "a97ebc57-5bb2-4e2c-acef-e0573a8fa46b",
            "title": "Exam",
            "due_date": "2024-02-05T00:00:00",
            "completed": false
          },
          {
            "id": "63bb9bfe-cabe-45e9-bac4-92a4e180eb46",
            "title": "Test",
            "due_date": "2024-03-18T00:00:00",
            "completed": false
          },
          {
            "id": "05644956-2296-4a0d-bb70-129c696b2fa4",
            "title": "Test",
            "due_date": "2024-04-22T00:00:00",
            "completed": false
          },
          {
            "id": "fed61899-94d6-4b28-9444-93f29eef824e",
            "title": "Project",
            "due_date": "2024-02-20T00:00:00",
            "completed": false
          },
          {
            "id": "78321249-2999-4827-9115-155facbdd2c6",
            "title": "Project",
            "due_date": "2024-02-10T00:00:00",
            "completed": false
          },
          {
            "id": "87e4e21d-5bc7-40ee-a03f-7f8260cfe88c",
            "title": "Essay",
            "due_date": "2024-03-29T00:00:00",
            "completed": false
          },
          {
            "id": "0caa6d7c-30c4-4f8e-8665-64f786b518ad",
            "title": "Test",
            "due_date": "2024-01-22T00:00:00",
            "completed": false
          },
          {
            "id": "15ec16e4-2fa7-4125-b4aa-6b476d2fbeac",
            "title": "Homework",
            "due_date": "2024-03-08T00:00:00",
            "completed": false
          },
          {
            "id": "61716259-c133-4607-b35e-6ab3583b6534",
            "title": "Presentation",
            "due_date": "2024-03-21T00:00:00",
            "completed": false
          },
          {
            "id": "581036db-1efd-470b-a523-c0b7759d4a6b",
            "title": "Discussion",
            "due_date": "2024-03-30T00:00:00",
            "completed": false
          },
          {
            "id": "fcabcca6-e0f1-48ca-bb5b-ba30ba4b9925",
            "title": "Paper",
            "due_date": "2024-04-02T00:00:00",
            "completed": false
          },
          {
            "id": "6bf65a24-0d14-48fb-8ba1-e0b7ee69196a",
            "title": "Discussion",
            "due_date": "2024-01-27T00:00:00",
            "completed": false
          },
          {
            "id": "1e489517-c18f-4152-8fd7-b492448573f5",
            "title": "Essay",
            "due_date": "2024-01-11T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "5719578e-b880-45af-820f-2e8f96542ad4",
        "grade": 90.28
      },
      {
        "id": "0c3f4b48-6c11-4ed1-ad6f-008429fd65d6",
        "title": "Data Structures for Data Science",
        "credit_hours": 4,
        "short_id": "CSCI 2725",
        "description": "The design and implementation of data structures. Comparative analysis of algorithms and their applications to solving data science problems. Topics include recursion, lists, stacks, queues and priority queues, trees, graphs, dictionaries, decision trees, disjoint set, tensors, and data frames.",
        "assignments": [
          {
            "id": "e0ecddbc-900b-418b-9708-88f6052c951c",
            "title": "Test",
            "due_date": "2024-03-17T00:00:00",
            "completed": false
          },
          {
            "id": "22a6502e-b72d-4428-9e0e-2ce1a5a43849",
            "title": "Essay",
            "due_date": "2024-03-02T00:00:00",
            "completed": false
          },
          {
            "id": "7b4729f8-fe67-408f-a3f3-4b831a1a0a57",
            "title": "Paper",
            "due_date": "2024-01-17T00:00:00",
            "completed": false
          },
          {
            "id": "a35eaa1d-c303-4269-abfb-4a04cb9432c5",
            "title": "Lab",
            "due_date": "2024-03-05T00:00:00",
            "completed": false
          },
          {
            "id": "6e341232-8b6d-48a0-902b-61584c0e749f",
            "title": "Test",
            "due_date": "2024-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "230a3d9a-a940-4623-8f43-bf1c04b30131",
            "title": "Exam",
            "due_date": "2024-01-12T00:00:00",
            "completed": false
          },
          {
            "id": "63e80cd2-4d99-4271-8899-5d68648c59f3",
            "title": "Paper",
            "due_date": "2024-03-19T00:00:00",
            "completed": false
          },
          {
            "id": "e0a8c52f-7232-45ee-b368-c90b5a2be819",
            "title": "Project",
            "due_date": "2024-04-17T00:00:00",
            "completed": false
          },
          {
            "id": "c351784e-48ed-4513-8a4f-c8b92cff3b0f",
            "title": "Reading",
            "due_date": "2024-04-15T00:00:00",
            "completed": false
          },
          {
            "id": "ac8b50e5-0698-46a0-ba8e-348d4158b87b",
            "title": "Final",
            "due_date": "2024-03-12T00:00:00",
            "completed": false
          },
          {
            "id": "527c1743-5e8c-4445-a735-2e899502e691",
            "title": "Test",
            "due_date": "2024-01-07T00:00:00",
            "completed": false
          },
          {
            "id": "9377b0dc-00ae-4df7-9c78-b0ef786ff734",
            "title": "Presentation",
            "due_date": "2024-03-19T00:00:00",
            "completed": false
          },
          {
            "id": "98636d34-2a5a-4cf7-877d-d0d6f8d52720",
            "title": "Presentation",
            "due_date": "2024-01-17T00:00:00",
            "completed": false
          },
          {
            "id": "87e08807-fb83-4984-a0cc-14b02b965083",
            "title": "Project",
            "due_date": "2024-03-04T00:00:00",
            "completed": false
          },
          {
            "id": "28dc6198-5409-4338-932f-05e0e51cbf53",
            "title": "Presentation",
            "due_date": "2024-04-16T00:00:00",
            "completed": false
          },
          {
            "id": "62ab8ceb-f0be-4118-a67b-46d82eb0e5f4",
            "title": "Lab",
            "due_date": "2024-04-01T00:00:00",
            "completed": false
          },
          {
            "id": "8bc2de28-d411-496a-8abf-06b3e17cc1dc",
            "title": "Presentation",
            "due_date": "2024-02-11T00:00:00",
            "completed": false
          },
          {
            "id": "86ac4a22-79de-47d0-a644-c344eddcd13e",
            "title": "Final",
            "due_date": "2024-01-21T00:00:00",
            "completed": false
          },
          {
            "id": "553bc637-da57-4487-82bd-dca8223ed921",
            "title": "Lab",
            "due_date": "2024-04-05T00:00:00",
            "completed": false
          },
          {
            "id": "e13d0205-2755-4f5d-99ee-d13ecb071a3c",
            "title": "Homework",
            "due_date": "2024-01-08T00:00:00",
            "completed": false
          },
          {
            "id": "9bb63633-315a-4315-b6fc-89cc36be161e",
            "title": "Test",
            "due_date": "2024-04-02T00:00:00",
            "completed": false
          },
          {
            "id": "b829e9a6-7654-43fd-b45a-8fb5e9c7f5ec",
            "title": "Final",
            "due_date": "2024-01-28T00:00:00",
            "completed": false
          },
          {
            "id": "c5fcb893-b20b-4345-9310-2363fc423278",
            "title": "Reading",
            "due_date": "2024-01-13T00:00:00",
            "completed": false
          },
          {
            "id": "6b01316a-186c-4c5c-8302-6a233c914d05",
            "title": "Project",
            "due_date": "2024-04-01T00:00:00",
            "completed": false
          },
          {
            "id": "2b61db4b-5681-4630-a1da-067b6ce46186",
            "title": "Presentation",
            "due_date": "2024-01-09T00:00:00",
            "completed": false
          },
          {
            "id": "edb47443-8922-4940-9f60-8b88810ee4c3",
            "title": "Exam",
            "due_date": "2024-04-24T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "5719578e-b880-45af-820f-2e8f96542ad4",
        "grade": 92.73
      },
      {
        "id": "f2050ba6-8761-4fa6-bd8b-e1ba172c4b4e",
        "title": "Introduction to Linear Algebra",
        "credit_hours": 3,
        "short_id": "MATH 3000",
        "description": "Theory and applications of systems of linear equations, vector spaces, and linear transformations. Fundamental concepts include: linear independence, basis, and dimension; orthogonality, projections, and least squares solutions of inconsistent systems; eigenvalues, eigenvectors, and applications to Markov chains, difference equations, and quadratic forms.",
        "assignments": [
          {
            "id": "ab921ff8-9132-43cb-87fc-b511b8cc8810",
            "title": "Test",
            "due_date": "2024-04-09T00:00:00",
            "completed": false
          },
          {
            "id": "d2851d78-8713-4848-9727-e06fbd560cca",
            "title": "Quiz",
            "due_date": "2024-03-22T00:00:00",
            "completed": false
          },
          {
            "id": "6ce2032c-4231-4bd5-9da5-aed178c74ff7",
            "title": "Test",
            "due_date": "2024-04-18T00:00:00",
            "completed": false
          },
          {
            "id": "1685bef5-0071-4f8e-8be6-04d58900a1c8",
            "title": "Test",
            "due_date": "2024-02-01T00:00:00",
            "completed": false
          },
          {
            "id": "dfe9ef11-ab31-4059-be38-28b9fd4678c0",
            "title": "Exam",
            "due_date": "2024-01-12T00:00:00",
            "completed": false
          },
          {
            "id": "5d8c56e0-aba2-467c-b0a4-7ed1e44c7734",
            "title": "Essay",
            "due_date": "2024-03-27T00:00:00",
            "completed": false
          },
          {
            "id": "19a781ca-fb68-4129-a599-4fcd6a748c83",
            "title": "Presentation",
            "due_date": "2024-04-25T00:00:00",
            "completed": false
          },
          {
            "id": "857ba19c-4812-4a41-b95a-353771ea0802",
            "title": "Quiz",
            "due_date": "2024-03-28T00:00:00",
            "completed": false
          },
          {
            "id": "7c2baeb9-b69e-4c55-89a1-b4ac87e462e2",
            "title": "Quiz",
            "due_date": "2024-04-11T00:00:00",
            "completed": false
          },
          {
            "id": "c9c3c37a-6afb-4b5b-8a4d-63553e266b58",
            "title": "Final",
            "due_date": "2024-04-03T00:00:00",
            "completed": false
          },
          {
            "id": "ae6e09f8-e0c0-4925-ac9d-377606749e24",
            "title": "Lab",
            "due_date": "2024-03-29T00:00:00",
            "completed": false
          },
          {
            "id": "05c94938-8743-45b6-b3d8-88523e947abc",
            "title": "Project",
            "due_date": "2024-02-21T00:00:00",
            "completed": false
          },
          {
            "id": "192cf282-85f6-496f-8891-913039c67669",
            "title": "Paper",
            "due_date": "2024-04-24T00:00:00",
            "completed": false
          },
          {
            "id": "ba9c858e-d5e4-4c47-a958-ea56ffbd11ea",
            "title": "Reading",
            "due_date": "2024-03-08T00:00:00",
            "completed": false
          },
          {
            "id": "82ecfd8e-3fe7-439e-a131-94b66c308c36",
            "title": "Final",
            "due_date": "2024-02-10T00:00:00",
            "completed": false
          },
          {
            "id": "80f095de-5189-48a9-83e5-32c8e00e7481",
            "title": "Presentation",
            "due_date": "2024-02-04T00:00:00",
            "completed": false
          },
          {
            "id": "d142c8b6-1d5e-46b4-b361-1877b81e0653",
            "title": "Presentation",
            "due_date": "2024-02-04T00:00:00",
            "completed": false
          },
          {
            "id": "f56027b6-d37b-4a84-9cf3-46d9d702c972",
            "title": "Presentation",
            "due_date": "2024-03-21T00:00:00",
            "completed": false
          },
          {
            "id": "34d5b544-8531-40bf-a0fe-4ca06cae514e",
            "title": "Homework",
            "due_date": "2024-02-04T00:00:00",
            "completed": false
          },
          {
            "id": "6d0ce299-5d8c-4de7-856a-ef845987f2a3",
            "title": "Lab",
            "due_date": "2024-04-06T00:00:00",
            "completed": false
          },
          {
            "id": "cdd9482b-69fb-48bb-8a68-7527d2285a75",
            "title": "Discussion",
            "due_date": "2024-02-20T00:00:00",
            "completed": false
          },
          {
            "id": "52d348e7-ff01-409c-b8cf-1ab3c53aa5d1",
            "title": "Presentation",
            "due_date": "2024-01-21T00:00:00",
            "completed": false
          },
          {
            "id": "d482c0e3-53f0-4966-b595-179c8d0c4961",
            "title": "Presentation",
            "due_date": "2024-02-10T00:00:00",
            "completed": false
          },
          {
            "id": "19e0fd27-4c11-48f7-b5e9-a8faa899d69c",
            "title": "Final",
            "due_date": "2024-04-15T00:00:00",
            "completed": false
          },
          {
            "id": "15eb1d28-97e0-425d-a9a6-f4423d675269",
            "title": "Discussion",
            "due_date": "2024-04-03T00:00:00",
            "completed": false
          },
          {
            "id": "636dbae5-34de-43f3-8357-85d86952dad3",
            "title": "Exam",
            "due_date": "2024-04-24T00:00:00",
            "completed": false
          },
          {
            "id": "b7572512-ba4f-411b-bc7c-d00a6d7ebb14",
            "title": "Test",
            "due_date": "2024-04-14T00:00:00",
            "completed": false
          },
          {
            "id": "1e58f34c-056a-4779-b040-53c49b98e72c",
            "title": "Test",
            "due_date": "2024-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "1754698c-a316-42c9-9773-7b97b1da9565",
            "title": "Homework",
            "due_date": "2024-03-04T00:00:00",
            "completed": false
          },
          {
            "id": "1b0d1b0d-65c5-4fbb-a3cc-61617a3cfbf6",
            "title": "Lab",
            "due_date": "2024-01-11T00:00:00",
            "completed": false
          },
          {
            "id": "ea14caf1-0c8d-4a39-af56-c00f6f29dba2",
            "title": "Exam",
            "due_date": "2024-03-20T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "5719578e-b880-45af-820f-2e8f96542ad4",
        "grade": 98.38
      },
      {
        "id": "87a94b24-79e7-4790-964b-02a47596d9e1",
        "title": "Vergil's Aeneid",
        "credit_hours": 3,
        "short_id": "LATN 3010",
        "description": "Latin poetry, poetic syntax, meter, and style through readings from Vergil's Aeneid, including selections from Aeneid books 3, 5, or 7-12, and others.",
        "assignments": [
          {
            "id": "c7dcc35b-31c2-429a-b2ba-0261f7c213ea",
            "title": "Reading",
            "due_date": "2024-01-20T00:00:00",
            "completed": false
          },
          {
            "id": "488dd1a5-1f76-43be-82fe-c20e82508700",
            "title": "Project",
            "due_date": "2024-02-26T00:00:00",
            "completed": false
          },
          {
            "id": "ac40d8dc-77a6-47be-95a3-9af9517ab3c1",
            "title": "Exam",
            "due_date": "2024-04-09T00:00:00",
            "completed": false
          },
          {
            "id": "fbfeb3a9-82fe-442d-89cf-f376c6be3bd1",
            "title": "Paper",
            "due_date": "2024-04-17T00:00:00",
            "completed": false
          },
          {
            "id": "485acd5a-2307-42db-999f-8771819e2f95",
            "title": "Lab",
            "due_date": "2024-04-08T00:00:00",
            "completed": false
          },
          {
            "id": "603fa6ac-18ab-4b57-8e19-623bf9e7bb66",
            "title": "Test",
            "due_date": "2024-02-12T00:00:00",
            "completed": false
          },
          {
            "id": "93ab061b-6863-4b68-99ad-9b99065e8bab",
            "title": "Test",
            "due_date": "2024-03-23T00:00:00",
            "completed": false
          },
          {
            "id": "ed10bdbd-8e6c-475f-ad27-4ed8e3888a6f",
            "title": "Essay",
            "due_date": "2024-02-24T00:00:00",
            "completed": false
          },
          {
            "id": "9442f058-5514-407d-9d58-3b15460b899e",
            "title": "Discussion",
            "due_date": "2024-03-20T00:00:00",
            "completed": false
          },
          {
            "id": "413a4cc1-6449-41bc-84e8-b6e6f8f24eba",
            "title": "Homework",
            "due_date": "2024-03-02T00:00:00",
            "completed": false
          },
          {
            "id": "1a13ce11-4923-42ff-a6a6-31266e807717",
            "title": "Essay",
            "due_date": "2024-01-16T00:00:00",
            "completed": false
          },
          {
            "id": "b4f5d6b2-3e81-4d78-850c-8cfba67a329c",
            "title": "Paper",
            "due_date": "2024-03-11T00:00:00",
            "completed": false
          },
          {
            "id": "522e4267-8fc9-406e-805d-8f9f3cc01ac8",
            "title": "Homework",
            "due_date": "2024-03-22T00:00:00",
            "completed": false
          },
          {
            "id": "357367b2-a3d6-4be1-ad86-c237f5685aeb",
            "title": "Quiz",
            "due_date": "2024-04-26T00:00:00",
            "completed": false
          },
          {
            "id": "dfb00ddc-4dbc-4148-9051-dc04684ae94c",
            "title": "Essay",
            "due_date": "2024-03-21T00:00:00",
            "completed": false
          },
          {
            "id": "62a45401-7a1a-4383-b92d-dd47abe03dc4",
            "title": "Project",
            "due_date": "2024-01-20T00:00:00",
            "completed": false
          },
          {
            "id": "230080ea-909c-435d-9968-f9a0c7c4aefe",
            "title": "Quiz",
            "due_date": "2024-03-19T00:00:00",
            "completed": false
          },
          {
            "id": "8b6dbf6f-3176-4072-86e5-eaaa7cbae771",
            "title": "Project",
            "due_date": "2024-02-29T00:00:00",
            "completed": false
          },
          {
            "id": "7c4bda2e-159f-4fae-9118-72052d75d193",
            "title": "Test",
            "due_date": "2024-04-24T00:00:00",
            "completed": false
          },
          {
            "id": "cb3a291f-b1e4-41d9-aeb1-946041fdd5fa",
            "title": "Presentation",
            "due_date": "2024-01-15T00:00:00",
            "completed": false
          },
          {
            "id": "7b5eb249-86a6-4999-9ddc-40a89e689f8d",
            "title": "Reading",
            "due_date": "2024-01-14T00:00:00",
            "completed": false
          },
          {
            "id": "720433f8-afda-4005-9c0e-f3ede322b6c0",
            "title": "Exam",
            "due_date": "2024-03-30T00:00:00",
            "completed": false
          },
          {
            "id": "b2de13a1-82a3-4766-9309-7106bbff8c4a",
            "title": "Exam",
            "due_date": "2024-04-17T00:00:00",
            "completed": false
          },
          {
            "id": "d8e11232-81f1-494d-b189-6cebefe3efff",
            "title": "Discussion",
            "due_date": "2024-02-09T00:00:00",
            "completed": false
          },
          {
            "id": "69caee69-db36-48e2-b125-79e865375c34",
            "title": "Test",
            "due_date": "2024-04-08T00:00:00",
            "completed": false
          },
          {
            "id": "162396c6-9788-4638-9c96-405ccd6bf3ed",
            "title": "Final",
            "due_date": "2024-02-21T00:00:00",
            "completed": false
          },
          {
            "id": "8f49d591-a34b-42a5-a2c9-36a4a7893c90",
            "title": "Final",
            "due_date": "2024-02-06T00:00:00",
            "completed": false
          },
          {
            "id": "9b2c1604-264b-4c81-94ce-99326962d5f1",
            "title": "Exam",
            "due_date": "2024-04-16T00:00:00",
            "completed": false
          },
          {
            "id": "f5bd66c4-07dd-410c-b0b0-af2b0b8b16c6",
            "title": "Presentation",
            "due_date": "2024-03-02T00:00:00",
            "completed": false
          },
          {
            "id": "ed381488-9fbc-4997-ab68-0f2450d3b2a7",
            "title": "Exam",
            "due_date": "2024-03-20T00:00:00",
            "completed": false
          },
          {
            "id": "4f988fb3-4961-4821-8c82-001635445530",
            "title": "Project",
            "due_date": "2024-01-28T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "5719578e-b880-45af-820f-2e8f96542ad4",
        "grade": 94.07
      },
      {
        "id": "a4a298ef-3928-4bc2-9257-da3a33f32fd3",
        "title": "Golden Age Latin Prose",
        "credit_hours": 3,
        "short_id": "LATN 3020",
        "description": "Latin prose through readings from Cicero and from other Latin prose authors.",
        "assignments": [
          {
            "id": "d6eada7f-bb5a-4943-959d-35780a0330e7",
            "title": "Reading",
            "due_date": "2024-06-02T00:00:00",
            "completed": false
          },
          {
            "id": "640e7339-6e3a-4753-bb3a-c91966bff746",
            "title": "Presentation",
            "due_date": "2024-07-12T00:00:00",
            "completed": false
          },
          {
            "id": "445996ee-2269-4edf-a53c-efdb4eef6947",
            "title": "Final",
            "due_date": "2024-07-02T00:00:00",
            "completed": false
          },
          {
            "id": "318febe8-9c53-4166-b897-5b80b7b64d71",
            "title": "Test",
            "due_date": "2024-06-03T00:00:00",
            "completed": false
          },
          {
            "id": "935110f2-5484-419c-8bc5-7fcac28e858b",
            "title": "Reading",
            "due_date": "2024-07-09T00:00:00",
            "completed": false
          },
          {
            "id": "10d5456b-e99d-427b-85bf-97b243b8f71b",
            "title": "Quiz",
            "due_date": "2024-07-10T00:00:00",
            "completed": false
          },
          {
            "id": "d663d846-c7f5-4b57-8650-cfef706f6da2",
            "title": "Discussion",
            "due_date": "2024-07-13T00:00:00",
            "completed": false
          },
          {
            "id": "0b2f10d3-ad89-4cf9-885a-78d05e9a028f",
            "title": "Final",
            "due_date": "2024-06-21T00:00:00",
            "completed": false
          },
          {
            "id": "a1e1db7c-bd6f-48c4-ba0b-59c1d011f9aa",
            "title": "Reading",
            "due_date": "2024-06-14T00:00:00",
            "completed": false
          },
          {
            "id": "aa28233f-a0c7-4907-a0fd-390410e857f8",
            "title": "Exam",
            "due_date": "2024-07-11T00:00:00",
            "completed": false
          },
          {
            "id": "fefb23e6-ca06-41b5-b755-4f786724a2a7",
            "title": "Presentation",
            "due_date": "2024-06-03T00:00:00",
            "completed": false
          },
          {
            "id": "02a0a52c-89a1-4c47-8ad3-b629e2b14eb8",
            "title": "Lab",
            "due_date": "2024-07-13T00:00:00",
            "completed": false
          },
          {
            "id": "15be21d1-69e5-48b1-a5cc-1d5424758184",
            "title": "Presentation",
            "due_date": "2024-06-18T00:00:00",
            "completed": false
          },
          {
            "id": "3ff98e4d-6ecf-482e-90ca-85dbeaae5770",
            "title": "Essay",
            "due_date": "2024-06-29T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "1659b774-1766-4aa0-b8a9-f33f34d318bd",
        "grade": 90.56
      },
      {
        "id": "88626314-4e48-4e43-b67f-a9120f400410",
        "title": "Computing, Ethics, and Society",
        "credit_hours": 3,
        "short_id": "CSCI 3030",
        "description": "Introduction to social and ethical issues relating to computer science and information technology. Topics include privacy, intellectual property, open-source software, the digital divide, globalization, professional ethics, social justice issues, and current events. Students should have a working knowledge of personal computing.",
        "assignments": [
          {
            "id": "99b6c514-1937-4acd-881e-1a95e3617602",
            "title": "Quiz",
            "due_date": "2024-07-07T00:00:00",
            "completed": false
          },
          {
            "id": "97c9ead0-94e4-487e-810c-1256dd56f1b7",
            "title": "Essay",
            "due_date": "2024-06-13T00:00:00",
            "completed": false
          },
          {
            "id": "08cba04e-4389-433c-b089-f43f4bc1c71f",
            "title": "Discussion",
            "due_date": "2024-06-03T00:00:00",
            "completed": false
          },
          {
            "id": "c6b461c0-d548-405a-837a-6422ab236244",
            "title": "Test",
            "due_date": "2024-06-10T00:00:00",
            "completed": false
          },
          {
            "id": "8561e78c-1fac-4311-b3db-2dd7a70164df",
            "title": "Quiz",
            "due_date": "2024-07-11T00:00:00",
            "completed": false
          },
          {
            "id": "58c71bf0-76dd-44b2-8b53-4c3857d5b93b",
            "title": "Final",
            "due_date": "2024-06-07T00:00:00",
            "completed": false
          },
          {
            "id": "6ab91c85-a9a0-4278-a673-d866686b86c4",
            "title": "Lab",
            "due_date": "2024-06-21T00:00:00",
            "completed": false
          },
          {
            "id": "bd144c76-245d-4dfb-a985-f205cff0ba7d",
            "title": "Exam",
            "due_date": "2024-06-05T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "1659b774-1766-4aa0-b8a9-f33f34d318bd",
        "grade": 94.78
      },
      {
        "id": "25f49994-fb98-4046-80b2-e46aba9e5059",
        "title": "Sequences and Series",
        "credit_hours": 3,
        "short_id": "MATH 3100",
        "description": "Precise definitions of limit and convergence concepts; practical tests for convergence of infinite series; power series representations and numerical error estimates; applications to calculus and explicit summation formulae; trigonometric series.",
        "assignments": [
          {
            "id": "e7f2cef6-9dfa-4ce1-84c1-fd14205ff9c3",
            "title": "Presentation",
            "due_date": "2024-08-25T00:00:00",
            "completed": false
          },
          {
            "id": "288c2e06-9e34-4ad7-848e-d7d4329564f7",
            "title": "Lab",
            "due_date": "2024-08-29T00:00:00",
            "completed": false
          },
          {
            "id": "799b13fd-656a-4175-8e8d-0bb8c635298e",
            "title": "Quiz",
            "due_date": "2024-11-15T00:00:00",
            "completed": false
          },
          {
            "id": "5deaf7ab-1add-44f8-a266-72d1ec93fc91",
            "title": "Essay",
            "due_date": "2024-09-17T00:00:00",
            "completed": false
          },
          {
            "id": "544b752a-b6ab-438e-94af-3c4b9dc84036",
            "title": "Discussion",
            "due_date": "2024-10-04T00:00:00",
            "completed": false
          },
          {
            "id": "1c4b3472-019f-4329-8814-03d86ccb5822",
            "title": "Homework",
            "due_date": "2024-09-04T00:00:00",
            "completed": false
          },
          {
            "id": "5b47c0f8-80f3-4421-a2c2-9e5face7ae83",
            "title": "Presentation",
            "due_date": "2024-10-09T00:00:00",
            "completed": false
          },
          {
            "id": "d084ce08-52bb-4754-b9b3-ea10cf739fd8",
            "title": "Discussion",
            "due_date": "2024-08-22T00:00:00",
            "completed": false
          },
          {
            "id": "c268734c-19c0-48e3-bbac-60caa47ff765",
            "title": "Quiz",
            "due_date": "2024-11-18T00:00:00",
            "completed": false
          },
          {
            "id": "4005d12e-b5f3-48d7-a233-e34c2df31f2a",
            "title": "Paper",
            "due_date": "2024-11-21T00:00:00",
            "completed": false
          },
          {
            "id": "f15e889f-c930-4498-9eab-fb6e4047948a",
            "title": "Paper",
            "due_date": "2024-11-21T00:00:00",
            "completed": false
          },
          {
            "id": "bc0d4684-6cb3-4491-9e0a-bb648f3e7673",
            "title": "Reading",
            "due_date": "2024-11-15T00:00:00",
            "completed": false
          },
          {
            "id": "88651ca3-a3c0-4098-8190-77f9706b686a",
            "title": "Paper",
            "due_date": "2024-09-01T00:00:00",
            "completed": false
          },
          {
            "id": "60761c50-267d-4341-9ee5-c83b7724fcfe",
            "title": "Project",
            "due_date": "2024-10-21T00:00:00",
            "completed": false
          },
          {
            "id": "a3a17d48-22cd-4ae8-a5e3-c2ad106e24c5",
            "title": "Project",
            "due_date": "2024-09-14T00:00:00",
            "completed": false
          },
          {
            "id": "138c10f6-ca7c-4288-b737-fd7718e03cc1",
            "title": "Discussion",
            "due_date": "2024-09-08T00:00:00",
            "completed": false
          },
          {
            "id": "0011660e-5b86-49fc-80d4-8f7a2414ce23",
            "title": "Paper",
            "due_date": "2024-08-09T00:00:00",
            "completed": false
          },
          {
            "id": "424caa32-3ee9-4a05-8135-ed3d71bb38b5",
            "title": "Exam",
            "due_date": "2024-08-18T00:00:00",
            "completed": false
          },
          {
            "id": "2e91df1f-392d-43ca-ac89-d513500e531d",
            "title": "Lab",
            "due_date": "2024-09-25T00:00:00",
            "completed": false
          },
          {
            "id": "3ef6a815-6601-46aa-add8-47989ec3786b",
            "title": "Project",
            "due_date": "2024-11-23T00:00:00",
            "completed": false
          },
          {
            "id": "b0f86f70-1a72-4850-9ae1-7cd0384d01c8",
            "title": "Test",
            "due_date": "2024-11-02T00:00:00",
            "completed": false
          },
          {
            "id": "22d0275e-f6e0-4468-9a81-6563a55864b8",
            "title": "Presentation",
            "due_date": "2024-09-05T00:00:00",
            "completed": false
          },
          {
            "id": "9862da05-b75c-496d-91cd-5271269769d9",
            "title": "Presentation",
            "due_date": "2024-08-10T00:00:00",
            "completed": false
          },
          {
            "id": "325d685f-9483-4b84-b264-96376d7b36bf",
            "title": "Test",
            "due_date": "2024-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "ad4cdae2-a59d-46f3-b64e-f7d927cf6705",
            "title": "Reading",
            "due_date": "2024-10-07T00:00:00",
            "completed": false
          },
          {
            "id": "c7e9c203-d61e-44b7-b7d9-9890626ddbed",
            "title": "Essay",
            "due_date": "2024-08-14T00:00:00",
            "completed": false
          },
          {
            "id": "007a282e-6716-40bc-8d7d-370ae6f08592",
            "title": "Lab",
            "due_date": "2024-10-09T00:00:00",
            "completed": false
          },
          {
            "id": "99182da6-2a92-4114-b40e-a5ac2b36c9a9",
            "title": "Project",
            "due_date": "2024-11-12T00:00:00",
            "completed": false
          },
          {
            "id": "82c73dc0-63ff-492a-916c-365329c32e58",
            "title": "Lab",
            "due_date": "2024-09-26T00:00:00",
            "completed": false
          },
          {
            "id": "936cb497-f409-4436-b8af-4c32c6645f29",
            "title": "Reading",
            "due_date": "2024-10-21T00:00:00",
            "completed": false
          },
          {
            "id": "e9bd2417-6cc6-4d5b-864f-146cd5f96ca1",
            "title": "Test",
            "due_date": "2024-08-15T00:00:00",
            "completed": false
          },
          {
            "id": "bf2ddbfb-7adc-49ee-9874-e75b6f3d05de",
            "title": "Test",
            "due_date": "2024-11-26T00:00:00",
            "completed": false
          },
          {
            "id": "fdd0c2cc-2cf5-46b9-83cd-f5d48f825879",
            "title": "Essay",
            "due_date": "2024-09-02T00:00:00",
            "completed": false
          },
          {
            "id": "81d4120d-86f3-40d4-b7b2-7916fe08d355",
            "title": "Paper",
            "due_date": "2024-09-27T00:00:00",
            "completed": false
          },
          {
            "id": "80d6c9de-b0f9-4e32-9af9-44d9599d7422",
            "title": "Quiz",
            "due_date": "2024-08-10T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "e0b8c789-0a66-46c7-9c70-6098ad0d2d77",
        "grade": 94.45
      },
      {
        "id": "ea57acbb-e9f2-4916-9d2c-801a920dc5f7",
        "title": "Introduction to Higher Mathematics",
        "credit_hours": 3,
        "short_id": "MATH 3200",
        "description": "Mathematical reasoning and writing mathematical proofs, the two essential skills for success in upper division course work in mathematics. Topics include logic, integers and induction, sets and relations, equivalence relations, and functions (including injectivity and surjectivity).",
        "assignments": [
          {
            "id": "b3f6c21e-2ac1-45d8-b80d-ffdbdff82e8d",
            "title": "Paper",
            "due_date": "2024-09-05T00:00:00",
            "completed": false
          },
          {
            "id": "8bd96b02-5ef2-4160-9f58-bbd29e2121ea",
            "title": "Reading",
            "due_date": "2024-08-19T00:00:00",
            "completed": false
          },
          {
            "id": "bc110839-11d3-4484-869e-66043ab9005b",
            "title": "Essay",
            "due_date": "2024-11-18T00:00:00",
            "completed": false
          },
          {
            "id": "e6ed0e14-8744-48a1-b238-0e6b9725b6c7",
            "title": "Homework",
            "due_date": "2024-10-29T00:00:00",
            "completed": false
          },
          {
            "id": "45553baf-de9c-4adb-b6db-ec98e399a86e",
            "title": "Homework",
            "due_date": "2024-08-11T00:00:00",
            "completed": false
          },
          {
            "id": "4558b987-6ea4-451e-b888-3b5b4d05dd3a",
            "title": "Homework",
            "due_date": "2024-11-11T00:00:00",
            "completed": false
          },
          {
            "id": "338e8867-fd86-4feb-bb45-b14162109e4f",
            "title": "Discussion",
            "due_date": "2024-08-15T00:00:00",
            "completed": false
          },
          {
            "id": "067ea26f-fdac-4493-b48d-a1120af38986",
            "title": "Lab",
            "due_date": "2024-11-24T00:00:00",
            "completed": false
          },
          {
            "id": "985a7ef5-e117-4ec0-876f-ca521d00f291",
            "title": "Essay",
            "due_date": "2024-08-19T00:00:00",
            "completed": false
          },
          {
            "id": "24552011-afbb-4f96-aae8-8da6c02f88c1",
            "title": "Discussion",
            "due_date": "2024-08-15T00:00:00",
            "completed": false
          },
          {
            "id": "328b5d93-66ce-4cf5-adaf-1aef2aa6d77d",
            "title": "Lab",
            "due_date": "2024-10-19T00:00:00",
            "completed": false
          },
          {
            "id": "6c2b1313-35fe-4cde-95d4-3621ab8804e9",
            "title": "Lab",
            "due_date": "2024-10-27T00:00:00",
            "completed": false
          },
          {
            "id": "58f1a44a-bbb6-4e6f-afba-ed97dba441f5",
            "title": "Reading",
            "due_date": "2024-09-29T00:00:00",
            "completed": false
          },
          {
            "id": "63935d2a-8bf6-43f3-89d4-d8e007f73069",
            "title": "Quiz",
            "due_date": "2024-09-03T00:00:00",
            "completed": false
          },
          {
            "id": "4bebc866-f7a3-4b4a-9cba-98a83a088f68",
            "title": "Paper",
            "due_date": "2024-09-17T00:00:00",
            "completed": false
          },
          {
            "id": "ef7682e9-507f-4628-9d0a-9a3a3ad72e35",
            "title": "Project",
            "due_date": "2024-09-28T00:00:00",
            "completed": false
          },
          {
            "id": "e46ec23e-f660-448f-80c2-4556d8baf3ca",
            "title": "Lab",
            "due_date": "2024-11-01T00:00:00",
            "completed": false
          },
          {
            "id": "488fc8cf-8c1c-46fb-a132-0cced9114868",
            "title": "Homework",
            "due_date": "2024-11-01T00:00:00",
            "completed": false
          },
          {
            "id": "deb43a52-084e-4417-b6ea-2473946bda1d",
            "title": "Project",
            "due_date": "2024-10-13T00:00:00",
            "completed": false
          },
          {
            "id": "d1c6ecd2-a79a-4196-970c-9bdee8c549c7",
            "title": "Project",
            "due_date": "2024-08-12T00:00:00",
            "completed": false
          },
          {
            "id": "e3134ac0-73ce-4d27-9153-98328c696164",
            "title": "Final",
            "due_date": "2024-10-21T00:00:00",
            "completed": false
          },
          {
            "id": "90ab4ee0-0da6-429c-bb0d-25adfbee8eb4",
            "title": "Essay",
            "due_date": "2024-10-16T00:00:00",
            "completed": false
          },
          {
            "id": "04582430-eeb5-43d7-92c4-7ab93bffe5b2",
            "title": "Test",
            "due_date": "2024-11-21T00:00:00",
            "completed": false
          },
          {
            "id": "6856c53d-e277-4cd1-89d7-8fab688bcdd9",
            "title": "Lab",
            "due_date": "2024-09-18T00:00:00",
            "completed": false
          },
          {
            "id": "0ada934b-da84-445b-b772-cf44518631bf",
            "title": "Presentation",
            "due_date": "2024-08-07T00:00:00",
            "completed": false
          },
          {
            "id": "c3e5123f-5388-4b29-80cc-b15573e6267e",
            "title": "Project",
            "due_date": "2024-09-28T00:00:00",
            "completed": false
          },
          {
            "id": "dcec11fe-4f6e-43bc-9fb7-24e398146e9a",
            "title": "Project",
            "due_date": "2024-09-19T00:00:00",
            "completed": false
          },
          {
            "id": "d623351b-6bda-4fbd-b84c-f8b9b83894ee",
            "title": "Test",
            "due_date": "2024-10-03T00:00:00",
            "completed": false
          },
          {
            "id": "306eb20c-5ab8-42a5-80f0-b18fc33840c8",
            "title": "Final",
            "due_date": "2024-08-11T00:00:00",
            "completed": false
          },
          {
            "id": "eab11ba9-b67d-4335-8a59-a63fb256a1b3",
            "title": "Test",
            "due_date": "2024-10-05T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "e0b8c789-0a66-46c7-9c70-6098ad0d2d77",
        "grade": 90.41
      },
      {
        "id": "fba7eefa-f93f-4944-9b4b-a32863c0a039",
        "title": "Advanced Problem Solving",
        "credit_hours": 1,
        "short_id": "MATH 3220",
        "description": "Strategies and tactics for solving advanced problems in undergraduate mathematics, designed to prepare students for a challenging external exam (Putnam Exam/Mathematics Subject GRE/Actuarial Exam) which is ordinarily a required part of the course.",
        "assignments": [
          {
            "id": "bb5e6e73-2874-4296-9d35-04b98faf84a1",
            "title": "Homework",
            "due_date": "2024-10-20T00:00:00",
            "completed": false
          },
          {
            "id": "85b43c79-b9d7-4268-86ab-62b56874af20",
            "title": "Homework",
            "due_date": "2024-10-20T00:00:00",
            "completed": false
          },
          {
            "id": "e89272eb-e1a3-4fca-891b-808f0cfaa5f0",
            "title": "Essay",
            "due_date": "2024-10-12T00:00:00",
            "completed": false
          },
          {
            "id": "0f17f195-7e6d-4209-85ea-e31a612e00dd",
            "title": "Exam",
            "due_date": "2024-08-07T00:00:00",
            "completed": false
          },
          {
            "id": "8b3a50cb-946c-46ec-80f8-c2d6910d3af6",
            "title": "Presentation",
            "due_date": "2024-08-16T00:00:00",
            "completed": false
          },
          {
            "id": "5647aaee-34a0-4b42-b3b7-7d1370985421",
            "title": "Project",
            "due_date": "2024-08-05T00:00:00",
            "completed": false
          },
          {
            "id": "822af97f-be1d-4067-a711-4a8dbe055199",
            "title": "Essay",
            "due_date": "2024-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "16412dde-7a2d-45b5-a678-3b0b17027900",
            "title": "Presentation",
            "due_date": "2024-09-06T00:00:00",
            "completed": false
          },
          {
            "id": "dbacf64a-7ed9-4e3b-ac48-19eb119b10a1",
            "title": "Exam",
            "due_date": "2024-10-12T00:00:00",
            "completed": false
          },
          {
            "id": "84b0a770-8cdc-4091-8d4c-864f5543537e",
            "title": "Paper",
            "due_date": "2024-10-04T00:00:00",
            "completed": false
          },
          {
            "id": "18352988-9693-4e9d-8cb7-f290bab9ec9a",
            "title": "Paper",
            "due_date": "2024-09-29T00:00:00",
            "completed": false
          },
          {
            "id": "7817e1ed-7e87-45f0-97a5-a00fef3c89d3",
            "title": "Project",
            "due_date": "2024-09-24T00:00:00",
            "completed": false
          },
          {
            "id": "dde8917e-0b17-4050-bd85-0aec966a7ef9",
            "title": "Discussion",
            "due_date": "2024-10-01T00:00:00",
            "completed": false
          },
          {
            "id": "7ae5deef-28eb-4256-86f7-9a2398721bdb",
            "title": "Essay",
            "due_date": "2024-08-12T00:00:00",
            "completed": false
          },
          {
            "id": "93ec84ce-9abf-4c39-8b69-8bd271b75ade",
            "title": "Project",
            "due_date": "2024-08-21T00:00:00",
            "completed": false
          },
          {
            "id": "315964a8-7499-4910-a83e-82338197e592",
            "title": "Exam",
            "due_date": "2024-08-14T00:00:00",
            "completed": false
          },
          {
            "id": "ba37abfc-b7ec-4ab1-928d-8de74fdb63c5",
            "title": "Quiz",
            "due_date": "2024-09-17T00:00:00",
            "completed": false
          },
          {
            "id": "769ebe4d-3775-492b-a4c2-ff9a29806c43",
            "title": "Final",
            "due_date": "2024-11-16T00:00:00",
            "completed": false
          },
          {
            "id": "45cf92db-6423-4dfc-a62e-dcb3761115c2",
            "title": "Discussion",
            "due_date": "2024-10-29T00:00:00",
            "completed": false
          },
          {
            "id": "96546e55-3604-41c6-ad4d-6741ed65af8b",
            "title": "Paper",
            "due_date": "2024-11-12T00:00:00",
            "completed": false
          },
          {
            "id": "9c52b592-8c5d-4a0d-936a-4630b013c0ff",
            "title": "Quiz",
            "due_date": "2024-08-24T00:00:00",
            "completed": false
          },
          {
            "id": "9a6459e5-a771-4023-beac-722ad8000a13",
            "title": "Lab",
            "due_date": "2024-08-04T00:00:00",
            "completed": false
          },
          {
            "id": "b6028b6e-1f2f-4104-bdfa-b98ecf8457c2",
            "title": "Project",
            "due_date": "2024-10-06T00:00:00",
            "completed": false
          },
          {
            "id": "124fff1a-ed96-40ae-8f97-67b8cf7bbd74",
            "title": "Homework",
            "due_date": "2024-10-08T00:00:00",
            "completed": false
          },
          {
            "id": "0b2e43b1-e770-49e6-b7c3-c6df5830b329",
            "title": "Exam",
            "due_date": "2024-08-24T00:00:00",
            "completed": false
          },
          {
            "id": "48d69a1d-eee8-4e00-9dca-1461494b58c1",
            "title": "Lab",
            "due_date": "2024-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "1a043ce0-b770-4283-8d8c-8947cf7e5d90",
            "title": "Presentation",
            "due_date": "2024-09-30T00:00:00",
            "completed": false
          },
          {
            "id": "ad11e98a-e842-4ca5-804d-eb819affcdee",
            "title": "Essay",
            "due_date": "2024-11-26T00:00:00",
            "completed": false
          },
          {
            "id": "c5f2a77b-38b2-4139-b461-64b78a774d84",
            "title": "Project",
            "due_date": "2024-11-15T00:00:00",
            "completed": false
          },
          {
            "id": "ad4628ba-0a32-4e90-90ec-a3ea99263b9d",
            "title": "Quiz",
            "due_date": "2024-10-27T00:00:00",
            "completed": false
          },
          {
            "id": "4a197c71-2442-4800-93ad-1ca901f5504f",
            "title": "Quiz",
            "due_date": "2024-11-03T00:00:00",
            "completed": false
          },
          {
            "id": "c540b441-7c3f-4906-8f1c-4ceb3ec5cfda",
            "title": "Final",
            "due_date": "2024-10-18T00:00:00",
            "completed": false
          },
          {
            "id": "ff5abd12-0004-4653-8a23-a3304d0c9dde",
            "title": "Lab",
            "due_date": "2024-10-14T00:00:00",
            "completed": false
          },
          {
            "id": "570d9833-fc16-458b-9ce1-7bdc3c1bb2c0",
            "title": "Lab",
            "due_date": "2024-09-29T00:00:00",
            "completed": false
          },
          {
            "id": "395e5416-d8be-4b70-8542-c8c3318e50a0",
            "title": "Lab",
            "due_date": "2024-09-03T00:00:00",
            "completed": false
          },
          {
            "id": "dd66e2f0-f0f9-4927-8355-92d9e6b2a904",
            "title": "Homework",
            "due_date": "2024-10-23T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "e0b8c789-0a66-46c7-9c70-6098ad0d2d77",
        "grade": 98.96
      },
      {
        "id": "04f8309e-af0c-4362-b4fc-4b744b58659b",
        "title": "Applied Linear Algebra",
        "credit_hours": 3,
        "short_id": "MATH 3300",
        "description": "Linear algebra from an applied and computational viewpoint. Linear equations, vector spaces, linear transformations; linear independence, basis, dimension; orthogonality, projections, and least squares solutions; eigenvalues, eigenvectors, singular value decomposition. Applications to science and engineering.",
        "assignments": [
          {
            "id": "a1a2787b-69ed-46c8-bd93-34782eac858a",
            "title": "Discussion",
            "due_date": "2024-08-21T00:00:00",
            "completed": false
          },
          {
            "id": "56ad4b57-dce4-42e0-858a-3535b1975218",
            "title": "Project",
            "due_date": "2024-08-22T00:00:00",
            "completed": false
          },
          {
            "id": "51128e83-3711-4bce-8592-6bcc12dbfdc9",
            "title": "Final",
            "due_date": "2024-09-20T00:00:00",
            "completed": false
          },
          {
            "id": "055bd15f-fd8c-4b8c-b826-03eda72e7b75",
            "title": "Lab",
            "due_date": "2024-09-24T00:00:00",
            "completed": false
          },
          {
            "id": "0c230b69-f5e1-48bb-8a48-e3c13f9ae1a7",
            "title": "Lab",
            "due_date": "2024-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "f79cc6e5-07d3-46cf-8b63-26dab32129a6",
            "title": "Lab",
            "due_date": "2024-09-26T00:00:00",
            "completed": false
          },
          {
            "id": "5e275e84-2782-4e0a-8ec4-90ca29dba58d",
            "title": "Essay",
            "due_date": "2024-08-04T00:00:00",
            "completed": false
          },
          {
            "id": "a2c84a0a-f385-4d68-bb9f-a08f493b7ce5",
            "title": "Presentation",
            "due_date": "2024-09-09T00:00:00",
            "completed": false
          },
          {
            "id": "653421bb-4642-4ca7-b48a-e297096777a6",
            "title": "Lab",
            "due_date": "2024-11-18T00:00:00",
            "completed": false
          },
          {
            "id": "8d2991d4-732c-4efe-8b5c-7ca5479c0748",
            "title": "Project",
            "due_date": "2024-10-08T00:00:00",
            "completed": false
          },
          {
            "id": "c2ea6e0e-ebf6-478e-ae7d-28d22c6629bf",
            "title": "Paper",
            "due_date": "2024-11-24T00:00:00",
            "completed": false
          },
          {
            "id": "e2de9c3e-6971-4ed1-82c6-e523b19e09a0",
            "title": "Quiz",
            "due_date": "2024-11-21T00:00:00",
            "completed": false
          },
          {
            "id": "728e7c66-02a0-4012-a64b-764d2f0004ce",
            "title": "Project",
            "due_date": "2024-08-05T00:00:00",
            "completed": false
          },
          {
            "id": "537d245e-8e87-426d-af8a-d181214685d8",
            "title": "Homework",
            "due_date": "2024-08-19T00:00:00",
            "completed": false
          },
          {
            "id": "bea26375-2600-4b65-acbc-7d3c8ebf6168",
            "title": "Presentation",
            "due_date": "2024-08-12T00:00:00",
            "completed": false
          },
          {
            "id": "527e2293-a10b-4cc5-bbbd-2bc8339c67f6",
            "title": "Test",
            "due_date": "2024-09-16T00:00:00",
            "completed": false
          },
          {
            "id": "8238c626-c575-4290-be66-0bccc85b477d",
            "title": "Reading",
            "due_date": "2024-10-05T00:00:00",
            "completed": false
          },
          {
            "id": "9f65390b-a9c1-49ee-a240-08a2603d7b49",
            "title": "Final",
            "due_date": "2024-08-27T00:00:00",
            "completed": false
          },
          {
            "id": "69b071b6-f2e7-41d2-9e3d-3dc4db2ec9e0",
            "title": "Homework",
            "due_date": "2024-08-23T00:00:00",
            "completed": false
          },
          {
            "id": "cbc527ab-b041-4244-86d8-524c25fc3edb",
            "title": "Project",
            "due_date": "2024-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "15f09451-ce8d-4b68-a5ad-5e56472208f2",
            "title": "Quiz",
            "due_date": "2024-09-09T00:00:00",
            "completed": false
          },
          {
            "id": "20bc1846-aaf7-4032-a430-c70b38d394ad",
            "title": "Test",
            "due_date": "2024-11-11T00:00:00",
            "completed": false
          },
          {
            "id": "0d162b29-3fab-47ce-846e-65c9445d78cf",
            "title": "Essay",
            "due_date": "2024-08-06T00:00:00",
            "completed": false
          },
          {
            "id": "5c244107-6b3d-4eed-ae73-4ddc2ec7ae02",
            "title": "Exam",
            "due_date": "2024-08-04T00:00:00",
            "completed": false
          },
          {
            "id": "b42ad849-fc84-41d7-8447-bb417ad5c73b",
            "title": "Lab",
            "due_date": "2024-11-23T00:00:00",
            "completed": false
          },
          {
            "id": "043447b9-2d8c-4845-b283-4b945fce00e7",
            "title": "Project",
            "due_date": "2024-09-23T00:00:00",
            "completed": false
          },
          {
            "id": "a616a447-b794-47c4-912b-497afe10345b",
            "title": "Reading",
            "due_date": "2024-11-16T00:00:00",
            "completed": false
          },
          {
            "id": "a9aab720-8d39-41ec-8e13-0f91fe850884",
            "title": "Project",
            "due_date": "2024-08-07T00:00:00",
            "completed": false
          },
          {
            "id": "037fb7a3-b665-4a8c-9ace-6d16d23332a8",
            "title": "Lab",
            "due_date": "2024-09-08T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "e0b8c789-0a66-46c7-9c70-6098ad0d2d77",
        "grade": 93.76
      },
      {
        "id": "19c28eff-2110-4e61-b52f-1479c6b0be1b",
        "title": "Data Science I",
        "credit_hours": 4,
        "short_id": "CSCI 3360",
        "description": "A rigorous overview of methods for text mining, image processing, and scientific computing. Core concepts in supervised and unsupervised analytics, dimensionality reduction, and data visualization will be explored in depth.",
        "assignments": [
          {
            "id": "6be6d8d0-d2ac-484d-a913-33374eced572",
            "title": "Test",
            "due_date": "2024-09-03T00:00:00",
            "completed": false
          },
          {
            "id": "8d233002-6073-43c3-8127-a5a4e8af78b9",
            "title": "Paper",
            "due_date": "2024-08-20T00:00:00",
            "completed": false
          },
          {
            "id": "cdd4858f-35cd-4266-8b44-9771e1bcace6",
            "title": "Lab",
            "due_date": "2024-09-02T00:00:00",
            "completed": false
          },
          {
            "id": "cad2f075-35f5-4aaa-948f-f98298a7f271",
            "title": "Homework",
            "due_date": "2024-09-20T00:00:00",
            "completed": false
          },
          {
            "id": "7f609702-00cf-42ff-b04e-47093c78c67b",
            "title": "Project",
            "due_date": "2024-11-07T00:00:00",
            "completed": false
          },
          {
            "id": "660490f9-bc49-400b-9ee8-1bf169d193f9",
            "title": "Paper",
            "due_date": "2024-09-15T00:00:00",
            "completed": false
          },
          {
            "id": "bdfcfeff-9eae-4d2b-9efe-1e69a426643b",
            "title": "Test",
            "due_date": "2024-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "b1269d47-c516-4ea9-8c9a-49274a97de07",
            "title": "Homework",
            "due_date": "2024-10-07T00:00:00",
            "completed": false
          },
          {
            "id": "96f07ecc-ea6c-419a-bb6b-5438aa8385f9",
            "title": "Quiz",
            "due_date": "2024-11-25T00:00:00",
            "completed": false
          },
          {
            "id": "b9dad67b-6add-4573-8133-b3963a0b639b",
            "title": "Paper",
            "due_date": "2024-10-05T00:00:00",
            "completed": false
          },
          {
            "id": "e0722deb-1630-4c75-9e7e-ac5698ebeb73",
            "title": "Quiz",
            "due_date": "2024-11-09T00:00:00",
            "completed": false
          },
          {
            "id": "160436e1-26b4-4304-92dc-ee9f4206b156",
            "title": "Homework",
            "due_date": "2024-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "017f0ce0-197a-4f92-ab3d-5653f28f6a7f",
            "title": "Test",
            "due_date": "2024-11-08T00:00:00",
            "completed": false
          },
          {
            "id": "f771c5fb-0e80-4045-a8d1-98be57a8319a",
            "title": "Test",
            "due_date": "2024-08-20T00:00:00",
            "completed": false
          },
          {
            "id": "e930dd92-7ff8-4ca7-80ea-d84e12090133",
            "title": "Project",
            "due_date": "2024-10-28T00:00:00",
            "completed": false
          },
          {
            "id": "b1e376fd-f273-40b1-b16c-1b6793fec8ff",
            "title": "Lab",
            "due_date": "2024-11-14T00:00:00",
            "completed": false
          },
          {
            "id": "5374f758-ee63-4da1-ad61-80635717bddc",
            "title": "Project",
            "due_date": "2024-08-10T00:00:00",
            "completed": false
          },
          {
            "id": "c8900926-ef79-48c3-9d60-5fae511d690e",
            "title": "Discussion",
            "due_date": "2024-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "ba17ff80-19ca-43c7-a75d-3d743082c280",
            "title": "Reading",
            "due_date": "2024-09-10T00:00:00",
            "completed": false
          },
          {
            "id": "825be539-1865-4e62-b717-c2f29928c519",
            "title": "Essay",
            "due_date": "2024-11-04T00:00:00",
            "completed": false
          },
          {
            "id": "e1741951-772b-4810-967a-83be1556ec1e",
            "title": "Test",
            "due_date": "2024-10-09T00:00:00",
            "completed": false
          },
          {
            "id": "4942f431-20ac-499d-ad29-06639fdea292",
            "title": "Homework",
            "due_date": "2024-11-24T00:00:00",
            "completed": false
          },
          {
            "id": "fc6b99d5-61d3-4f2c-8c88-01ae77279b3c",
            "title": "Lab",
            "due_date": "2024-10-05T00:00:00",
            "completed": false
          },
          {
            "id": "bd49a115-3162-44f3-a2c5-a11ede71b85c",
            "title": "Reading",
            "due_date": "2024-10-21T00:00:00",
            "completed": false
          },
          {
            "id": "fe22277a-d4cf-4d0e-a80e-fca448eaa00f",
            "title": "Final",
            "due_date": "2024-09-28T00:00:00",
            "completed": false
          },
          {
            "id": "66b95079-0bf0-4f64-977c-24c429fff3b6",
            "title": "Reading",
            "due_date": "2024-10-26T00:00:00",
            "completed": false
          },
          {
            "id": "357926f7-1210-4b66-a627-9d1dee883bbc",
            "title": "Lab",
            "due_date": "2024-10-25T00:00:00",
            "completed": false
          },
          {
            "id": "42a314f7-2793-43f4-9ee4-0335c784961c",
            "title": "Test",
            "due_date": "2024-08-23T00:00:00",
            "completed": false
          },
          {
            "id": "913e23fd-ac12-40cd-af02-4480d5e5fbe7",
            "title": "Test",
            "due_date": "2024-10-26T00:00:00",
            "completed": false
          },
          {
            "id": "7749aecf-70e3-4898-afd7-b2b041976cbc",
            "title": "Final",
            "due_date": "2024-10-12T00:00:00",
            "completed": false
          },
          {
            "id": "d3e52855-93dc-4bda-b09c-e785cb84cabc",
            "title": "Reading",
            "due_date": "2024-09-24T00:00:00",
            "completed": false
          },
          {
            "id": "90f65474-1b26-4a4b-a22b-8604c2550c24",
            "title": "Reading",
            "due_date": "2024-09-13T00:00:00",
            "completed": false
          },
          {
            "id": "7374de2a-82eb-48f2-9ef5-66d57c86c074",
            "title": "Paper",
            "due_date": "2024-09-29T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "e0b8c789-0a66-46c7-9c70-6098ad0d2d77",
        "grade": 94.95
      },
      {
        "id": "3f93c963-12c1-4ec4-a30f-f2e3da6425ca",
        "title": "Multivariable Mathematics I",
        "credit_hours": 4,
        "short_id": "MATH 3500",
        "description": "Vector algebra and geometry, fundamental concepts of linear algebra, linear transformations, differential calculus of functions of several variables, solutions of linear systems and linear independence, extremum problems and projections. This course and its sequel give an integrated and more proof-oriented treatment of the material in Multivariable Calculus and Introduction to Linear Algebra.",
        "assignments": [
          {
            "id": "bda03617-3a1f-4eab-92f4-519b61e1032b",
            "title": "Paper",
            "due_date": "2025-02-09T00:00:00",
            "completed": false
          },
          {
            "id": "87d43e45-72b0-4a36-976f-6b383dc0a9ad",
            "title": "Presentation",
            "due_date": "2025-01-30T00:00:00",
            "completed": false
          },
          {
            "id": "c690ffbd-9035-4ecb-8a80-38b2d4b1366e",
            "title": "Quiz",
            "due_date": "2025-01-15T00:00:00",
            "completed": false
          },
          {
            "id": "439ab40e-4d14-483a-a95f-98e3bf049661",
            "title": "Test",
            "due_date": "2025-02-13T00:00:00",
            "completed": false
          },
          {
            "id": "c62ed2d5-609f-4ab8-ae8f-cbf66012a4ee",
            "title": "Project",
            "due_date": "2025-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "3eb45ef4-f9d2-4780-818c-c86370238647",
            "title": "Exam",
            "due_date": "2025-02-21T00:00:00",
            "completed": false
          },
          {
            "id": "1ab6ac3d-1efa-4bc7-9ee2-7e2a082041cb",
            "title": "Homework",
            "due_date": "2025-01-31T00:00:00",
            "completed": false
          },
          {
            "id": "3317c5ff-1a13-4535-82ca-69fa5ac52f04",
            "title": "Lab",
            "due_date": "2025-01-20T00:00:00",
            "completed": false
          },
          {
            "id": "3160059d-c222-4194-bad0-9dd1f98ea5bc",
            "title": "Lab",
            "due_date": "2025-02-03T00:00:00",
            "completed": false
          },
          {
            "id": "b0aa2217-945b-4f35-a6f2-85f1f88d8584",
            "title": "Homework",
            "due_date": "2025-04-25T00:00:00",
            "completed": false
          },
          {
            "id": "37ee6e19-2ee8-4baf-9e79-c723cc09b453",
            "title": "Homework",
            "due_date": "2025-04-20T00:00:00",
            "completed": false
          },
          {
            "id": "0547b4ed-b5f0-40cc-a622-48da50be2028",
            "title": "Reading",
            "due_date": "2025-02-17T00:00:00",
            "completed": false
          },
          {
            "id": "5121cf72-b0a0-4909-b33d-9f885ac86729",
            "title": "Test",
            "due_date": "2025-03-25T00:00:00",
            "completed": false
          },
          {
            "id": "dcdb6c21-4069-4906-b762-680349720007",
            "title": "Final",
            "due_date": "2025-03-24T00:00:00",
            "completed": false
          },
          {
            "id": "981cb679-7348-4bee-a210-f5dc7cccbc3d",
            "title": "Paper",
            "due_date": "2025-04-25T00:00:00",
            "completed": false
          },
          {
            "id": "fa214f74-13b1-4e82-be57-8a7b20d45155",
            "title": "Project",
            "due_date": "2025-04-17T00:00:00",
            "completed": false
          },
          {
            "id": "878e04cf-21ce-437a-bdc9-69df68837c08",
            "title": "Project",
            "due_date": "2025-04-17T00:00:00",
            "completed": false
          },
          {
            "id": "8c374ed9-3b4f-4b70-88d7-ce9d1cba517a",
            "title": "Exam",
            "due_date": "2025-03-28T00:00:00",
            "completed": false
          },
          {
            "id": "1cb5071a-4a5f-4b86-ab23-eeb6df0657a2",
            "title": "Reading",
            "due_date": "2025-03-15T00:00:00",
            "completed": false
          },
          {
            "id": "06ef4353-7dd7-4134-93aa-1ed1a8861833",
            "title": "Discussion",
            "due_date": "2025-02-18T00:00:00",
            "completed": false
          },
          {
            "id": "7220a241-2231-4a65-a126-a157660f93db",
            "title": "Lab",
            "due_date": "2025-03-26T00:00:00",
            "completed": false
          },
          {
            "id": "a712dfca-cfc4-41dd-a496-ae39f5595295",
            "title": "Final",
            "due_date": "2025-01-12T00:00:00",
            "completed": false
          },
          {
            "id": "dd3473ff-9fa7-4fd2-b1ae-d46b8c823d09",
            "title": "Presentation",
            "due_date": "2025-02-02T00:00:00",
            "completed": false
          },
          {
            "id": "eaab5f31-745b-4979-8318-173542302464",
            "title": "Discussion",
            "due_date": "2025-01-16T00:00:00",
            "completed": false
          },
          {
            "id": "f5de75f2-75bd-4706-a995-a98c7f31d7be",
            "title": "Essay",
            "due_date": "2025-01-25T00:00:00",
            "completed": false
          },
          {
            "id": "96893633-3164-4828-9ea7-a4b1e58f334d",
            "title": "Discussion",
            "due_date": "2025-01-10T00:00:00",
            "completed": false
          },
          {
            "id": "1f329037-c0fd-419a-b99a-6c353c5d1f7b",
            "title": "Project",
            "due_date": "2025-04-27T00:00:00",
            "completed": false
          },
          {
            "id": "dc3f3518-de78-41fc-b84f-2e07a52b6bed",
            "title": "Discussion",
            "due_date": "2025-02-15T00:00:00",
            "completed": false
          },
          {
            "id": "b7eda05a-aa9c-4e0b-953f-d9a7065a4d37",
            "title": "Reading",
            "due_date": "2025-04-23T00:00:00",
            "completed": false
          },
          {
            "id": "49ab1b1f-b88a-4037-a04e-aa47538cb742",
            "title": "Essay",
            "due_date": "2025-03-12T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "82edb3d0-254c-4659-af93-1397f657b785",
        "grade": 92.43
      },
      {
        "id": "5fcee316-b9c2-4fa6-8bac-c6d05e40819d",
        "title": "Multivariable Mathematics II",
        "credit_hours": 4,
        "short_id": "MATH 3510",
        "description": "Inverse function theorem and manifolds, integration in several variables, the change of variables theorem. Differential forms, line integrals, surface integrals, and Stokes's Theorem; applications to physics. Eigenvalues, eigenvectors, spectral theorem, and applications.",
        "assignments": [
          {
            "id": "35d31d70-8969-49fe-b0db-7474d04385d8",
            "title": "Reading",
            "due_date": "2025-02-13T00:00:00",
            "completed": false
          },
          {
            "id": "fc9a58ee-9d3c-436c-82e0-4ea1be1565d4",
            "title": "Lab",
            "due_date": "2025-02-11T00:00:00",
            "completed": false
          },
          {
            "id": "3bf03a49-7b78-4dbe-8b5c-2e38fcb275e2",
            "title": "Quiz",
            "due_date": "2025-03-04T00:00:00",
            "completed": false
          },
          {
            "id": "151b10a1-c41b-4b50-b98f-d643ca16ed17",
            "title": "Reading",
            "due_date": "2025-02-25T00:00:00",
            "completed": false
          },
          {
            "id": "4e1a5d19-37f9-4e34-8993-96bea9f21443",
            "title": "Quiz",
            "due_date": "2025-01-12T00:00:00",
            "completed": false
          },
          {
            "id": "bfa68445-a015-47d8-b5cd-a4b900f115fb",
            "title": "Essay",
            "due_date": "2025-02-19T00:00:00",
            "completed": false
          },
          {
            "id": "677c4267-83fc-4ef4-9158-8c31cb5818e8",
            "title": "Discussion",
            "due_date": "2025-03-04T00:00:00",
            "completed": false
          },
          {
            "id": "217d9ff5-ec4b-4d9a-81c9-1931f028f1c6",
            "title": "Project",
            "due_date": "2025-01-10T00:00:00",
            "completed": false
          },
          {
            "id": "526a5434-3e8a-4127-b113-a489f25b4feb",
            "title": "Homework",
            "due_date": "2025-03-26T00:00:00",
            "completed": false
          },
          {
            "id": "24fb9f44-f337-4221-a28b-735878753432",
            "title": "Reading",
            "due_date": "2025-02-02T00:00:00",
            "completed": false
          },
          {
            "id": "7042413a-2544-45ed-945b-05c3a6951008",
            "title": "Presentation",
            "due_date": "2025-01-20T00:00:00",
            "completed": false
          },
          {
            "id": "be152f55-1a6f-442c-ba1f-ee17879ce908",
            "title": "Quiz",
            "due_date": "2025-02-01T00:00:00",
            "completed": false
          },
          {
            "id": "2fd1b10a-3e8e-4a06-bdf4-e33a0003ac63",
            "title": "Homework",
            "due_date": "2025-03-31T00:00:00",
            "completed": false
          },
          {
            "id": "84ef3de7-4a7d-44c6-9216-cedef7d1a484",
            "title": "Project",
            "due_date": "2025-04-06T00:00:00",
            "completed": false
          },
          {
            "id": "cd0a1e11-0ecf-48c6-9a6e-c8a6a2e5cd6b",
            "title": "Final",
            "due_date": "2025-04-25T00:00:00",
            "completed": false
          },
          {
            "id": "417b104f-73c2-4fe6-8739-1261af29b061",
            "title": "Presentation",
            "due_date": "2025-02-12T00:00:00",
            "completed": false
          },
          {
            "id": "7ad908fa-4677-4492-9fbe-b7c1b9eebf53",
            "title": "Essay",
            "due_date": "2025-03-23T00:00:00",
            "completed": false
          },
          {
            "id": "ea70fabf-39d7-41d0-9bfb-1b579d0e6056",
            "title": "Presentation",
            "due_date": "2025-04-01T00:00:00",
            "completed": false
          },
          {
            "id": "fa9adfc8-191a-45b7-b8df-51d4aa6366ec",
            "title": "Paper",
            "due_date": "2025-04-22T00:00:00",
            "completed": false
          },
          {
            "id": "cb75070b-e99f-47e5-8cf0-4025f512b0b9",
            "title": "Paper",
            "due_date": "2025-02-17T00:00:00",
            "completed": false
          },
          {
            "id": "4f7f814d-18ce-4a0b-b171-eb9f2b8834fb",
            "title": "Discussion",
            "due_date": "2025-02-17T00:00:00",
            "completed": false
          },
          {
            "id": "49582ac3-471c-483e-84ab-3499c0f373a4",
            "title": "Test",
            "due_date": "2025-02-20T00:00:00",
            "completed": false
          },
          {
            "id": "1b5d4528-ee70-4d2d-8a94-d26a8c0c8d62",
            "title": "Exam",
            "due_date": "2025-01-31T00:00:00",
            "completed": false
          },
          {
            "id": "a784604d-f814-44e4-9030-137d69209389",
            "title": "Paper",
            "due_date": "2025-01-23T00:00:00",
            "completed": false
          },
          {
            "id": "935f4d13-f419-4767-b159-be61ad124068",
            "title": "Project",
            "due_date": "2025-04-03T00:00:00",
            "completed": false
          },
          {
            "id": "204523b2-606a-45be-835c-dd8ccfd65519",
            "title": "Project",
            "due_date": "2025-02-22T00:00:00",
            "completed": false
          },
          {
            "id": "a83dc794-d662-4b5d-9c86-e1842e90238f",
            "title": "Essay",
            "due_date": "2025-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "320ef8b8-74c8-44b3-83f5-7201ecf09a11",
            "title": "Exam",
            "due_date": "2025-04-04T00:00:00",
            "completed": false
          },
          {
            "id": "55c0d4a5-2f76-4249-a045-a9d3fcf6a892",
            "title": "Essay",
            "due_date": "2025-02-24T00:00:00",
            "completed": false
          },
          {
            "id": "6ac8fb1e-b985-4680-a735-d6e0a537c584",
            "title": "Test",
            "due_date": "2025-04-11T00:00:00",
            "completed": false
          },
          {
            "id": "b2931981-6968-45d1-933d-ef3be021c9cd",
            "title": "Presentation",
            "due_date": "2025-02-09T00:00:00",
            "completed": false
          },
          {
            "id": "70529342-4abd-4505-a9e6-cf1e070fb681",
            "title": "Exam",
            "due_date": "2025-02-10T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "82edb3d0-254c-4659-af93-1397f657b785",
        "grade": 97.17
      },
      {
        "id": "7b7fb4b5-0047-46c6-88d2-de7ddd95ec42",
        "title": "Gateway Latin",
        "credit_hours": 3,
        "short_id": "LATN 4000",
        "description": "Further training in Latin grammar, syntax, and vocabulary acquisition in conjunction with daily translation of Latin text to improve translation skills and strengthen knowledge of the linguistic structure of the Latin language.",
        "assignments": [
          {
            "id": "38f300ef-e718-4ae6-ab4a-5581e08620ce",
            "title": "Test",
            "due_date": "2025-04-18T00:00:00",
            "completed": false
          },
          {
            "id": "6710de49-8275-426b-af72-e8b1598a1e40",
            "title": "Final",
            "due_date": "2025-03-26T00:00:00",
            "completed": false
          },
          {
            "id": "2adff841-4839-4975-891a-05f4849e81c7",
            "title": "Quiz",
            "due_date": "2025-04-25T00:00:00",
            "completed": false
          },
          {
            "id": "d3be914b-894e-45dd-9b49-c184b0c59c4a",
            "title": "Discussion",
            "due_date": "2025-04-24T00:00:00",
            "completed": false
          },
          {
            "id": "499990ac-60a1-462c-9a9a-1f1f7552ea13",
            "title": "Homework",
            "due_date": "2025-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "ef491b43-1ec6-4a11-832f-275f8baf9869",
            "title": "Quiz",
            "due_date": "2025-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "61eb0fd4-5aaf-410e-b377-6786e9b041b8",
            "title": "Paper",
            "due_date": "2025-02-01T00:00:00",
            "completed": false
          },
          {
            "id": "968d5309-bf83-4ccb-9941-bfcf25da6182",
            "title": "Presentation",
            "due_date": "2025-03-22T00:00:00",
            "completed": false
          },
          {
            "id": "d7832bb7-4789-4db2-bb48-6004d99601e9",
            "title": "Lab",
            "due_date": "2025-04-12T00:00:00",
            "completed": false
          },
          {
            "id": "bc6c5284-4dab-4cf5-9a64-4b5473028354",
            "title": "Lab",
            "due_date": "2025-04-22T00:00:00",
            "completed": false
          },
          {
            "id": "323cfd48-d028-426a-8a14-fdbb137327e3",
            "title": "Essay",
            "due_date": "2025-01-19T00:00:00",
            "completed": false
          },
          {
            "id": "a3ab2fae-3a65-4ec2-848b-804040a5f381",
            "title": "Essay",
            "due_date": "2025-04-04T00:00:00",
            "completed": false
          },
          {
            "id": "1ee3a0bf-266f-4f8e-a7a7-a56fff287259",
            "title": "Project",
            "due_date": "2025-02-05T00:00:00",
            "completed": false
          },
          {
            "id": "97a4a3d2-070a-4dc2-9157-c78c86e81187",
            "title": "Paper",
            "due_date": "2025-04-05T00:00:00",
            "completed": false
          },
          {
            "id": "4951be31-3c44-40e0-b8ab-1c7e40133eab",
            "title": "Essay",
            "due_date": "2025-04-10T00:00:00",
            "completed": false
          },
          {
            "id": "3a6db2a9-e99e-4c38-8a5b-c20c7d0e8c65",
            "title": "Presentation",
            "due_date": "2025-03-29T00:00:00",
            "completed": false
          },
          {
            "id": "9759f36d-cd13-4b81-a47f-bf878604bc1b",
            "title": "Quiz",
            "due_date": "2025-04-01T00:00:00",
            "completed": false
          },
          {
            "id": "8205f947-2a07-4c37-85cc-4b5b9b784c49",
            "title": "Discussion",
            "due_date": "2025-03-12T00:00:00",
            "completed": false
          },
          {
            "id": "cacbfea2-1c61-465e-bea0-1e605c9f5cbc",
            "title": "Exam",
            "due_date": "2025-03-14T00:00:00",
            "completed": false
          },
          {
            "id": "68c7f99d-759b-4568-a725-63b2b0fd1400",
            "title": "Exam",
            "due_date": "2025-03-29T00:00:00",
            "completed": false
          },
          {
            "id": "cad050da-d4bf-487a-bdb5-563eeb560c52",
            "title": "Reading",
            "due_date": "2025-04-03T00:00:00",
            "completed": false
          },
          {
            "id": "738b6dde-1c6f-4b2e-8fa9-da2756a7bb98",
            "title": "Discussion",
            "due_date": "2025-04-24T00:00:00",
            "completed": false
          },
          {
            "id": "1d3a4ffb-ace1-404a-835e-71a9cea65a1f",
            "title": "Homework",
            "due_date": "2025-03-10T00:00:00",
            "completed": false
          },
          {
            "id": "7a8c7119-26f9-4534-89fd-558bbe82c72f",
            "title": "Final",
            "due_date": "2025-02-18T00:00:00",
            "completed": false
          },
          {
            "id": "5c0ec9c1-6802-4d31-84ec-2742c5559a09",
            "title": "Presentation",
            "due_date": "2025-04-13T00:00:00",
            "completed": false
          },
          {
            "id": "e625c494-d016-4720-a315-c23f684b13da",
            "title": "Lab",
            "due_date": "2025-01-18T00:00:00",
            "completed": false
          },
          {
            "id": "1a8dbd9c-de08-41fc-a249-593560a30a27",
            "title": "Discussion",
            "due_date": "2025-01-12T00:00:00",
            "completed": false
          },
          {
            "id": "68f70473-50ae-4751-bfd9-f9410640179a",
            "title": "Essay",
            "due_date": "2025-04-12T00:00:00",
            "completed": false
          },
          {
            "id": "fd5aafd2-be61-4ba7-8a8a-629a41845e86",
            "title": "Essay",
            "due_date": "2025-02-27T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "82edb3d0-254c-4659-af93-1397f657b785",
        "grade": 92.41
      },
      {
        "id": "713d555e-e1ec-4a4b-9dda-b19abda781a0",
        "title": "Web Programming",
        "credit_hours": 4,
        "short_id": "CSCI 4300",
        "description": "Client-side and server-side techniques for use on the World Wide Web. Interactive, dynamically-generated, and database-enabled web pages are discussed. Course content changes frequently to incorporate new Internet technologies.",
        "assignments": [
          {
            "id": "d561c902-7d18-48aa-bc46-a39079ad87e0",
            "title": "Final",
            "due_date": "2025-02-03T00:00:00",
            "completed": false
          },
          {
            "id": "a122a662-3983-40da-bd7e-c641d5a8ff4e",
            "title": "Test",
            "due_date": "2025-04-04T00:00:00",
            "completed": false
          },
          {
            "id": "1239243f-6f39-45d5-b09b-e69f0815390b",
            "title": "Lab",
            "due_date": "2025-02-23T00:00:00",
            "completed": false
          },
          {
            "id": "4d4f5f83-bca1-450c-9802-0f5e5e7e6247",
            "title": "Quiz",
            "due_date": "2025-02-05T00:00:00",
            "completed": false
          },
          {
            "id": "7806774e-856c-4c14-8737-1fe29373e5b4",
            "title": "Project",
            "due_date": "2025-01-29T00:00:00",
            "completed": false
          },
          {
            "id": "af4bd148-03a4-4883-84c8-e3cc68e43d7c",
            "title": "Quiz",
            "due_date": "2025-03-12T00:00:00",
            "completed": false
          },
          {
            "id": "c8d01e74-70ac-4194-955c-c7c1b5834140",
            "title": "Final",
            "due_date": "2025-02-04T00:00:00",
            "completed": false
          },
          {
            "id": "e5f4d49a-f4f2-407e-9491-863848913b4e",
            "title": "Final",
            "due_date": "2025-04-27T00:00:00",
            "completed": false
          },
          {
            "id": "9eca6d66-ca48-4c2d-831b-6cdf35250784",
            "title": "Reading",
            "due_date": "2025-04-28T00:00:00",
            "completed": false
          },
          {
            "id": "f3b84ba6-2a4d-457a-a8a2-1d2f69b8d3b2",
            "title": "Homework",
            "due_date": "2025-03-09T00:00:00",
            "completed": false
          },
          {
            "id": "e58579a2-229b-4cb9-acff-25fde71c5dda",
            "title": "Quiz",
            "due_date": "2025-01-29T00:00:00",
            "completed": false
          },
          {
            "id": "bca2164a-8dae-4f61-97b0-c908b4310009",
            "title": "Essay",
            "due_date": "2025-01-28T00:00:00",
            "completed": false
          },
          {
            "id": "a5a74f26-713a-4605-8e09-1461d21d0887",
            "title": "Project",
            "due_date": "2025-03-01T00:00:00",
            "completed": false
          },
          {
            "id": "8450216c-9fa8-47fc-b0f7-f00e37ce3e74",
            "title": "Reading",
            "due_date": "2025-02-12T00:00:00",
            "completed": false
          },
          {
            "id": "2f33159a-d511-4511-9588-474b75a7ede3",
            "title": "Discussion",
            "due_date": "2025-03-02T00:00:00",
            "completed": false
          },
          {
            "id": "7926f13c-9370-433c-8594-5a89d97ca550",
            "title": "Discussion",
            "due_date": "2025-02-21T00:00:00",
            "completed": false
          },
          {
            "id": "8c0d2f7d-aa2c-4df4-b7c5-e05706bf0155",
            "title": "Lab",
            "due_date": "2025-02-28T00:00:00",
            "completed": false
          },
          {
            "id": "966fc821-7b38-4004-a18c-1d87c33127f2",
            "title": "Homework",
            "due_date": "2025-04-23T00:00:00",
            "completed": false
          },
          {
            "id": "a0d2cb20-2152-46f0-aa9e-12a1ee732df9",
            "title": "Reading",
            "due_date": "2025-01-18T00:00:00",
            "completed": false
          },
          {
            "id": "609a938c-cf5f-4da7-9c2c-ba0116cd69ea",
            "title": "Paper",
            "due_date": "2025-04-21T00:00:00",
            "completed": false
          },
          {
            "id": "f51e8906-74e8-4639-8198-93a21836b955",
            "title": "Exam",
            "due_date": "2025-02-19T00:00:00",
            "completed": false
          },
          {
            "id": "5fdd627c-f55e-4a18-9aa6-1b84de62f8ed",
            "title": "Quiz",
            "due_date": "2025-03-29T00:00:00",
            "completed": false
          },
          {
            "id": "9c022996-eab5-43ef-aafc-368432f60cf3",
            "title": "Homework",
            "due_date": "2025-04-15T00:00:00",
            "completed": false
          },
          {
            "id": "0f3a79c2-c654-49f7-a735-9bd9f8feab01",
            "title": "Paper",
            "due_date": "2025-03-29T00:00:00",
            "completed": false
          },
          {
            "id": "bb71bbb0-da2b-44e9-841d-1bffa92c0da9",
            "title": "Lab",
            "due_date": "2025-01-19T00:00:00",
            "completed": false
          },
          {
            "id": "4a468d79-5514-4ad9-9398-84840674457a",
            "title": "Final",
            "due_date": "2025-02-01T00:00:00",
            "completed": false
          },
          {
            "id": "5dbab108-a871-4f5c-9fd9-01b74f78cbeb",
            "title": "Project",
            "due_date": "2025-01-25T00:00:00",
            "completed": false
          },
          {
            "id": "26eec6d0-1e15-4ce4-ba16-7015f5fceb92",
            "title": "Homework",
            "due_date": "2025-03-10T00:00:00",
            "completed": false
          },
          {
            "id": "3af9687f-d608-43f9-914f-914baecb38d3",
            "title": "Lab",
            "due_date": "2025-02-20T00:00:00",
            "completed": false
          },
          {
            "id": "b2d4c41f-7ef8-4b77-97a8-e8a16c4e1999",
            "title": "Essay",
            "due_date": "2025-04-25T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "82edb3d0-254c-4659-af93-1397f657b785",
        "grade": 90.47
      },
      {
        "id": "4e906941-d187-4bb4-a988-97679f193a43",
        "title": "Computer Architecture and Organization",
        "credit_hours": 4,
        "short_id": "CSCI 4720",
        "description": "Design and analysis of the structure and function of modern computing systems. Topics studied include combinational and sequential logic, number systems and computer arithmetic, hardware design and organization of CPU, I/O systems and memory systems, instruction set and assembly language design, performance characterization and measurement, and current trends and developments in computer architecture and organization.",
        "assignments": [
          {
            "id": "9401a7ef-a90b-439b-ab79-b9200c72420d",
            "title": "Exam",
            "due_date": "2025-04-09T00:00:00",
            "completed": false
          },
          {
            "id": "727715f3-d313-45d8-9b58-cbdb5b3edcd7",
            "title": "Final",
            "due_date": "2025-03-22T00:00:00",
            "completed": false
          },
          {
            "id": "a872429a-882c-4fdb-9c03-0c41c82e3e05",
            "title": "Reading",
            "due_date": "2025-04-19T00:00:00",
            "completed": false
          },
          {
            "id": "91daca4a-3ce2-49b7-920c-76d176e3dddb",
            "title": "Presentation",
            "due_date": "2025-03-05T00:00:00",
            "completed": false
          },
          {
            "id": "fab9dbea-2335-4803-a769-e80cd9e74452",
            "title": "Exam",
            "due_date": "2025-02-16T00:00:00",
            "completed": false
          },
          {
            "id": "3f86ec02-0963-4ee4-9169-88f12c48a94a",
            "title": "Essay",
            "due_date": "2025-03-16T00:00:00",
            "completed": false
          },
          {
            "id": "62667c0e-fc7a-4d76-bc49-f6620882f28d",
            "title": "Project",
            "due_date": "2025-02-27T00:00:00",
            "completed": false
          },
          {
            "id": "790181d4-1d7d-4a39-95ac-3843f4f1399a",
            "title": "Quiz",
            "due_date": "2025-04-20T00:00:00",
            "completed": false
          },
          {
            "id": "dfdf548b-32ee-4909-aa83-1462177d1ace",
            "title": "Homework",
            "due_date": "2025-02-01T00:00:00",
            "completed": false
          },
          {
            "id": "10713153-6306-41ad-a8e5-b249de51d084",
            "title": "Paper",
            "due_date": "2025-01-11T00:00:00",
            "completed": false
          },
          {
            "id": "c1798277-48c3-4a43-8a5f-2cffc30242db",
            "title": "Project",
            "due_date": "2025-01-16T00:00:00",
            "completed": false
          },
          {
            "id": "f44124ed-070e-4e7b-9f30-be3f7044118a",
            "title": "Paper",
            "due_date": "2025-02-20T00:00:00",
            "completed": false
          },
          {
            "id": "9dd4270e-1dfa-4029-8e06-1b7c27dee0cf",
            "title": "Homework",
            "due_date": "2025-03-03T00:00:00",
            "completed": false
          },
          {
            "id": "62af91cf-874e-4815-ab4e-e5457a9109df",
            "title": "Test",
            "due_date": "2025-03-08T00:00:00",
            "completed": false
          },
          {
            "id": "f0270407-3f89-4e34-8708-cd1da053ca55",
            "title": "Homework",
            "due_date": "2025-04-19T00:00:00",
            "completed": false
          },
          {
            "id": "936d0235-f1fc-46b3-9469-cb4b6aeb5714",
            "title": "Paper",
            "due_date": "2025-04-14T00:00:00",
            "completed": false
          },
          {
            "id": "320cb05a-9de9-401a-8f01-aae2e48ddd26",
            "title": "Discussion",
            "due_date": "2025-02-05T00:00:00",
            "completed": false
          },
          {
            "id": "65a0b9d7-b896-4201-9dff-c467cfc44b9d",
            "title": "Project",
            "due_date": "2025-03-17T00:00:00",
            "completed": false
          },
          {
            "id": "7611da34-c25b-4fd8-90af-01870e546892",
            "title": "Discussion",
            "due_date": "2025-01-29T00:00:00",
            "completed": false
          },
          {
            "id": "2b39b3a6-177c-4d95-a30c-00a2952d5458",
            "title": "Final",
            "due_date": "2025-02-18T00:00:00",
            "completed": false
          },
          {
            "id": "f8324e1f-bc31-4f9b-8665-0b60f88282a5",
            "title": "Quiz",
            "due_date": "2025-01-11T00:00:00",
            "completed": false
          },
          {
            "id": "342bf5cf-ec90-44f3-b7d3-e5c9be77cff1",
            "title": "Presentation",
            "due_date": "2025-04-26T00:00:00",
            "completed": false
          },
          {
            "id": "6071fec9-de81-446d-9306-d163e1debfaa",
            "title": "Project",
            "due_date": "2025-04-09T00:00:00",
            "completed": false
          },
          {
            "id": "4c61262c-3356-4de8-b047-e15d3efbb6db",
            "title": "Homework",
            "due_date": "2025-03-30T00:00:00",
            "completed": false
          },
          {
            "id": "cc734f77-449c-4042-8c05-d760bcc01b33",
            "title": "Exam",
            "due_date": "2025-03-19T00:00:00",
            "completed": false
          },
          {
            "id": "72df474d-3d94-4fa0-b436-3a00a07bbb8b",
            "title": "Final",
            "due_date": "2025-02-15T00:00:00",
            "completed": false
          },
          {
            "id": "b9b59fec-b5e5-4b93-ac87-6dfc253fbdfb",
            "title": "Project",
            "due_date": "2025-03-26T00:00:00",
            "completed": false
          },
          {
            "id": "a936d802-7ac1-4ffb-afa4-1309acb63ec9",
            "title": "Homework",
            "due_date": "2025-04-10T00:00:00",
            "completed": false
          },
          {
            "id": "627631a6-da2f-4f0a-92d2-d6b6c33adbad",
            "title": "Quiz",
            "due_date": "2025-03-12T00:00:00",
            "completed": false
          },
          {
            "id": "f5ce83b5-6377-4246-a66f-9879cd5652c0",
            "title": "Quiz",
            "due_date": "2025-01-28T00:00:00",
            "completed": false
          },
          {
            "id": "5edca8bd-565d-4f9d-af99-947c0d974863",
            "title": "Quiz",
            "due_date": "2025-04-16T00:00:00",
            "completed": false
          },
          {
            "id": "d4213d12-7bb5-4199-938d-5676e1033b9e",
            "title": "Test",
            "due_date": "2025-01-15T00:00:00",
            "completed": false
          },
          {
            "id": "d203008c-d702-4667-8109-b39d6f2477b4",
            "title": "Paper",
            "due_date": "2025-01-11T00:00:00",
            "completed": false
          },
          {
            "id": "1cc127e7-5b30-4fbe-b857-029f979e8a62",
            "title": "Reading",
            "due_date": "2025-01-08T00:00:00",
            "completed": false
          },
          {
            "id": "f6a82047-e68e-4086-8be8-fa38e29a4d0e",
            "title": "Final",
            "due_date": "2025-02-15T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "82edb3d0-254c-4659-af93-1397f657b785",
        "grade": 99.35
      },
      {
        "id": "617db69a-f6ed-4ab4-8bd1-d9251f4dee99",
        "title": "Mathematics Internship",
        "credit_hours": 3,
        "short_id": "MATH 4801",
        "description": "Students are permitted to enter an organization to obtain practical and applied experience. A paper describing and analyzing this experience is required.",
        "assignments": [
          {
            "id": "91f0f000-0949-43d6-9c38-73cd81ca1a40",
            "title": "Project",
            "due_date": "2025-04-07T00:00:00",
            "completed": false
          },
          {
            "id": "fead67e7-11b3-4edc-b28b-670e74e46a4f",
            "title": "Exam",
            "due_date": "2025-02-14T00:00:00",
            "completed": false
          },
          {
            "id": "f776cdb3-66db-49d6-a0ff-599c3a8c2eb0",
            "title": "Presentation",
            "due_date": "2025-02-14T00:00:00",
            "completed": false
          },
          {
            "id": "eb0cd744-2398-4b54-8f27-1893111f1ee3",
            "title": "Final",
            "due_date": "2025-01-11T00:00:00",
            "completed": false
          },
          {
            "id": "c751df5a-1935-41c2-9852-9b5f094ff96b",
            "title": "Discussion",
            "due_date": "2025-01-28T00:00:00",
            "completed": false
          },
          {
            "id": "dcc15232-5234-4c25-b2f9-dd80610632af",
            "title": "Quiz",
            "due_date": "2025-02-12T00:00:00",
            "completed": false
          },
          {
            "id": "53cbc317-82ab-491f-a2c3-769b49054df8",
            "title": "Lab",
            "due_date": "2025-01-12T00:00:00",
            "completed": false
          },
          {
            "id": "c5e5d7c5-0cda-4e16-b4b3-ebb7477bb0cf",
            "title": "Test",
            "due_date": "2025-04-08T00:00:00",
            "completed": false
          },
          {
            "id": "b861f84a-9916-436e-880d-da5283493bca",
            "title": "Test",
            "due_date": "2025-02-20T00:00:00",
            "completed": false
          },
          {
            "id": "b3569906-5baf-42aa-ad14-cce522d6ec94",
            "title": "Homework",
            "due_date": "2025-01-27T00:00:00",
            "completed": false
          },
          {
            "id": "c29d1f45-1065-4026-8d8c-f631e0fa2dae",
            "title": "Discussion",
            "due_date": "2025-03-10T00:00:00",
            "completed": false
          },
          {
            "id": "f3a2bd55-065d-4a11-bbf1-135de5c2d595",
            "title": "Essay",
            "due_date": "2025-02-14T00:00:00",
            "completed": false
          },
          {
            "id": "0c12cc26-5ecc-4f32-9dec-fa02a58d9060",
            "title": "Project",
            "due_date": "2025-01-27T00:00:00",
            "completed": false
          },
          {
            "id": "b4d549c0-6117-4be2-98c7-ed084fdd6fc0",
            "title": "Quiz",
            "due_date": "2025-03-05T00:00:00",
            "completed": false
          },
          {
            "id": "6c5527cb-d589-49be-b37f-42122e82d315",
            "title": "Reading",
            "due_date": "2025-03-08T00:00:00",
            "completed": false
          },
          {
            "id": "1c2ea954-f7d2-4e89-ab09-49dd70629c2e",
            "title": "Exam",
            "due_date": "2025-04-12T00:00:00",
            "completed": false
          },
          {
            "id": "34cf8be1-f5ef-4e88-b842-0904e5d1ee8e",
            "title": "Paper",
            "due_date": "2025-01-29T00:00:00",
            "completed": false
          },
          {
            "id": "138ad4e0-b91f-40a7-b099-4468829611ad",
            "title": "Final",
            "due_date": "2025-03-16T00:00:00",
            "completed": false
          },
          {
            "id": "efb0104f-2d07-4acf-be8a-7ecaecfba59e",
            "title": "Final",
            "due_date": "2025-01-28T00:00:00",
            "completed": false
          },
          {
            "id": "be73fa8a-0bf4-43ef-8e7e-5914966e51fc",
            "title": "Quiz",
            "due_date": "2025-04-06T00:00:00",
            "completed": false
          },
          {
            "id": "74c60169-77d2-4814-8ae4-160b5e1b10e0",
            "title": "Final",
            "due_date": "2025-02-24T00:00:00",
            "completed": false
          },
          {
            "id": "fc75c882-3fed-41ec-bacf-1c8fb964f7dc",
            "title": "Essay",
            "due_date": "2025-02-19T00:00:00",
            "completed": false
          },
          {
            "id": "d69d26f0-5fd5-4b4e-aa8d-224f9908b9ff",
            "title": "Presentation",
            "due_date": "2025-04-19T00:00:00",
            "completed": false
          },
          {
            "id": "f2879d61-5b7b-422b-af5b-6654656bfd5f",
            "title": "Presentation",
            "due_date": "2025-04-17T00:00:00",
            "completed": false
          },
          {
            "id": "fefb5ea7-b3b8-457e-8f5a-59d64c8be7a0",
            "title": "Project",
            "due_date": "2025-01-18T00:00:00",
            "completed": false
          },
          {
            "id": "73a0e2f0-4616-47b7-9fd9-d76223fffaf0",
            "title": "Homework",
            "due_date": "2025-01-17T00:00:00",
            "completed": false
          },
          {
            "id": "56428fcb-a3b3-4d09-a981-1719db75f075",
            "title": "Test",
            "due_date": "2025-04-12T00:00:00",
            "completed": false
          },
          {
            "id": "a918194e-579b-42c7-8e1f-50c5fa3ff593",
            "title": "Paper",
            "due_date": "2025-04-04T00:00:00",
            "completed": false
          },
          {
            "id": "57c4f58a-78d4-44fa-8a8d-c6a09c358281",
            "title": "Test",
            "due_date": "2025-04-05T00:00:00",
            "completed": false
          },
          {
            "id": "8de774cc-8907-421f-aee0-7e09aa86d604",
            "title": "Test",
            "due_date": "2025-03-31T00:00:00",
            "completed": false
          },
          {
            "id": "3234896c-aed5-46d7-99a8-1770b3a18e83",
            "title": "Discussion",
            "due_date": "2025-04-14T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "82edb3d0-254c-4659-af93-1397f657b785",
        "grade": 92.78
      },
      {
        "id": "8449eedb-ded8-4128-a0d3-81d769b43711",
        "title": "Capstone Design I",
        "credit_hours": 2,
        "short_id": "CSCI 4910",
        "description": "Computer Science design project experience under the supervision of a project director.",
        "assignments": [
          {
            "id": "b62deb9b-1a46-42cc-bafd-2b86cee5ee9f",
            "title": "Lab",
            "due_date": "2025-06-11T00:00:00",
            "completed": false
          },
          {
            "id": "f4f93024-5699-4941-82d8-def2fa94413b",
            "title": "Discussion",
            "due_date": "2025-06-24T00:00:00",
            "completed": false
          },
          {
            "id": "5b6e30f6-785b-4d16-94ee-2e9ac5460183",
            "title": "Quiz",
            "due_date": "2025-07-16T00:00:00",
            "completed": false
          },
          {
            "id": "ea24293c-8fa3-4424-9b13-a26006ccd12e",
            "title": "Presentation",
            "due_date": "2025-07-15T00:00:00",
            "completed": false
          },
          {
            "id": "f2f8af92-c71b-4182-957c-f8b5f18c663e",
            "title": "Reading",
            "due_date": "2025-06-21T00:00:00",
            "completed": false
          },
          {
            "id": "a7fb0868-a415-4e7e-8255-0c6fb18d86a5",
            "title": "Final",
            "due_date": "2025-06-30T00:00:00",
            "completed": false
          },
          {
            "id": "737247de-2496-4c03-9024-c2fc25990533",
            "title": "Quiz",
            "due_date": "2025-07-11T00:00:00",
            "completed": false
          },
          {
            "id": "8dcd6982-2ba9-412a-a030-d6adaebafda3",
            "title": "Quiz",
            "due_date": "2025-07-11T00:00:00",
            "completed": false
          },
          {
            "id": "c6fe5fed-097c-4f44-aabb-c472187fecc9",
            "title": "Lab",
            "due_date": "2025-06-22T00:00:00",
            "completed": false
          },
          {
            "id": "4a6da999-897b-4e7d-9cc8-09b06f56d9b3",
            "title": "Lab",
            "due_date": "2025-06-30T00:00:00",
            "completed": false
          },
          {
            "id": "742f4df7-8d8e-4693-a474-4ab34e703fcb",
            "title": "Homework",
            "due_date": "2025-06-18T00:00:00",
            "completed": false
          },
          {
            "id": "7588f8bf-64f3-4919-b044-c7dc770dcd7a",
            "title": "Lab",
            "due_date": "2025-07-14T00:00:00",
            "completed": false
          },
          {
            "id": "df870fb1-f844-4c59-8257-7d298cdd6f03",
            "title": "Essay",
            "due_date": "2025-06-12T00:00:00",
            "completed": false
          },
          {
            "id": "87f3d5c5-d7b7-4212-b77b-a9be2584a367",
            "title": "Presentation",
            "due_date": "2025-06-19T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "43817a57-78bc-46e1-966b-a1b71c30859d",
        "grade": 98.2
      },
      {
        "id": "12cd5cd7-60a7-43d1-8df2-2d34039096c2",
        "title": "Capstone Design II",
        "credit_hours": 2,
        "short_id": "CSCI 4911",
        "description": "Computer Science design experience, including completion of a design project under the supervision of a project director.",
        "assignments": [
          {
            "id": "bf1c73c4-fb22-4a9b-9271-a863b2192605",
            "title": "Test",
            "due_date": "2025-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "b48b5cce-c5de-4047-96ab-f56d2d25a472",
            "title": "Presentation",
            "due_date": "2025-11-16T00:00:00",
            "completed": false
          },
          {
            "id": "e5e27c4e-2428-4c94-afbc-8e3819da12ca",
            "title": "Test",
            "due_date": "2025-10-05T00:00:00",
            "completed": false
          },
          {
            "id": "78a68315-3f73-414f-a5fa-a00d897471ce",
            "title": "Lab",
            "due_date": "2025-11-02T00:00:00",
            "completed": false
          },
          {
            "id": "c17b9f27-5096-4451-9502-f3f88ee79541",
            "title": "Quiz",
            "due_date": "2025-09-16T00:00:00",
            "completed": false
          },
          {
            "id": "e9a02fbb-4343-4476-a896-030e86524706",
            "title": "Exam",
            "due_date": "2025-10-08T00:00:00",
            "completed": false
          },
          {
            "id": "63a74a21-703f-41c3-befd-d86bf271ec2e",
            "title": "Paper",
            "due_date": "2025-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "eaba87b9-996f-4525-a30d-cb3c512ec395",
            "title": "Exam",
            "due_date": "2025-09-07T00:00:00",
            "completed": false
          },
          {
            "id": "c13c64a9-52af-4c20-997e-8358898018fc",
            "title": "Final",
            "due_date": "2025-09-25T00:00:00",
            "completed": false
          },
          {
            "id": "02d7e9ea-1c0a-40ad-a211-1820a08d51ed",
            "title": "Exam",
            "due_date": "2025-09-17T00:00:00",
            "completed": false
          },
          {
            "id": "f5599e5c-aa66-47d5-91a9-743a5f9b2578",
            "title": "Exam",
            "due_date": "2025-09-08T00:00:00",
            "completed": false
          },
          {
            "id": "d0ec0112-2a9d-4fc5-9bc3-f14c068f78aa",
            "title": "Lab",
            "due_date": "2025-09-23T00:00:00",
            "completed": false
          },
          {
            "id": "6edbe757-1d5c-4f25-bec5-c3a5a16db68d",
            "title": "Quiz",
            "due_date": "2025-11-20T00:00:00",
            "completed": false
          },
          {
            "id": "548e2ea0-91e9-4b98-8862-96a87c2faea9",
            "title": "Homework",
            "due_date": "2025-08-09T00:00:00",
            "completed": false
          },
          {
            "id": "2abcb3b2-2161-4df4-b914-53a60ac0cfe6",
            "title": "Discussion",
            "due_date": "2025-09-18T00:00:00",
            "completed": false
          },
          {
            "id": "09795e3e-2013-46d9-b286-b650df82f803",
            "title": "Lab",
            "due_date": "2025-10-24T00:00:00",
            "completed": false
          },
          {
            "id": "0f0d10f5-2f3c-4f27-8666-2268f347d01a",
            "title": "Reading",
            "due_date": "2025-08-31T00:00:00",
            "completed": false
          },
          {
            "id": "e272f17e-7688-4c94-b742-b8546ba0f11d",
            "title": "Lab",
            "due_date": "2025-08-28T00:00:00",
            "completed": false
          },
          {
            "id": "e2a45166-be7a-40cb-8a58-7e042ab36d1b",
            "title": "Quiz",
            "due_date": "2025-09-15T00:00:00",
            "completed": false
          },
          {
            "id": "69ed4e73-b49f-455c-893a-52274eb1f994",
            "title": "Reading",
            "due_date": "2025-10-23T00:00:00",
            "completed": false
          },
          {
            "id": "281cc771-4f5b-4970-b9d1-b63ac0c1e6fc",
            "title": "Reading",
            "due_date": "2025-09-05T00:00:00",
            "completed": false
          },
          {
            "id": "e0474b1b-7b8d-4b7d-a5de-c549875853c0",
            "title": "Essay",
            "due_date": "2025-11-09T00:00:00",
            "completed": false
          },
          {
            "id": "defc524e-e398-46fd-843f-075eee98f761",
            "title": "Lab",
            "due_date": "2025-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "7d269534-e41a-4599-8155-1cacdfad6c4a",
            "title": "Final",
            "due_date": "2025-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "f5478aa2-a9fb-4f6f-971b-bc5ba8945c91",
            "title": "Project",
            "due_date": "2025-11-09T00:00:00",
            "completed": false
          },
          {
            "id": "0a5e6f30-2887-4f6a-9fcc-b359c1c8d497",
            "title": "Discussion",
            "due_date": "2025-09-07T00:00:00",
            "completed": false
          },
          {
            "id": "870bfae7-0331-41d6-aed2-510104757462",
            "title": "Test",
            "due_date": "2025-10-08T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "1566173d-0036-4949-b81c-32e99e13819c",
        "grade": 92.3
      },
      {
        "id": "11833ee4-8450-46aa-9a90-ceb71379e315",
        "title": "Computer Systems Engineering Design Project",
        "credit_hours": 3,
        "short_id": "ENGR(CSCI) 4922",
        "description": "Engineering design experience, including completion of a design project under the supervision of a project director.",
        "assignments": [
          {
            "id": "bc65a9c1-0f27-4a03-b130-b69f289e36c8",
            "title": "Final",
            "due_date": "2025-11-12T00:00:00",
            "completed": false
          },
          {
            "id": "0b5a9b95-32cc-4998-9010-1ef12775e7a8",
            "title": "Lab",
            "due_date": "2025-11-14T00:00:00",
            "completed": false
          },
          {
            "id": "63e2a296-66bd-4182-b710-9ee03315e245",
            "title": "Discussion",
            "due_date": "2025-09-15T00:00:00",
            "completed": false
          },
          {
            "id": "3a508cb0-5e3c-43cb-9fec-66238ee9949e",
            "title": "Final",
            "due_date": "2025-08-13T00:00:00",
            "completed": false
          },
          {
            "id": "cee20e7b-da86-4a40-9a50-f1564b4e0f5f",
            "title": "Lab",
            "due_date": "2025-11-08T00:00:00",
            "completed": false
          },
          {
            "id": "b922e6c2-3c2c-4561-b1c7-7e77bc052990",
            "title": "Presentation",
            "due_date": "2025-08-22T00:00:00",
            "completed": false
          },
          {
            "id": "904c4ec9-b389-499f-8ddc-121789f37866",
            "title": "Quiz",
            "due_date": "2025-09-16T00:00:00",
            "completed": false
          },
          {
            "id": "e23b438b-2b3b-4d84-be3c-ffb1c1bd5330",
            "title": "Discussion",
            "due_date": "2025-10-02T00:00:00",
            "completed": false
          },
          {
            "id": "4c0f9612-2638-45a6-87d4-022d25bfd7b6",
            "title": "Project",
            "due_date": "2025-10-16T00:00:00",
            "completed": false
          },
          {
            "id": "918e38b0-129f-4e87-b87f-6e02ff33ad4b",
            "title": "Essay",
            "due_date": "2025-08-05T00:00:00",
            "completed": false
          },
          {
            "id": "e6c21cb5-217c-4be1-9290-cc434842fe7a",
            "title": "Test",
            "due_date": "2025-09-20T00:00:00",
            "completed": false
          },
          {
            "id": "ac30ad2b-7692-458e-88fc-dfe9525a3236",
            "title": "Project",
            "due_date": "2025-08-26T00:00:00",
            "completed": false
          },
          {
            "id": "1d1529c5-69b9-4494-9c54-215e3c5a6c7c",
            "title": "Quiz",
            "due_date": "2025-10-25T00:00:00",
            "completed": false
          },
          {
            "id": "73001063-7389-4a34-9afb-323b174def54",
            "title": "Essay",
            "due_date": "2025-11-11T00:00:00",
            "completed": false
          },
          {
            "id": "257cd0c9-7021-421d-a1a1-1881cdfba9ac",
            "title": "Project",
            "due_date": "2025-09-18T00:00:00",
            "completed": false
          },
          {
            "id": "f9e08250-362e-4b89-8968-1c31a714bfaa",
            "title": "Discussion",
            "due_date": "2025-09-11T00:00:00",
            "completed": false
          },
          {
            "id": "6a5a546d-3ac6-49e1-a11a-eb2bac74bd45",
            "title": "Discussion",
            "due_date": "2025-08-22T00:00:00",
            "completed": false
          },
          {
            "id": "528c61c5-43cf-4cfd-85e8-233837bc3e9f",
            "title": "Quiz",
            "due_date": "2025-09-16T00:00:00",
            "completed": false
          },
          {
            "id": "16c4b313-7be9-4420-ac95-0446d7681969",
            "title": "Test",
            "due_date": "2025-11-18T00:00:00",
            "completed": false
          },
          {
            "id": "db0f5673-1852-459d-8b28-b257a04b9c72",
            "title": "Essay",
            "due_date": "2025-08-18T00:00:00",
            "completed": false
          },
          {
            "id": "b8984300-b524-46ad-9981-b76070af5a4c",
            "title": "Paper",
            "due_date": "2025-11-03T00:00:00",
            "completed": false
          },
          {
            "id": "b571ab19-f2bd-49d0-916b-7b5ecb49b2f8",
            "title": "Final",
            "due_date": "2025-10-26T00:00:00",
            "completed": false
          },
          {
            "id": "c6359416-cb13-4464-8a38-50ce1fa1c52e",
            "title": "Exam",
            "due_date": "2025-08-04T00:00:00",
            "completed": false
          },
          {
            "id": "314bdfcc-5372-4537-86b3-9d94c612e04b",
            "title": "Discussion",
            "due_date": "2025-10-07T00:00:00",
            "completed": false
          },
          {
            "id": "f30281f0-4309-44bc-917d-b3e9991751db",
            "title": "Test",
            "due_date": "2025-11-22T00:00:00",
            "completed": false
          },
          {
            "id": "ecde9a33-5a34-490e-aa95-3ba30f706800",
            "title": "Project",
            "due_date": "2025-10-20T00:00:00",
            "completed": false
          },
          {
            "id": "5e460167-98da-4004-972b-f5394d91eb38",
            "title": "Discussion",
            "due_date": "2025-09-09T00:00:00",
            "completed": false
          },
          {
            "id": "3d5a4166-0f7d-4389-8824-32364221c0c5",
            "title": "Homework",
            "due_date": "2025-09-04T00:00:00",
            "completed": false
          },
          {
            "id": "759ed66b-df5c-43b2-89e4-52f338f21bc6",
            "title": "Reading",
            "due_date": "2025-09-30T00:00:00",
            "completed": false
          },
          {
            "id": "91618a2c-c52c-4bf1-913f-af09ac6fa9b3",
            "title": "Homework",
            "due_date": "2025-11-06T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "1566173d-0036-4949-b81c-32e99e13819c",
        "grade": 95.3
      },
      {
        "id": "060e5ade-d728-40f1-833d-4a81c2110ef4",
        "title": "Research in Mathematics",
        "credit_hours": 1,
        "short_id": "MATH 4950",
        "description": "Research in mathematics directed by a faculty member in the department of mathematics. A final report is required.",
        "assignments": [
          {
            "id": "e5b1d173-561b-4b8a-9946-0961e4c1dca0",
            "title": "Presentation",
            "due_date": "2025-09-11T00:00:00",
            "completed": false
          },
          {
            "id": "8b46ea7b-7b09-4c2d-951c-39a8ac53c3ac",
            "title": "Discussion",
            "due_date": "2025-09-10T00:00:00",
            "completed": false
          },
          {
            "id": "093c81d6-b97b-4ca3-9859-0760c4748d98",
            "title": "Final",
            "due_date": "2025-08-17T00:00:00",
            "completed": false
          },
          {
            "id": "4ca0c768-3da8-4d4b-b4d3-d318f52a8990",
            "title": "Lab",
            "due_date": "2025-08-28T00:00:00",
            "completed": false
          },
          {
            "id": "e20bc2c7-4c50-4cb9-a580-16df7806688e",
            "title": "Quiz",
            "due_date": "2025-09-30T00:00:00",
            "completed": false
          },
          {
            "id": "f5b2a601-97a4-48e2-a22b-9734a491ea5f",
            "title": "Reading",
            "due_date": "2025-08-14T00:00:00",
            "completed": false
          },
          {
            "id": "fddd7369-b461-45f7-8556-06747fa5ef99",
            "title": "Paper",
            "due_date": "2025-11-02T00:00:00",
            "completed": false
          },
          {
            "id": "05a686e8-19ac-428e-b80a-f77fd7ee2880",
            "title": "Paper",
            "due_date": "2025-09-23T00:00:00",
            "completed": false
          },
          {
            "id": "d6d27d46-e57e-45ec-9400-e9d703775653",
            "title": "Final",
            "due_date": "2025-10-20T00:00:00",
            "completed": false
          },
          {
            "id": "32c73382-36ee-4655-8692-06d94fa2be4c",
            "title": "Exam",
            "due_date": "2025-09-22T00:00:00",
            "completed": false
          },
          {
            "id": "237cca33-fe6f-4759-9d91-bc25b60cb712",
            "title": "Project",
            "due_date": "2025-11-16T00:00:00",
            "completed": false
          },
          {
            "id": "147e8a31-ee03-4396-b74c-e34b37534e03",
            "title": "Essay",
            "due_date": "2025-10-30T00:00:00",
            "completed": false
          },
          {
            "id": "1add86a9-fa37-43c2-b9fb-86b61a84ff37",
            "title": "Exam",
            "due_date": "2025-10-08T00:00:00",
            "completed": false
          },
          {
            "id": "50c59013-7cf0-4ada-bdeb-1c27f1bd3a47",
            "title": "Final",
            "due_date": "2025-10-19T00:00:00",
            "completed": false
          },
          {
            "id": "03ccbb4e-f46a-4e01-a300-f22e4f1e1a6e",
            "title": "Lab",
            "due_date": "2025-11-22T00:00:00",
            "completed": false
          },
          {
            "id": "4cff01be-991f-4508-973c-e727ce16ba65",
            "title": "Essay",
            "due_date": "2025-10-10T00:00:00",
            "completed": false
          },
          {
            "id": "8ac6e2cb-47cf-47ed-a4ae-bc209549492c",
            "title": "Discussion",
            "due_date": "2025-11-09T00:00:00",
            "completed": false
          },
          {
            "id": "6d985696-f34f-40ef-8ff2-f7ba788ee7f9",
            "title": "Quiz",
            "due_date": "2025-10-16T00:00:00",
            "completed": false
          },
          {
            "id": "5496cd82-a6dd-4219-bdbc-3a88fe2032e1",
            "title": "Presentation",
            "due_date": "2025-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "d93f20c2-4917-4804-841c-3d93fc0e5e0f",
            "title": "Lab",
            "due_date": "2025-11-21T00:00:00",
            "completed": false
          },
          {
            "id": "dbb6f09e-2751-4615-ad28-72580fe19673",
            "title": "Homework",
            "due_date": "2025-10-16T00:00:00",
            "completed": false
          },
          {
            "id": "56d8ce08-1e50-45af-9c3c-bc191ebd4787",
            "title": "Exam",
            "due_date": "2025-08-08T00:00:00",
            "completed": false
          },
          {
            "id": "cd5f4235-ae10-4f03-a111-3ba87518ca09",
            "title": "Discussion",
            "due_date": "2025-10-22T00:00:00",
            "completed": false
          },
          {
            "id": "234d9ab3-f183-4018-bae1-45cef56f5a24",
            "title": "Test",
            "due_date": "2025-08-13T00:00:00",
            "completed": false
          },
          {
            "id": "6807d7be-4ae2-4bac-99b6-c9c90bd559e4",
            "title": "Quiz",
            "due_date": "2025-10-24T00:00:00",
            "completed": false
          },
          {
            "id": "736995a8-b58d-428f-b9e7-6247ab9767ad",
            "title": "Exam",
            "due_date": "2025-08-27T00:00:00",
            "completed": false
          },
          {
            "id": "e16b0d33-0247-429d-97af-2ecf1ce7a721",
            "title": "Exam",
            "due_date": "2025-10-03T00:00:00",
            "completed": false
          },
          {
            "id": "44e645aa-30aa-41ba-b66a-828735489ee8",
            "title": "Homework",
            "due_date": "2025-11-15T00:00:00",
            "completed": false
          },
          {
            "id": "4e7a12d2-f6a1-407f-b4fa-542222ff1c00",
            "title": "Quiz",
            "due_date": "2025-10-29T00:00:00",
            "completed": false
          },
          {
            "id": "2e112963-66f3-44f9-aea0-ad18775d89db",
            "title": "Project",
            "due_date": "2025-09-05T00:00:00",
            "completed": false
          },
          {
            "id": "8153d2db-b61c-4c41-9122-cd3663050534",
            "title": "Lab",
            "due_date": "2025-08-15T00:00:00",
            "completed": false
          },
          {
            "id": "a0a42bef-0e03-4a63-9b0c-1b40418add26",
            "title": "Quiz",
            "due_date": "2025-09-07T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "1566173d-0036-4949-b81c-32e99e13819c",
        "grade": 94.16
      },
      {
        "id": "22a4a4a3-bb79-4720-a8f9-0fef8121c8d2",
        "title": "Faculty-Mentored Undergraduate Research I",
        "credit_hours": 1,
        "short_id": "MATH 4960R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, and synthesize and interpret data and to present results in writing and other relevant communication formats.",
        "assignments": [
          {
            "id": "44870f4f-f4dc-4b04-8c26-881a06570f63",
            "title": "Homework",
            "due_date": "2025-08-10T00:00:00",
            "completed": false
          },
          {
            "id": "5d22c26c-e061-4c1f-bf0a-cf7dd303be52",
            "title": "Quiz",
            "due_date": "2025-08-24T00:00:00",
            "completed": false
          },
          {
            "id": "c7e40f63-7518-4ee3-bebf-65b3fdd41117",
            "title": "Paper",
            "due_date": "2025-09-05T00:00:00",
            "completed": false
          },
          {
            "id": "3dec23a0-c366-4501-bb4f-5fe60d8a95c1",
            "title": "Reading",
            "due_date": "2025-11-05T00:00:00",
            "completed": false
          },
          {
            "id": "c427057d-9909-4149-a68e-cec170dce00b",
            "title": "Test",
            "due_date": "2025-11-08T00:00:00",
            "completed": false
          },
          {
            "id": "12a2375b-9ac8-419f-a2c4-a84015fe1ed0",
            "title": "Test",
            "due_date": "2025-09-04T00:00:00",
            "completed": false
          },
          {
            "id": "1c5bbbe4-b8cd-4576-8f42-308a2580960d",
            "title": "Lab",
            "due_date": "2025-11-13T00:00:00",
            "completed": false
          },
          {
            "id": "3e59454c-2f47-4d39-a437-7ecfc04d111c",
            "title": "Essay",
            "due_date": "2025-11-23T00:00:00",
            "completed": false
          },
          {
            "id": "21e8abae-f4cd-419a-9ea6-0be737e55a32",
            "title": "Final",
            "due_date": "2025-08-19T00:00:00",
            "completed": false
          },
          {
            "id": "b29c2ac0-16ba-40ef-98fa-d5bc1fd4d5e8",
            "title": "Test",
            "due_date": "2025-10-25T00:00:00",
            "completed": false
          },
          {
            "id": "4cdd06e5-1f25-4575-ad33-4c462d18aac8",
            "title": "Paper",
            "due_date": "2025-08-29T00:00:00",
            "completed": false
          },
          {
            "id": "f704e5a1-f1d8-4b2d-b075-68ef9c2f55e6",
            "title": "Presentation",
            "due_date": "2025-09-06T00:00:00",
            "completed": false
          },
          {
            "id": "9c131fbe-9273-4138-9dd4-0db7f928bd63",
            "title": "Essay",
            "due_date": "2025-09-09T00:00:00",
            "completed": false
          },
          {
            "id": "6bcd6f65-447c-48fc-b959-44f8f9bb2801",
            "title": "Lab",
            "due_date": "2025-09-02T00:00:00",
            "completed": false
          },
          {
            "id": "97149ea7-4815-4e56-a69b-1b97a80bfac6",
            "title": "Exam",
            "due_date": "2025-11-07T00:00:00",
            "completed": false
          },
          {
            "id": "ac6e51a3-1f81-4d55-8ee5-64c7068a3a0a",
            "title": "Final",
            "due_date": "2025-11-18T00:00:00",
            "completed": false
          },
          {
            "id": "15fb09ff-55ab-4c7f-a8f7-289a6651cded",
            "title": "Paper",
            "due_date": "2025-09-13T00:00:00",
            "completed": false
          },
          {
            "id": "d8af6995-3f8f-4dcf-89cd-9ef368c0e0f7",
            "title": "Paper",
            "due_date": "2025-09-02T00:00:00",
            "completed": false
          },
          {
            "id": "0be36f05-f25e-4029-a428-1f1bfb9b2196",
            "title": "Homework",
            "due_date": "2025-09-29T00:00:00",
            "completed": false
          },
          {
            "id": "0b11fd44-cb7b-46c3-b5ca-bc4a2128d396",
            "title": "Presentation",
            "due_date": "2025-08-12T00:00:00",
            "completed": false
          },
          {
            "id": "c6be069b-e478-477d-b6f8-8401b2d2cd6d",
            "title": "Lab",
            "due_date": "2025-08-20T00:00:00",
            "completed": false
          },
          {
            "id": "d2b11a7d-3674-47cf-822b-d3b63a928903",
            "title": "Discussion",
            "due_date": "2025-08-12T00:00:00",
            "completed": false
          },
          {
            "id": "7cc0fa5e-1a74-453c-95bb-04e05ca5dc93",
            "title": "Paper",
            "due_date": "2025-08-06T00:00:00",
            "completed": false
          },
          {
            "id": "411066a3-8bdf-4a6d-9167-3d7f5a28c8c4",
            "title": "Reading",
            "due_date": "2025-08-06T00:00:00",
            "completed": false
          },
          {
            "id": "5946d5d5-5544-4440-a6f5-4dc73ae623e9",
            "title": "Presentation",
            "due_date": "2025-10-05T00:00:00",
            "completed": false
          },
          {
            "id": "22a6086a-6af0-49c9-82d4-cfb609c854dd",
            "title": "Discussion",
            "due_date": "2025-11-11T00:00:00",
            "completed": false
          },
          {
            "id": "4dcec501-2d70-4cdb-9a93-3d4ba95f93e8",
            "title": "Presentation",
            "due_date": "2025-10-24T00:00:00",
            "completed": false
          },
          {
            "id": "bc6d9c58-bbb4-4f3f-b5f9-7f1bdde33f48",
            "title": "Paper",
            "due_date": "2025-10-16T00:00:00",
            "completed": false
          },
          {
            "id": "76a8366c-595d-4ff3-8295-5452ef9e2693",
            "title": "Paper",
            "due_date": "2025-10-16T00:00:00",
            "completed": false
          },
          {
            "id": "48c10a33-9001-432b-a1ac-3a509af72051",
            "title": "Lab",
            "due_date": "2025-08-29T00:00:00",
            "completed": false
          },
          {
            "id": "b7feb56e-66ad-479a-9b26-f5365b6f4262",
            "title": "Essay",
            "due_date": "2025-10-09T00:00:00",
            "completed": false
          },
          {
            "id": "7396105b-9872-4aa1-80bd-cb77b9dac710",
            "title": "Exam",
            "due_date": "2025-11-14T00:00:00",
            "completed": false
          },
          {
            "id": "9d0e6225-8df1-4553-a457-a069136c5952",
            "title": "Reading",
            "due_date": "2025-08-12T00:00:00",
            "completed": false
          },
          {
            "id": "1f6f0789-a0fa-4723-a38a-a256d398235d",
            "title": "Essay",
            "due_date": "2025-10-02T00:00:00",
            "completed": false
          },
          {
            "id": "b7a6feac-71fc-4c30-9fcd-452fedbe9138",
            "title": "Reading",
            "due_date": "2025-10-03T00:00:00",
            "completed": false
          },
          {
            "id": "41fc70a3-2f40-42cb-9b13-6122b7e6172a",
            "title": "Presentation",
            "due_date": "2025-11-22T00:00:00",
            "completed": false
          },
          {
            "id": "bffb7959-72b2-4362-8101-ebe2e5981ffa",
            "title": "Exam",
            "due_date": "2025-10-09T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "1566173d-0036-4949-b81c-32e99e13819c",
        "grade": 91.19
      },
      {
        "id": "6ff0012e-1a1a-438b-afa1-fdfb55c9e7b7",
        "title": "Faculty-Mentored Undergraduate Research I",
        "credit_hours": 1,
        "short_id": "LATN 4960R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, synthesize, and interpret data and to present results in writing and other relevant communication formats.",
        "assignments": [
          {
            "id": "e3f4f49c-3ace-4d25-8849-838436ca3c8a",
            "title": "Quiz",
            "due_date": "2025-08-25T00:00:00",
            "completed": false
          },
          {
            "id": "37c77fa2-24ab-45c3-9c14-fbcb6ba3a36a",
            "title": "Test",
            "due_date": "2025-09-02T00:00:00",
            "completed": false
          },
          {
            "id": "3708f0ab-6552-4dff-99c4-315e3c53e02b",
            "title": "Discussion",
            "due_date": "2025-10-21T00:00:00",
            "completed": false
          },
          {
            "id": "4718183f-c689-4673-ad7b-541bc17d9c3b",
            "title": "Homework",
            "due_date": "2025-08-20T00:00:00",
            "completed": false
          },
          {
            "id": "2b5b82c8-8e00-488e-8f36-5bfa291d432a",
            "title": "Homework",
            "due_date": "2025-10-31T00:00:00",
            "completed": false
          },
          {
            "id": "9eb6ad67-a8fc-46e0-9e60-3fadc5b16f6f",
            "title": "Test",
            "due_date": "2025-08-09T00:00:00",
            "completed": false
          },
          {
            "id": "185671ab-c30f-446f-8fd6-aa9aa4f0a3d5",
            "title": "Reading",
            "due_date": "2025-08-27T00:00:00",
            "completed": false
          },
          {
            "id": "ae49c1ef-0e5c-4b25-bd92-47f9f9884c31",
            "title": "Reading",
            "due_date": "2025-08-18T00:00:00",
            "completed": false
          },
          {
            "id": "8cd92dc6-d9aa-46ed-9bc8-ebd67eb8f5ec",
            "title": "Quiz",
            "due_date": "2025-09-21T00:00:00",
            "completed": false
          },
          {
            "id": "d01aeb25-1c02-4f1b-8be5-587db9f7cd90",
            "title": "Discussion",
            "due_date": "2025-08-13T00:00:00",
            "completed": false
          },
          {
            "id": "4737b5ac-5c4c-4ab2-813f-f6e16bb2b86e",
            "title": "Presentation",
            "due_date": "2025-08-29T00:00:00",
            "completed": false
          },
          {
            "id": "88f204c6-29aa-46c8-8eb6-069f686bd99f",
            "title": "Essay",
            "due_date": "2025-11-23T00:00:00",
            "completed": false
          },
          {
            "id": "18c3d317-6fba-42b7-9d0d-e0d01ed542e1",
            "title": "Discussion",
            "due_date": "2025-11-23T00:00:00",
            "completed": false
          },
          {
            "id": "287a1397-a8c7-4b3f-b91b-2bec18952c59",
            "title": "Quiz",
            "due_date": "2025-10-07T00:00:00",
            "completed": false
          },
          {
            "id": "c100bef8-a34c-44b9-bfdd-75a613b0d937",
            "title": "Lab",
            "due_date": "2025-10-02T00:00:00",
            "completed": false
          },
          {
            "id": "4e73c504-f5e8-4755-8781-80df25961e8f",
            "title": "Test",
            "due_date": "2025-10-16T00:00:00",
            "completed": false
          },
          {
            "id": "a38d2e5c-81d8-42e2-b643-457d81728b44",
            "title": "Presentation",
            "due_date": "2025-08-17T00:00:00",
            "completed": false
          },
          {
            "id": "738668ad-f523-45e9-9115-9a392a9eada6",
            "title": "Exam",
            "due_date": "2025-10-21T00:00:00",
            "completed": false
          },
          {
            "id": "38276f06-59be-4af3-82ce-69bad097e7de",
            "title": "Quiz",
            "due_date": "2025-11-22T00:00:00",
            "completed": false
          },
          {
            "id": "10402100-9549-438d-89aa-55bfe5ca2ec2",
            "title": "Test",
            "due_date": "2025-10-20T00:00:00",
            "completed": false
          },
          {
            "id": "7f1b89bb-5055-4940-a85d-1f7bc4e91234",
            "title": "Test",
            "due_date": "2025-08-05T00:00:00",
            "completed": false
          },
          {
            "id": "1376756b-6340-4aec-b78d-56bcb2a069df",
            "title": "Test",
            "due_date": "2025-08-30T00:00:00",
            "completed": false
          },
          {
            "id": "02b73e74-252f-46a7-9144-6c7d614ea8fb",
            "title": "Presentation",
            "due_date": "2025-10-18T00:00:00",
            "completed": false
          },
          {
            "id": "16b6a5c0-32d0-4117-af27-339f43e45fcc",
            "title": "Test",
            "due_date": "2025-09-24T00:00:00",
            "completed": false
          },
          {
            "id": "f495d7c7-3000-439c-b69b-f1a101a2eff4",
            "title": "Homework",
            "due_date": "2025-08-28T00:00:00",
            "completed": false
          },
          {
            "id": "2b513cb4-0b9a-46c4-bf3c-4e52c33f017f",
            "title": "Quiz",
            "due_date": "2025-10-02T00:00:00",
            "completed": false
          },
          {
            "id": "cca33345-08ee-4b8c-b44a-5d2a667c6eb0",
            "title": "Presentation",
            "due_date": "2025-10-13T00:00:00",
            "completed": false
          },
          {
            "id": "0eebbf5d-9328-4e30-bf81-57ebe8c32880",
            "title": "Final",
            "due_date": "2025-08-13T00:00:00",
            "completed": false
          },
          {
            "id": "387b9a81-1ca8-4a8c-b317-be30aa7cfe18",
            "title": "Paper",
            "due_date": "2025-10-25T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "1566173d-0036-4949-b81c-32e99e13819c",
        "grade": 92.63
      },
      {
        "id": "5f68ef4a-b420-43f1-8107-a97d2e6ad969",
        "title": "Faculty Mentored Research in Computer Science",
        "credit_hours": 1,
        "short_id": "CSCI 4960",
        "description": "Content will vary in response to the interests, needs, and capability of the students and faculty involved. Individual, guided study in computer science.",
        "assignments": [
          {
            "id": "c056b79a-7a6b-418c-9365-2dd1f180ef05",
            "title": "Final",
            "due_date": "2025-09-13T00:00:00",
            "completed": false
          },
          {
            "id": "8f9351cd-c0c7-4aec-b1d5-b79a0943f903",
            "title": "Project",
            "due_date": "2025-11-13T00:00:00",
            "completed": false
          },
          {
            "id": "920de01f-3d00-45ed-be5c-10bf2af59a13",
            "title": "Exam",
            "due_date": "2025-08-19T00:00:00",
            "completed": false
          },
          {
            "id": "86f6b698-d863-4c16-82c5-bdc814c8cd53",
            "title": "Final",
            "due_date": "2025-10-14T00:00:00",
            "completed": false
          },
          {
            "id": "ffd88d36-49c4-483d-9cce-299f4ce7df02",
            "title": "Project",
            "due_date": "2025-09-18T00:00:00",
            "completed": false
          },
          {
            "id": "36d2ac6a-f0e4-4819-a0ce-213198bcd23b",
            "title": "Essay",
            "due_date": "2025-10-10T00:00:00",
            "completed": false
          },
          {
            "id": "96c882c0-68b1-4216-9ab1-51511c0849a4",
            "title": "Discussion",
            "due_date": "2025-09-18T00:00:00",
            "completed": false
          },
          {
            "id": "5c8fa9c5-3f52-4db7-9041-44d9a4602e8f",
            "title": "Essay",
            "due_date": "2025-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "194580af-bf11-4e57-ac9d-0f87f4562f7e",
            "title": "Quiz",
            "due_date": "2025-11-11T00:00:00",
            "completed": false
          },
          {
            "id": "f44e4bd3-ca93-41c8-94d5-ee4461877e99",
            "title": "Essay",
            "due_date": "2025-10-12T00:00:00",
            "completed": false
          },
          {
            "id": "1644f786-8ea6-4192-ac10-9bf42761c664",
            "title": "Lab",
            "due_date": "2025-11-12T00:00:00",
            "completed": false
          },
          {
            "id": "a5f41af2-2c52-4651-b346-b7762e81bbab",
            "title": "Test",
            "due_date": "2025-10-26T00:00:00",
            "completed": false
          },
          {
            "id": "7dc5192b-2f72-4627-a379-9a0596f1310c",
            "title": "Paper",
            "due_date": "2025-08-16T00:00:00",
            "completed": false
          },
          {
            "id": "03b4cf72-5e49-40fd-b019-25bdd8443ca4",
            "title": "Exam",
            "due_date": "2025-10-20T00:00:00",
            "completed": false
          },
          {
            "id": "84365918-e060-4fb0-bce5-97b4c72985b2",
            "title": "Homework",
            "due_date": "2025-09-12T00:00:00",
            "completed": false
          },
          {
            "id": "7e58f0f6-9b57-4cc7-99c1-521cc3f63510",
            "title": "Homework",
            "due_date": "2025-10-28T00:00:00",
            "completed": false
          },
          {
            "id": "8197d290-237f-42d4-8920-7ec6a1fe3641",
            "title": "Essay",
            "due_date": "2025-11-12T00:00:00",
            "completed": false
          },
          {
            "id": "9a260b4c-a5e4-423d-9492-cea5e04e57e2",
            "title": "Project",
            "due_date": "2025-10-05T00:00:00",
            "completed": false
          },
          {
            "id": "dbcab3b0-41f4-427b-8a09-f09973eb2226",
            "title": "Project",
            "due_date": "2025-11-04T00:00:00",
            "completed": false
          },
          {
            "id": "ca1b4b64-8386-4547-a577-b929d25e2336",
            "title": "Reading",
            "due_date": "2025-08-15T00:00:00",
            "completed": false
          },
          {
            "id": "56aab4e5-15bd-4f3e-8db0-dd06655f2657",
            "title": "Test",
            "due_date": "2025-11-15T00:00:00",
            "completed": false
          },
          {
            "id": "982db013-66b6-459f-a083-00d26d0ffac9",
            "title": "Lab",
            "due_date": "2025-10-02T00:00:00",
            "completed": false
          },
          {
            "id": "f1ce667d-ed17-44d2-b868-958e929b92c3",
            "title": "Test",
            "due_date": "2025-08-30T00:00:00",
            "completed": false
          },
          {
            "id": "744cd2e5-6ab6-4fad-994b-1c96494ac958",
            "title": "Reading",
            "due_date": "2025-10-26T00:00:00",
            "completed": false
          },
          {
            "id": "f9b0b084-bb68-4689-9814-716c42795630",
            "title": "Presentation",
            "due_date": "2025-10-16T00:00:00",
            "completed": false
          },
          {
            "id": "15b8aeba-e502-414d-babe-281a3c725c73",
            "title": "Lab",
            "due_date": "2025-11-19T00:00:00",
            "completed": false
          },
          {
            "id": "99ac6cdb-b2b9-43dc-a0cf-1617422c8183",
            "title": "Paper",
            "due_date": "2025-09-04T00:00:00",
            "completed": false
          },
          {
            "id": "563f9852-9897-4d7b-b242-bbb3bb96d4be",
            "title": "Discussion",
            "due_date": "2025-10-20T00:00:00",
            "completed": false
          },
          {
            "id": "75025519-71f0-481f-8f0f-109dd8a6e20d",
            "title": "Presentation",
            "due_date": "2025-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "8ee0eafb-9293-48b8-9bb9-7ef64a8670ad",
            "title": "Lab",
            "due_date": "2025-10-05T00:00:00",
            "completed": false
          },
          {
            "id": "4d7c3ca2-759d-4335-a1e7-0427d318542a",
            "title": "Test",
            "due_date": "2025-08-19T00:00:00",
            "completed": false
          },
          {
            "id": "378be378-78de-4204-80dd-54ee2f3651c0",
            "title": "Final",
            "due_date": "2025-08-03T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "1566173d-0036-4949-b81c-32e99e13819c",
        "grade": 94.59
      },
      {
        "id": "e63610da-7a2a-406f-96f7-c2ebed7226cb",
        "title": "Faculty-Mentored Undergraduate Research I",
        "credit_hours": 1,
        "short_id": "CSCI 4960R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, synthesize, and interpret data and to present results in writing and other relevant communication formats.",
        "assignments": [
          {
            "id": "88565172-60b0-45c8-899f-45dd8893063d",
            "title": "Discussion",
            "due_date": "2026-01-20T00:00:00",
            "completed": false
          },
          {
            "id": "4a8b9411-e43b-4e35-955e-f80d0125fce4",
            "title": "Final",
            "due_date": "2026-03-02T00:00:00",
            "completed": false
          },
          {
            "id": "a4f2037a-b654-4a26-9289-769b5e403972",
            "title": "Essay",
            "due_date": "2026-04-12T00:00:00",
            "completed": false
          },
          {
            "id": "5a67d354-8d89-4fd9-83f6-e8f76d2365c5",
            "title": "Discussion",
            "due_date": "2026-03-11T00:00:00",
            "completed": false
          },
          {
            "id": "065aaab9-46b5-4040-b49b-37d0b6214ace",
            "title": "Reading",
            "due_date": "2026-03-11T00:00:00",
            "completed": false
          },
          {
            "id": "ea6560cb-eeeb-4635-99c0-910665f0070e",
            "title": "Test",
            "due_date": "2026-01-08T00:00:00",
            "completed": false
          },
          {
            "id": "6c51c239-c821-4a66-946c-a7af5cea8885",
            "title": "Project",
            "due_date": "2026-04-11T00:00:00",
            "completed": false
          },
          {
            "id": "8b927dbb-6041-42f8-880b-0a28fd63e84d",
            "title": "Test",
            "due_date": "2026-03-11T00:00:00",
            "completed": false
          },
          {
            "id": "5bb37b9b-5300-401d-aaed-cde593b4f2fb",
            "title": "Lab",
            "due_date": "2026-04-16T00:00:00",
            "completed": false
          },
          {
            "id": "f9ef6780-fa33-4013-a36f-70ee48f43fbc",
            "title": "Lab",
            "due_date": "2026-03-04T00:00:00",
            "completed": false
          },
          {
            "id": "490c1249-ba7f-4706-8d9a-5d2420275e8c",
            "title": "Homework",
            "due_date": "2026-01-19T00:00:00",
            "completed": false
          },
          {
            "id": "de10f46e-2de9-48ef-b6e0-fef231f6345e",
            "title": "Test",
            "due_date": "2026-02-28T00:00:00",
            "completed": false
          },
          {
            "id": "e8ed7522-e541-49b2-b7ab-b24c5081ca57",
            "title": "Paper",
            "due_date": "2026-02-15T00:00:00",
            "completed": false
          },
          {
            "id": "c97b6348-a0eb-4f7b-9bb2-897465151471",
            "title": "Paper",
            "due_date": "2026-01-30T00:00:00",
            "completed": false
          },
          {
            "id": "d9127036-308e-4a6b-860f-eb4a91c85217",
            "title": "Paper",
            "due_date": "2026-04-22T00:00:00",
            "completed": false
          },
          {
            "id": "050fb632-15c5-4eaf-a46c-335407dc8a9b",
            "title": "Final",
            "due_date": "2026-02-10T00:00:00",
            "completed": false
          },
          {
            "id": "b294e408-60aa-45f4-ab06-fff55f5ca1a4",
            "title": "Homework",
            "due_date": "2026-04-08T00:00:00",
            "completed": false
          },
          {
            "id": "d7598c29-b109-4e83-80bb-b2439c14c117",
            "title": "Presentation",
            "due_date": "2026-04-14T00:00:00",
            "completed": false
          },
          {
            "id": "bbd2f8ca-2cac-4744-9ff2-f03566a31764",
            "title": "Reading",
            "due_date": "2026-04-17T00:00:00",
            "completed": false
          },
          {
            "id": "7ec7cb39-ced9-4366-ba9f-71ce75b2c8e0",
            "title": "Essay",
            "due_date": "2026-04-19T00:00:00",
            "completed": false
          },
          {
            "id": "60baa55f-be29-4076-91e4-964f5046653c",
            "title": "Exam",
            "due_date": "2026-04-19T00:00:00",
            "completed": false
          },
          {
            "id": "5d6f2371-f571-49a3-9bbc-9b75bee9793a",
            "title": "Test",
            "due_date": "2026-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "2970b26d-9db8-4e7b-8d99-f3a94f35d141",
            "title": "Lab",
            "due_date": "2026-01-26T00:00:00",
            "completed": false
          },
          {
            "id": "d12dcbee-f5c9-4888-bdfe-991aa4bbdbc4",
            "title": "Homework",
            "due_date": "2026-03-26T00:00:00",
            "completed": false
          },
          {
            "id": "ef7f9937-873e-497c-8098-f7eae193fd21",
            "title": "Quiz",
            "due_date": "2026-02-27T00:00:00",
            "completed": false
          },
          {
            "id": "911a832b-a239-48e1-a9f6-a8b47441406b",
            "title": "Final",
            "due_date": "2026-01-19T00:00:00",
            "completed": false
          },
          {
            "id": "dff15a01-7e5d-4e36-90f4-80c58fc5eb35",
            "title": "Exam",
            "due_date": "2026-02-27T00:00:00",
            "completed": false
          },
          {
            "id": "8e3aff09-e515-455a-8169-914179fea079",
            "title": "Presentation",
            "due_date": "2026-03-07T00:00:00",
            "completed": false
          },
          {
            "id": "add3fc5e-952d-4bd8-a368-e1f4058e4ed3",
            "title": "Quiz",
            "due_date": "2026-04-17T00:00:00",
            "completed": false
          },
          {
            "id": "0aed301e-2c53-40e7-a023-be325424249e",
            "title": "Essay",
            "due_date": "2026-03-28T00:00:00",
            "completed": false
          },
          {
            "id": "34aa213e-c2af-4b7c-bda3-92b6bd894d9e",
            "title": "Test",
            "due_date": "2026-04-01T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "31b475c0-cedd-4a42-9337-f7d7f8bf37cc",
        "grade": 95.64
      },
      {
        "id": "e7df7672-5026-4eb1-bea5-f2769f505494",
        "title": "Faculty-Mentored Undergraduate Research II",
        "credit_hours": 1,
        "short_id": "MATH 4970R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, and synthesize and interpret data and to present results in writing and other relevant communication formats.",
        "assignments": [
          {
            "id": "1c12eaee-e27a-40a9-9fb1-56ba155b2efd",
            "title": "Exam",
            "due_date": "2026-03-23T00:00:00",
            "completed": false
          },
          {
            "id": "3bdfdda2-5d58-4ab9-9e0c-2092f8b0c6f6",
            "title": "Project",
            "due_date": "2026-01-08T00:00:00",
            "completed": false
          },
          {
            "id": "8650379f-e473-4cc6-a2da-c02633b43dee",
            "title": "Quiz",
            "due_date": "2026-03-26T00:00:00",
            "completed": false
          },
          {
            "id": "2fc03e3f-6bf1-41b0-ba47-240458dd2aa8",
            "title": "Paper",
            "due_date": "2026-01-09T00:00:00",
            "completed": false
          },
          {
            "id": "002c2374-1a7d-428e-8fc0-b60b484e2b95",
            "title": "Final",
            "due_date": "2026-03-24T00:00:00",
            "completed": false
          },
          {
            "id": "cdc93ff9-3548-4cc7-bae2-356742cfcc9f",
            "title": "Test",
            "due_date": "2026-03-24T00:00:00",
            "completed": false
          },
          {
            "id": "e9295ad1-6b10-4194-a2ad-82bd153653e3",
            "title": "Paper",
            "due_date": "2026-02-13T00:00:00",
            "completed": false
          },
          {
            "id": "9ed63a77-32a3-4e4f-a60d-c700c9ea677a",
            "title": "Project",
            "due_date": "2026-02-05T00:00:00",
            "completed": false
          },
          {
            "id": "0f44143b-ed44-4cde-8197-caa7a591832d",
            "title": "Project",
            "due_date": "2026-03-03T00:00:00",
            "completed": false
          },
          {
            "id": "c8218d2e-1932-4978-a08f-449fb3fcfe47",
            "title": "Reading",
            "due_date": "2026-02-10T00:00:00",
            "completed": false
          },
          {
            "id": "bace0375-7b7c-471b-b073-70f26e14147d",
            "title": "Project",
            "due_date": "2026-01-26T00:00:00",
            "completed": false
          },
          {
            "id": "31730ba2-7382-4828-b5d5-c9f1b8d68138",
            "title": "Project",
            "due_date": "2026-01-24T00:00:00",
            "completed": false
          },
          {
            "id": "424d63ca-c25b-4169-a316-303d961dceea",
            "title": "Essay",
            "due_date": "2026-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "3954fb89-b8fd-4ee1-9387-50a4b815f015",
            "title": "Reading",
            "due_date": "2026-03-22T00:00:00",
            "completed": false
          },
          {
            "id": "6c98cf7a-3404-4557-ba80-e3ff6d4495a6",
            "title": "Presentation",
            "due_date": "2026-04-03T00:00:00",
            "completed": false
          },
          {
            "id": "23c3a648-a686-4329-8d1f-cc8952e5d79a",
            "title": "Reading",
            "due_date": "2026-02-18T00:00:00",
            "completed": false
          },
          {
            "id": "594d1ec7-7724-4c97-8ec5-5796163e0dd4",
            "title": "Final",
            "due_date": "2026-03-01T00:00:00",
            "completed": false
          },
          {
            "id": "fd257509-0e44-46dd-a33c-608a8cec0206",
            "title": "Essay",
            "due_date": "2026-02-17T00:00:00",
            "completed": false
          },
          {
            "id": "b03242c0-d750-43b3-8f64-d51d0ce8819f",
            "title": "Essay",
            "due_date": "2026-01-16T00:00:00",
            "completed": false
          },
          {
            "id": "1b3e31ad-2ef5-4ace-8adb-20f065ab18c5",
            "title": "Homework",
            "due_date": "2026-03-06T00:00:00",
            "completed": false
          },
          {
            "id": "9503c679-cb51-41b7-b11c-29a6caa0da2d",
            "title": "Paper",
            "due_date": "2026-04-02T00:00:00",
            "completed": false
          },
          {
            "id": "5e36be30-3184-42db-aecb-67a0938aa9c5",
            "title": "Presentation",
            "due_date": "2026-02-13T00:00:00",
            "completed": false
          },
          {
            "id": "69b0037b-3a32-408e-8f60-2bb5dea04334",
            "title": "Essay",
            "due_date": "2026-03-04T00:00:00",
            "completed": false
          },
          {
            "id": "e2ef0afc-4e6e-4586-b1e5-cd34361cd2fc",
            "title": "Paper",
            "due_date": "2026-04-02T00:00:00",
            "completed": false
          },
          {
            "id": "45217009-d969-4098-a879-842d131202f2",
            "title": "Presentation",
            "due_date": "2026-03-23T00:00:00",
            "completed": false
          },
          {
            "id": "f7fa48b8-b8e4-43ad-855b-a87c207d2f28",
            "title": "Test",
            "due_date": "2026-04-14T00:00:00",
            "completed": false
          },
          {
            "id": "ffdc4c9d-3481-4c15-96d3-3c273b636a97",
            "title": "Final",
            "due_date": "2026-02-01T00:00:00",
            "completed": false
          },
          {
            "id": "0fdb7f37-77f6-4e32-aba3-78916aa60062",
            "title": "Discussion",
            "due_date": "2026-02-09T00:00:00",
            "completed": false
          },
          {
            "id": "33ec7a68-b53b-4f15-9844-422ec9caef80",
            "title": "Discussion",
            "due_date": "2026-04-22T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "31b475c0-cedd-4a42-9337-f7d7f8bf37cc",
        "grade": 99.71
      },
      {
        "id": "5cefb496-5611-4fc1-ad7c-820665330096",
        "title": "Faculty-Mentored Undergraduate Research II",
        "credit_hours": 1,
        "short_id": "LATN 4970R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, synthesize, and interpret data and to present results in writing and other relevant communication formats.",
        "assignments": [
          {
            "id": "9b680b61-cb59-4dec-81f1-879ca26fd1dd",
            "title": "Final",
            "due_date": "2026-03-22T00:00:00",
            "completed": false
          },
          {
            "id": "5cf6d6d7-1f59-4802-b905-8186c829feb9",
            "title": "Project",
            "due_date": "2026-04-21T00:00:00",
            "completed": false
          },
          {
            "id": "bc81a043-9e94-4beb-971b-78466bdd0684",
            "title": "Final",
            "due_date": "2026-04-08T00:00:00",
            "completed": false
          },
          {
            "id": "022ed75c-e285-4347-b6ac-e945359ca8b5",
            "title": "Exam",
            "due_date": "2026-02-10T00:00:00",
            "completed": false
          },
          {
            "id": "285306fa-69a2-47a6-9722-2c3094a4455f",
            "title": "Presentation",
            "due_date": "2026-01-31T00:00:00",
            "completed": false
          },
          {
            "id": "6f42a0d1-1266-45d6-9009-48eb35d786a9",
            "title": "Test",
            "due_date": "2026-04-14T00:00:00",
            "completed": false
          },
          {
            "id": "12d01c13-a5ea-4c8a-b522-387b6d2a4310",
            "title": "Paper",
            "due_date": "2026-01-20T00:00:00",
            "completed": false
          },
          {
            "id": "6a58ba37-07e7-4645-8f83-b3f751a409d8",
            "title": "Quiz",
            "due_date": "2026-04-19T00:00:00",
            "completed": false
          },
          {
            "id": "be1b20d5-d7e0-4e5b-a751-0d9e4c8126ef",
            "title": "Discussion",
            "due_date": "2026-01-22T00:00:00",
            "completed": false
          },
          {
            "id": "c008cc64-7f97-4d59-97fa-b25dd02155aa",
            "title": "Project",
            "due_date": "2026-03-27T00:00:00",
            "completed": false
          },
          {
            "id": "d54070a2-604c-41fe-b7f9-9608fba18353",
            "title": "Test",
            "due_date": "2026-01-15T00:00:00",
            "completed": false
          },
          {
            "id": "d5be440a-89d5-433c-b095-4ced23380a46",
            "title": "Paper",
            "due_date": "2026-04-08T00:00:00",
            "completed": false
          },
          {
            "id": "a7ba8f35-e13b-4bd1-9c37-ffdb3b2c2006",
            "title": "Final",
            "due_date": "2026-03-19T00:00:00",
            "completed": false
          },
          {
            "id": "50586ce9-afa0-422f-b5e3-469cb5a9338d",
            "title": "Lab",
            "due_date": "2026-01-24T00:00:00",
            "completed": false
          },
          {
            "id": "2058489b-d6fc-4a10-b116-c67c494a3ac8",
            "title": "Final",
            "due_date": "2026-03-17T00:00:00",
            "completed": false
          },
          {
            "id": "c8665bb3-bc22-4611-a07a-c8ef221ad875",
            "title": "Test",
            "due_date": "2026-04-13T00:00:00",
            "completed": false
          },
          {
            "id": "abcb7e3b-b362-437d-a179-f9500104fccd",
            "title": "Test",
            "due_date": "2026-04-17T00:00:00",
            "completed": false
          },
          {
            "id": "d3e0ad81-3d38-469e-982e-141717471ffc",
            "title": "Homework",
            "due_date": "2026-03-19T00:00:00",
            "completed": false
          },
          {
            "id": "67cfe825-a05b-45fe-9298-d15690c938b9",
            "title": "Homework",
            "due_date": "2026-04-01T00:00:00",
            "completed": false
          },
          {
            "id": "eb9c088d-6b55-4381-b779-07afcc408177",
            "title": "Project",
            "due_date": "2026-01-17T00:00:00",
            "completed": false
          },
          {
            "id": "30451277-f2c4-4365-930e-f540cd2ee9ec",
            "title": "Final",
            "due_date": "2026-02-07T00:00:00",
            "completed": false
          },
          {
            "id": "3a71f545-47a1-4d81-8e1a-031d3947770b",
            "title": "Test",
            "due_date": "2026-01-26T00:00:00",
            "completed": false
          },
          {
            "id": "40750869-72b8-4e17-bb5c-5113e1f6af5c",
            "title": "Presentation",
            "due_date": "2026-01-28T00:00:00",
            "completed": false
          },
          {
            "id": "e5a52cb9-e7ff-43fe-9f76-73752ee457be",
            "title": "Reading",
            "due_date": "2026-02-21T00:00:00",
            "completed": false
          },
          {
            "id": "51fdb2a3-18fb-4368-8b9c-c28e4c44ca09",
            "title": "Essay",
            "due_date": "2026-02-04T00:00:00",
            "completed": false
          },
          {
            "id": "154ef946-f87a-4bd8-9c35-f79dd7c37bff",
            "title": "Essay",
            "due_date": "2026-02-19T00:00:00",
            "completed": false
          },
          {
            "id": "491a1888-f7df-4b5e-bd20-8b52efb2a5c2",
            "title": "Project",
            "due_date": "2026-01-09T00:00:00",
            "completed": false
          },
          {
            "id": "70d5e973-dc30-4c48-af83-3c2a0ed2c6e1",
            "title": "Final",
            "due_date": "2026-01-08T00:00:00",
            "completed": false
          },
          {
            "id": "4b0f5eb9-122c-42f6-9dc3-45b71f2b5a0b",
            "title": "Reading",
            "due_date": "2026-04-08T00:00:00",
            "completed": false
          },
          {
            "id": "905b40bb-8849-40fc-81b7-7d33724e5112",
            "title": "Reading",
            "due_date": "2026-03-27T00:00:00",
            "completed": false
          },
          {
            "id": "049b6eac-0811-439c-b832-cc7fb4330aea",
            "title": "Project",
            "due_date": "2026-04-11T00:00:00",
            "completed": false
          },
          {
            "id": "94d4fb95-c2fe-4f7b-9e2b-d99b614e8fb4",
            "title": "Quiz",
            "due_date": "2026-03-19T00:00:00",
            "completed": false
          },
          {
            "id": "bc34afc3-263c-4a77-b747-f02b9a63b243",
            "title": "Essay",
            "due_date": "2026-01-12T00:00:00",
            "completed": false
          },
          {
            "id": "2c539843-8f18-4fb7-b5eb-e70e03979107",
            "title": "Exam",
            "due_date": "2026-01-28T00:00:00",
            "completed": false
          },
          {
            "id": "25943df7-774e-468f-9f10-d5b70be54ab1",
            "title": "Homework",
            "due_date": "2026-04-22T00:00:00",
            "completed": false
          },
          {
            "id": "6f59c757-29b3-4e96-a93b-d75300647655",
            "title": "Project",
            "due_date": "2026-02-09T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "31b475c0-cedd-4a42-9337-f7d7f8bf37cc",
        "grade": 90.09
      },
      {
        "id": "ce9b6fa1-1252-400b-b440-af34e71a7e5f",
        "title": "Faculty-Mentored Undergraduate Research II",
        "credit_hours": 1,
        "short_id": "CSCI 4970R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, synthesize, and interpret data and to present results in writing and other relevant communication formats.",
        "assignments": [
          {
            "id": "4511dcd8-fd16-4c45-8e5d-c75721ef16c0",
            "title": "Quiz",
            "due_date": "2026-01-12T00:00:00",
            "completed": false
          },
          {
            "id": "e04f195b-b664-4880-a032-72825aed82d0",
            "title": "Homework",
            "due_date": "2026-01-18T00:00:00",
            "completed": false
          },
          {
            "id": "5e0fdc0a-2608-46de-a1a7-de2a7d896c3b",
            "title": "Project",
            "due_date": "2026-04-05T00:00:00",
            "completed": false
          },
          {
            "id": "5d51deff-fc8c-4804-ae0d-67747ae4eb59",
            "title": "Discussion",
            "due_date": "2026-02-04T00:00:00",
            "completed": false
          },
          {
            "id": "42c10cda-43f4-4759-b9d3-0e8025f6ed99",
            "title": "Essay",
            "due_date": "2026-03-05T00:00:00",
            "completed": false
          },
          {
            "id": "90c6bb1d-7a3a-4110-804a-a75b7788815b",
            "title": "Quiz",
            "due_date": "2026-01-13T00:00:00",
            "completed": false
          },
          {
            "id": "2e1f990b-af67-4576-93f9-beb849642b84",
            "title": "Paper",
            "due_date": "2026-02-25T00:00:00",
            "completed": false
          },
          {
            "id": "9da450c2-8289-48d4-8659-9ba30e090f35",
            "title": "Lab",
            "due_date": "2026-02-27T00:00:00",
            "completed": false
          },
          {
            "id": "d1a59abd-3956-4961-97e3-19138728d453",
            "title": "Lab",
            "due_date": "2026-01-22T00:00:00",
            "completed": false
          },
          {
            "id": "5cb98407-bed4-4308-b789-83af8cba1255",
            "title": "Paper",
            "due_date": "2026-01-20T00:00:00",
            "completed": false
          },
          {
            "id": "02c5affe-da59-4160-8e11-c89f12499983",
            "title": "Reading",
            "due_date": "2026-01-25T00:00:00",
            "completed": false
          },
          {
            "id": "76471558-2cda-4423-9a60-79fcb10ba9f8",
            "title": "Final",
            "due_date": "2026-02-10T00:00:00",
            "completed": false
          },
          {
            "id": "1e213788-51f9-4962-8a7b-7481161258f8",
            "title": "Homework",
            "due_date": "2026-04-03T00:00:00",
            "completed": false
          },
          {
            "id": "af817cab-c4f8-4ba2-b9d2-0357211b1e6f",
            "title": "Paper",
            "due_date": "2026-03-23T00:00:00",
            "completed": false
          },
          {
            "id": "cda24ccc-e41b-43f5-93ba-0507dedbd776",
            "title": "Exam",
            "due_date": "2026-04-14T00:00:00",
            "completed": false
          },
          {
            "id": "3921db6e-f0ef-432d-964e-71744f846e36",
            "title": "Discussion",
            "due_date": "2026-01-27T00:00:00",
            "completed": false
          },
          {
            "id": "dd3288bc-4bd6-49d7-8497-dbfbd52920bd",
            "title": "Presentation",
            "due_date": "2026-04-04T00:00:00",
            "completed": false
          },
          {
            "id": "015e59b5-3e48-4fea-9784-ac4bcfededf3",
            "title": "Exam",
            "due_date": "2026-02-05T00:00:00",
            "completed": false
          },
          {
            "id": "d59ddca7-a63e-4c4b-a42c-e6d11a55e3e3",
            "title": "Exam",
            "due_date": "2026-04-23T00:00:00",
            "completed": false
          },
          {
            "id": "91ea677d-013c-44af-8e7c-503b13fb7a4b",
            "title": "Discussion",
            "due_date": "2026-01-13T00:00:00",
            "completed": false
          },
          {
            "id": "244d29ed-4c5a-430c-9e6e-aca40425310f",
            "title": "Presentation",
            "due_date": "2026-04-10T00:00:00",
            "completed": false
          },
          {
            "id": "8a692ac1-8d6f-4504-8ceb-092cdb04c10f",
            "title": "Presentation",
            "due_date": "2026-01-08T00:00:00",
            "completed": false
          },
          {
            "id": "d109fdc2-f821-462c-9373-46761bdc835a",
            "title": "Lab",
            "due_date": "2026-02-09T00:00:00",
            "completed": false
          },
          {
            "id": "ff69ce7e-ba8c-459b-9b7f-31b65306a27a",
            "title": "Quiz",
            "due_date": "2026-04-08T00:00:00",
            "completed": false
          },
          {
            "id": "352fe984-3224-45ce-990c-d5a224758b07",
            "title": "Essay",
            "due_date": "2026-04-10T00:00:00",
            "completed": false
          },
          {
            "id": "b1dcf419-ec44-4d9e-a811-65dd80869852",
            "title": "Presentation",
            "due_date": "2026-01-30T00:00:00",
            "completed": false
          },
          {
            "id": "9c0d278d-9bea-4ca9-9321-ca9ac3c06182",
            "title": "Exam",
            "due_date": "2026-01-15T00:00:00",
            "completed": false
          },
          {
            "id": "5873ca86-cccd-417c-b896-80a14b4c7d57",
            "title": "Test",
            "due_date": "2026-04-23T00:00:00",
            "completed": false
          },
          {
            "id": "4bb74afa-a459-4b57-993c-df4ad7cedfe9",
            "title": "Exam",
            "due_date": "2026-02-06T00:00:00",
            "completed": false
          },
          {
            "id": "79e071f8-b520-4027-9281-509c88e392aa",
            "title": "Final",
            "due_date": "2026-04-22T00:00:00",
            "completed": false
          },
          {
            "id": "99822890-9720-4c9e-8f99-dfb49bd2d372",
            "title": "Homework",
            "due_date": "2026-04-23T00:00:00",
            "completed": false
          },
          {
            "id": "046fa210-6ff5-4e1a-a9dc-1aaed37ffb8b",
            "title": "Lab",
            "due_date": "2026-01-10T00:00:00",
            "completed": false
          },
          {
            "id": "a252d790-91d5-43cf-8fc3-0ac31a72bbd6",
            "title": "Project",
            "due_date": "2026-04-21T00:00:00",
            "completed": false
          },
          {
            "id": "7b6d3171-55a4-49f1-a277-9540c4f3230c",
            "title": "Quiz",
            "due_date": "2026-01-06T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "31b475c0-cedd-4a42-9337-f7d7f8bf37cc",
        "grade": 90.59
      },
      {
        "id": "2d08645c-8afb-4838-8879-129e4f4c33f1",
        "title": "Faculty-Mentored Undergraduate Research III",
        "credit_hours": 1,
        "short_id": "MATH 4980R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, synthesize, and interpret data and to present results in writing and other relevant communication formats.",
        "assignments": [
          {
            "id": "cf712096-46f8-4d67-86d8-e1deb3064ad4",
            "title": "Quiz",
            "due_date": "2026-06-21T00:00:00",
            "completed": false
          },
          {
            "id": "ff7e4676-bcb9-44b8-9d67-28cf8ae935c3",
            "title": "Test",
            "due_date": "2026-06-25T00:00:00",
            "completed": false
          },
          {
            "id": "a719fd00-5030-4d50-8988-6942b48ace36",
            "title": "Presentation",
            "due_date": "2026-07-09T00:00:00",
            "completed": false
          },
          {
            "id": "f2f27f30-e606-4c93-b156-9b1fab68bea8",
            "title": "Discussion",
            "due_date": "2026-07-19T00:00:00",
            "completed": false
          },
          {
            "id": "2ac50723-cf36-485a-bcb9-82dd0688e5a4",
            "title": "Discussion",
            "due_date": "2026-07-11T00:00:00",
            "completed": false
          },
          {
            "id": "2c997bb3-5fc9-4edd-86e8-733acaf7a799",
            "title": "Exam",
            "due_date": "2026-06-16T00:00:00",
            "completed": false
          },
          {
            "id": "955e5304-baab-4c4a-bd1b-f62c6193f686",
            "title": "Lab",
            "due_date": "2026-06-08T00:00:00",
            "completed": false
          },
          {
            "id": "8e7c5f8a-0ee9-4f15-a52e-e73a160fe3be",
            "title": "Exam",
            "due_date": "2026-07-02T00:00:00",
            "completed": false
          },
          {
            "id": "b0366f83-3018-4f0f-abec-fabddd04635f",
            "title": "Reading",
            "due_date": "2026-06-14T00:00:00",
            "completed": false
          },
          {
            "id": "ae59a981-68b1-4dc5-83c4-92b2debd811a",
            "title": "Exam",
            "due_date": "2026-06-07T00:00:00",
            "completed": false
          },
          {
            "id": "8de5cb9f-ec2c-4bae-9abc-f5000faf664c",
            "title": "Homework",
            "due_date": "2026-06-21T00:00:00",
            "completed": false
          },
          {
            "id": "38759956-3040-4122-b56d-3f26aa945ca7",
            "title": "Final",
            "due_date": "2026-06-08T00:00:00",
            "completed": false
          },
          {
            "id": "bf72e0e4-02bf-48cb-bb68-f429c2f03927",
            "title": "Final",
            "due_date": "2026-06-19T00:00:00",
            "completed": false
          },
          {
            "id": "6fad9664-e92d-4fe9-bcdb-077c1d150136",
            "title": "Reading",
            "due_date": "2026-07-19T00:00:00",
            "completed": false
          },
          {
            "id": "7d96a60a-77da-40d1-a333-f3d2319f9059",
            "title": "Lab",
            "due_date": "2026-06-29T00:00:00",
            "completed": false
          },
          {
            "id": "1ef33447-dcb6-4f9b-8372-5cf906a1ddd0",
            "title": "Discussion",
            "due_date": "2026-07-06T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "56f07187-7491-4e57-9af8-f92381c730ee",
        "grade": 96.74
      },
      {
        "id": "e5ec7dbc-3819-43c0-8ee7-54bd5ec0a83f",
        "title": "Faculty-Mentored Undergraduate Research III",
        "credit_hours": 1,
        "short_id": "LATN 4980R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, synthesize, and interpret data and to present results in writing and other relevant communication formats.",
        "assignments": [
          {
            "id": "c4610594-cdd3-4033-83a0-70e0716d660f",
            "title": "Project",
            "due_date": "2026-09-07T00:00:00",
            "completed": false
          },
          {
            "id": "53bffde8-e466-4f3c-b82c-7b059e4af96a",
            "title": "Presentation",
            "due_date": "2026-08-07T00:00:00",
            "completed": false
          },
          {
            "id": "39074e49-e609-41fe-a81f-24ddf8f89e44",
            "title": "Discussion",
            "due_date": "2026-09-26T00:00:00",
            "completed": false
          },
          {
            "id": "9b889d90-7e0a-4de1-b425-f916d695e71b",
            "title": "Final",
            "due_date": "2026-08-21T00:00:00",
            "completed": false
          },
          {
            "id": "7da976a5-96bd-416e-8d37-041bc8c8a3cf",
            "title": "Homework",
            "due_date": "2026-11-07T00:00:00",
            "completed": false
          },
          {
            "id": "5a5d0b93-e8fb-44b8-97ee-8aaa9df2a88b",
            "title": "Exam",
            "due_date": "2026-09-26T00:00:00",
            "completed": false
          },
          {
            "id": "595f2f59-9371-438d-afe8-7a1419b65d43",
            "title": "Presentation",
            "due_date": "2026-08-12T00:00:00",
            "completed": false
          },
          {
            "id": "97c22d94-c17d-42a4-b209-1448f2fd2bc2",
            "title": "Final",
            "due_date": "2026-08-22T00:00:00",
            "completed": false
          },
          {
            "id": "0bbeef95-a997-40c5-952a-deb26a26a00b",
            "title": "Quiz",
            "due_date": "2026-10-16T00:00:00",
            "completed": false
          },
          {
            "id": "7c8b481a-b1c6-41d1-99fb-1d724919824f",
            "title": "Paper",
            "due_date": "2026-10-14T00:00:00",
            "completed": false
          },
          {
            "id": "b479e0f5-8e54-4099-9eb3-6790197b5574",
            "title": "Test",
            "due_date": "2026-10-22T00:00:00",
            "completed": false
          },
          {
            "id": "a35302af-d5e9-4c46-9629-935834c8c835",
            "title": "Quiz",
            "due_date": "2026-09-27T00:00:00",
            "completed": false
          },
          {
            "id": "9438930a-2996-4166-b085-692ecff4d6f6",
            "title": "Presentation",
            "due_date": "2026-10-15T00:00:00",
            "completed": false
          },
          {
            "id": "a1d6e04f-6bd5-496a-927f-8fbc613cb786",
            "title": "Paper",
            "due_date": "2026-09-15T00:00:00",
            "completed": false
          },
          {
            "id": "ec62968d-53e7-40d3-997b-ecfde9c6c4db",
            "title": "Paper",
            "due_date": "2026-08-22T00:00:00",
            "completed": false
          },
          {
            "id": "62519221-f146-4cda-a7e1-7869f9600526",
            "title": "Discussion",
            "due_date": "2026-10-25T00:00:00",
            "completed": false
          },
          {
            "id": "41b56e9f-8e35-4115-a600-efcac667d1ae",
            "title": "Test",
            "due_date": "2026-10-19T00:00:00",
            "completed": false
          },
          {
            "id": "8f8846bc-6fc2-44e0-84fa-99643bef0f28",
            "title": "Paper",
            "due_date": "2026-10-24T00:00:00",
            "completed": false
          },
          {
            "id": "7050bc61-917d-4e08-b73c-8a4cf5b1c297",
            "title": "Lab",
            "due_date": "2026-10-12T00:00:00",
            "completed": false
          },
          {
            "id": "353655cc-926d-4983-b8c3-767063621410",
            "title": "Discussion",
            "due_date": "2026-10-22T00:00:00",
            "completed": false
          },
          {
            "id": "037163e6-ed8e-4f13-aa18-7e0b4f9d2027",
            "title": "Homework",
            "due_date": "2026-10-04T00:00:00",
            "completed": false
          },
          {
            "id": "35b7b05a-3003-45e3-979e-248d59da0cf7",
            "title": "Project",
            "due_date": "2026-09-17T00:00:00",
            "completed": false
          },
          {
            "id": "a298d079-4096-485c-b01f-d79579119ff0",
            "title": "Presentation",
            "due_date": "2026-10-28T00:00:00",
            "completed": false
          },
          {
            "id": "c3b6bcad-84e0-4604-9ba4-d9d45d91c270",
            "title": "Discussion",
            "due_date": "2026-11-23T00:00:00",
            "completed": false
          },
          {
            "id": "43f33520-f61d-4e17-977d-a038580ba06c",
            "title": "Discussion",
            "due_date": "2026-08-26T00:00:00",
            "completed": false
          },
          {
            "id": "5bb20fb0-83ac-4676-b7b1-7da3736eb81f",
            "title": "Reading",
            "due_date": "2026-10-07T00:00:00",
            "completed": false
          },
          {
            "id": "c99cbb3e-fd0b-4c1c-a269-a435692b61cf",
            "title": "Presentation",
            "due_date": "2026-10-24T00:00:00",
            "completed": false
          },
          {
            "id": "1799ee61-0b30-4f28-aabd-7dcae16e68cd",
            "title": "Presentation",
            "due_date": "2026-11-22T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "4c866a6d-5de6-4710-9583-f2d761e0eb47",
        "grade": 96.21
      },
      {
        "id": "fc4b4257-cb07-407b-b12a-0cb543a2c251",
        "title": "Faculty-Mentored Undergraduate Research III",
        "credit_hours": 1,
        "short_id": "CSCI 4980R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, synthesize, and interpret data and to present results in writing and other relevant communication formats.",
        "assignments": [
          {
            "id": "8b3b5661-cb9d-44e8-ad8d-eb707df6c43d",
            "title": "Discussion",
            "due_date": "2026-10-21T00:00:00",
            "completed": false
          },
          {
            "id": "fd0afc5b-5b3a-42af-a7f7-63e19f602c8e",
            "title": "Test",
            "due_date": "2026-09-21T00:00:00",
            "completed": false
          },
          {
            "id": "349bd939-e378-4ba1-9d34-25be1b47ba8f",
            "title": "Exam",
            "due_date": "2026-09-08T00:00:00",
            "completed": false
          },
          {
            "id": "36114199-a6df-4fc1-929a-17f1fa6f485b",
            "title": "Final",
            "due_date": "2026-09-28T00:00:00",
            "completed": false
          },
          {
            "id": "aa0515e6-15a9-4c27-8977-ae2aaf50e146",
            "title": "Presentation",
            "due_date": "2026-10-27T00:00:00",
            "completed": false
          },
          {
            "id": "dc6b9219-c57f-49c5-8a04-7f04607578f1",
            "title": "Project",
            "due_date": "2026-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "d375536e-3e04-4724-8ed9-b063bed840e3",
            "title": "Reading",
            "due_date": "2026-10-07T00:00:00",
            "completed": false
          },
          {
            "id": "ab123664-733a-43bc-a513-a06b9b480cf5",
            "title": "Quiz",
            "due_date": "2026-09-10T00:00:00",
            "completed": false
          },
          {
            "id": "fdfd353a-19c2-484c-a666-7d387718ea4c",
            "title": "Project",
            "due_date": "2026-11-19T00:00:00",
            "completed": false
          },
          {
            "id": "9c4bcc25-1b9b-4655-a907-2d18e0dd9b73",
            "title": "Exam",
            "due_date": "2026-10-28T00:00:00",
            "completed": false
          },
          {
            "id": "00bbe327-100a-495f-a383-41c8442664af",
            "title": "Paper",
            "due_date": "2026-08-31T00:00:00",
            "completed": false
          },
          {
            "id": "d9cf5267-1b24-421b-bcec-87ccd9641143",
            "title": "Quiz",
            "due_date": "2026-10-29T00:00:00",
            "completed": false
          },
          {
            "id": "c12005fd-5903-43f6-9613-d17a880ce01f",
            "title": "Quiz",
            "due_date": "2026-09-17T00:00:00",
            "completed": false
          },
          {
            "id": "9a068080-cd6c-472a-a036-59c560889e64",
            "title": "Test",
            "due_date": "2026-11-11T00:00:00",
            "completed": false
          },
          {
            "id": "8d0fe13b-19b2-4529-8a9a-b51f6e4cff14",
            "title": "Homework",
            "due_date": "2026-09-24T00:00:00",
            "completed": false
          },
          {
            "id": "43e7439a-9726-4127-a3d2-f75e5f5fa6e8",
            "title": "Exam",
            "due_date": "2026-10-27T00:00:00",
            "completed": false
          },
          {
            "id": "9cb8a429-c16f-4c5b-944c-c9976e89141c",
            "title": "Presentation",
            "due_date": "2026-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "3e000036-31fb-43a8-b210-dbe92ebdde07",
            "title": "Quiz",
            "due_date": "2026-11-05T00:00:00",
            "completed": false
          },
          {
            "id": "0d6db836-ac84-4822-859c-f5f7792c5d5f",
            "title": "Lab",
            "due_date": "2026-08-23T00:00:00",
            "completed": false
          },
          {
            "id": "cc670bf3-03f5-4f0e-8b2e-3c27c72f8558",
            "title": "Essay",
            "due_date": "2026-09-13T00:00:00",
            "completed": false
          },
          {
            "id": "a268d747-fab5-4a4f-8463-21b5c7ac2998",
            "title": "Final",
            "due_date": "2026-09-19T00:00:00",
            "completed": false
          },
          {
            "id": "80126c15-0359-4391-94f3-d11aa97b8404",
            "title": "Project",
            "due_date": "2026-11-06T00:00:00",
            "completed": false
          },
          {
            "id": "462b6cc4-358c-4c3e-a599-dae05838545c",
            "title": "Reading",
            "due_date": "2026-10-01T00:00:00",
            "completed": false
          },
          {
            "id": "1dcb1481-8e54-4384-b22d-e3171a33d35f",
            "title": "Exam",
            "due_date": "2026-08-12T00:00:00",
            "completed": false
          },
          {
            "id": "536361c2-88c4-42d8-bf4c-e853a8a55cca",
            "title": "Exam",
            "due_date": "2026-10-08T00:00:00",
            "completed": false
          },
          {
            "id": "c76b942f-0bfd-4020-b5e4-5d093e32922e",
            "title": "Quiz",
            "due_date": "2026-10-24T00:00:00",
            "completed": false
          },
          {
            "id": "87e4bbed-2d20-4863-9a0a-56e59dea4cd4",
            "title": "Essay",
            "due_date": "2026-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "f0dacb25-ba28-49db-9554-112ed29696b7",
            "title": "Project",
            "due_date": "2026-10-05T00:00:00",
            "completed": false
          },
          {
            "id": "6e1305b6-7223-4d58-8d64-38881cd0ae00",
            "title": "Final",
            "due_date": "2026-08-28T00:00:00",
            "completed": false
          },
          {
            "id": "ae8ace58-568e-432a-8eb1-df6aad408401",
            "title": "Exam",
            "due_date": "2026-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "6678d4fe-3c41-41f0-8d2b-f0dfdc4c4439",
            "title": "Presentation",
            "due_date": "2026-08-20T00:00:00",
            "completed": false
          },
          {
            "id": "d37ff4f4-19e3-421f-aae5-a784187221a6",
            "title": "Reading",
            "due_date": "2026-10-02T00:00:00",
            "completed": false
          },
          {
            "id": "c7cf4c27-9295-43d9-9856-a457a23deac4",
            "title": "Quiz",
            "due_date": "2026-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "e939d48a-5812-49d5-9e3a-a37f9ba25ead",
            "title": "Project",
            "due_date": "2026-08-24T00:00:00",
            "completed": false
          },
          {
            "id": "e200d88d-b616-4536-a897-a46213c56b30",
            "title": "Project",
            "due_date": "2026-10-22T00:00:00",
            "completed": false
          },
          {
            "id": "1532bd0b-9583-48ec-9dab-9be6907e7224",
            "title": "Reading",
            "due_date": "2026-11-21T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "4c866a6d-5de6-4710-9583-f2d761e0eb47",
        "grade": 90.25
      },
      {
        "id": "c98cb907-3d1e-4ace-bb6c-4260ec2eec1f",
        "title": "Undergraduate Research Thesis (or Final Project)",
        "credit_hours": 1,
        "short_id": "MATH 4990R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, and synthesize and interpret data. Students will write or produce a thesis or other professional capstone product, such as a report or portfolio that describes their systematic and in-depth inquiry.",
        "assignments": [
          {
            "id": "a156aef6-a7df-4029-ba50-e4c523e6cff7",
            "title": "Lab",
            "due_date": "2026-10-01T00:00:00",
            "completed": false
          },
          {
            "id": "e1ab0898-3fe8-408c-9b9a-4ac9ed5f0fcf",
            "title": "Final",
            "due_date": "2026-10-23T00:00:00",
            "completed": false
          },
          {
            "id": "13410c2b-2da2-45a1-9e7a-16848646d31d",
            "title": "Exam",
            "due_date": "2026-09-03T00:00:00",
            "completed": false
          },
          {
            "id": "94cdc59c-de7e-4c61-9456-4cc20c2dd175",
            "title": "Lab",
            "due_date": "2026-10-19T00:00:00",
            "completed": false
          },
          {
            "id": "5b92acfc-22a8-4927-8082-75c12091b0ad",
            "title": "Project",
            "due_date": "2026-09-02T00:00:00",
            "completed": false
          },
          {
            "id": "fdca4216-71e7-4231-8ecf-3d9ea0c8184f",
            "title": "Lab",
            "due_date": "2026-10-03T00:00:00",
            "completed": false
          },
          {
            "id": "6966b893-c8c2-4641-beda-413e7b050cc4",
            "title": "Project",
            "due_date": "2026-09-18T00:00:00",
            "completed": false
          },
          {
            "id": "ff1d9859-afd0-4741-b4f7-79f4516c8212",
            "title": "Exam",
            "due_date": "2026-10-30T00:00:00",
            "completed": false
          },
          {
            "id": "00f06620-49ca-43e1-9676-2e7aa55ea7ee",
            "title": "Exam",
            "due_date": "2026-10-20T00:00:00",
            "completed": false
          },
          {
            "id": "90b3b566-a342-42a5-b2a8-620594bbde2d",
            "title": "Test",
            "due_date": "2026-09-29T00:00:00",
            "completed": false
          },
          {
            "id": "08f87a8f-816e-45f5-96fb-ab9a65d12280",
            "title": "Test",
            "due_date": "2026-10-13T00:00:00",
            "completed": false
          },
          {
            "id": "28e7ed96-2bf0-4f76-b179-3dfdb520da35",
            "title": "Exam",
            "due_date": "2026-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "05b2e8a0-d21e-4f8e-9d1c-c23a92f67e81",
            "title": "Final",
            "due_date": "2026-08-15T00:00:00",
            "completed": false
          },
          {
            "id": "d4ae247a-3331-49e0-8fb4-a35a64fccd6e",
            "title": "Final",
            "due_date": "2026-10-28T00:00:00",
            "completed": false
          },
          {
            "id": "78927495-5158-4a41-a710-3adcb43b8cf1",
            "title": "Homework",
            "due_date": "2026-09-19T00:00:00",
            "completed": false
          },
          {
            "id": "030310cc-6d78-48c5-a434-8245498965ab",
            "title": "Reading",
            "due_date": "2026-11-17T00:00:00",
            "completed": false
          },
          {
            "id": "d21c974f-8695-4328-ae7c-3e333694c291",
            "title": "Exam",
            "due_date": "2026-10-23T00:00:00",
            "completed": false
          },
          {
            "id": "d9d8e1b1-7005-4fa6-89ea-9ae6f40a478f",
            "title": "Lab",
            "due_date": "2026-10-06T00:00:00",
            "completed": false
          },
          {
            "id": "9dd5662f-bb4d-47a6-9726-1f37cac98f17",
            "title": "Lab",
            "due_date": "2026-08-24T00:00:00",
            "completed": false
          },
          {
            "id": "9e50a475-e82a-473c-beee-74101ed0e1f5",
            "title": "Essay",
            "due_date": "2026-09-07T00:00:00",
            "completed": false
          },
          {
            "id": "b6e06ac4-515d-497d-bd5b-600b6a9fa81f",
            "title": "Quiz",
            "due_date": "2026-08-16T00:00:00",
            "completed": false
          },
          {
            "id": "999f1fcf-08ca-4ef8-b35f-fafee1590621",
            "title": "Reading",
            "due_date": "2026-11-20T00:00:00",
            "completed": false
          },
          {
            "id": "9a16f90b-b160-4b03-bbb9-13d8ab742d26",
            "title": "Test",
            "due_date": "2026-08-15T00:00:00",
            "completed": false
          },
          {
            "id": "1ca765c2-d2c2-4831-887a-39acdaaab4a3",
            "title": "Lab",
            "due_date": "2026-08-15T00:00:00",
            "completed": false
          },
          {
            "id": "e8be56f8-cef6-4a60-b2ad-94e3ecdb7f42",
            "title": "Essay",
            "due_date": "2026-09-23T00:00:00",
            "completed": false
          },
          {
            "id": "97d1d83d-74ed-4542-b4e4-dec3074015e3",
            "title": "Essay",
            "due_date": "2026-10-11T00:00:00",
            "completed": false
          },
          {
            "id": "a991cc7e-536f-42d8-a359-935bdcaac9a0",
            "title": "Test",
            "due_date": "2026-08-27T00:00:00",
            "completed": false
          },
          {
            "id": "db9030cf-490f-4e3e-8829-6e2b561f1cb1",
            "title": "Test",
            "due_date": "2026-08-28T00:00:00",
            "completed": false
          },
          {
            "id": "18852208-008d-46c0-abf0-a8f30f312900",
            "title": "Paper",
            "due_date": "2026-10-04T00:00:00",
            "completed": false
          },
          {
            "id": "9695be5e-f3e4-467d-a847-5c4dce03dc2c",
            "title": "Essay",
            "due_date": "2026-11-13T00:00:00",
            "completed": false
          },
          {
            "id": "8627e7dc-87c3-487e-a244-12dd9418a754",
            "title": "Presentation",
            "due_date": "2026-09-11T00:00:00",
            "completed": false
          },
          {
            "id": "e71936fe-14a6-4c1d-9209-456243959421",
            "title": "Essay",
            "due_date": "2026-11-09T00:00:00",
            "completed": false
          },
          {
            "id": "b1415b27-324f-44ab-8c4d-15d7724083d5",
            "title": "Quiz",
            "due_date": "2026-08-06T00:00:00",
            "completed": false
          },
          {
            "id": "a34649d9-00e3-4b59-a127-ea81057761aa",
            "title": "Essay",
            "due_date": "2026-09-07T00:00:00",
            "completed": false
          },
          {
            "id": "8b616b01-aa51-4364-b64d-78d2f06d2476",
            "title": "Test",
            "due_date": "2026-10-02T00:00:00",
            "completed": false
          },
          {
            "id": "8518a2d6-cd23-4967-8bfc-6be406a128fa",
            "title": "Lab",
            "due_date": "2026-09-12T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "4c866a6d-5de6-4710-9583-f2d761e0eb47",
        "grade": 97.72
      },
      {
        "id": "2a007c72-480c-4db5-a7a8-f653cc4a5fd2",
        "title": "Undergraduate Research Thesis (or Final Project)",
        "credit_hours": 1,
        "short_id": "LATN 4990R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, synthesize, and interpret data. Students will write or produce a thesis or other professional capstone product, such as a report or portfolio that describes their systematic and in-depth inquiry.",
        "assignments": [
          {
            "id": "db76516a-17bd-44a0-abfe-9ba01b503702",
            "title": "Presentation",
            "due_date": "2026-09-26T00:00:00",
            "completed": false
          },
          {
            "id": "e6c37b82-60fa-44a0-9dea-589cde4c88c8",
            "title": "Reading",
            "due_date": "2026-10-23T00:00:00",
            "completed": false
          },
          {
            "id": "23101f3e-aa10-4345-8873-79c261777785",
            "title": "Quiz",
            "due_date": "2026-08-07T00:00:00",
            "completed": false
          },
          {
            "id": "dda390fa-1508-4b07-952c-2868017b7d26",
            "title": "Test",
            "due_date": "2026-08-22T00:00:00",
            "completed": false
          },
          {
            "id": "a8485e62-7c3b-4ca4-87d7-ce769a1ddef2",
            "title": "Reading",
            "due_date": "2026-09-08T00:00:00",
            "completed": false
          },
          {
            "id": "a72404cf-a89b-4621-8735-fbc63a5e5c5a",
            "title": "Homework",
            "due_date": "2026-08-24T00:00:00",
            "completed": false
          },
          {
            "id": "79cda8bb-e2f4-4ad3-bb3f-ca4b05d27a00",
            "title": "Quiz",
            "due_date": "2026-11-09T00:00:00",
            "completed": false
          },
          {
            "id": "a3bf180b-5d73-4062-a97a-b1b380e05101",
            "title": "Exam",
            "due_date": "2026-11-05T00:00:00",
            "completed": false
          },
          {
            "id": "4e5e7a49-4708-44dc-a674-c3a7915f5977",
            "title": "Exam",
            "due_date": "2026-09-03T00:00:00",
            "completed": false
          },
          {
            "id": "03361300-5a9b-42a9-acaa-9b14c9b2bde5",
            "title": "Lab",
            "due_date": "2026-11-23T00:00:00",
            "completed": false
          },
          {
            "id": "0f844b5a-ccff-419c-968a-b38dcf8e70a3",
            "title": "Reading",
            "due_date": "2026-09-02T00:00:00",
            "completed": false
          },
          {
            "id": "5becb0b4-78bc-4a3e-a40a-2385751a36d8",
            "title": "Quiz",
            "due_date": "2026-08-23T00:00:00",
            "completed": false
          },
          {
            "id": "7225d6b2-1130-4023-a517-1d37526688ff",
            "title": "Homework",
            "due_date": "2026-11-14T00:00:00",
            "completed": false
          },
          {
            "id": "37d349f9-694c-4aa5-a837-04f4be3a36f6",
            "title": "Presentation",
            "due_date": "2026-09-17T00:00:00",
            "completed": false
          },
          {
            "id": "4cd838f2-91bc-494b-846f-31aff88566ce",
            "title": "Project",
            "due_date": "2026-11-04T00:00:00",
            "completed": false
          },
          {
            "id": "88dc4e22-6889-4d56-8149-b471a314f2d5",
            "title": "Lab",
            "due_date": "2026-09-06T00:00:00",
            "completed": false
          },
          {
            "id": "7bab3349-bdeb-493e-a036-03c67111ee7b",
            "title": "Essay",
            "due_date": "2026-08-31T00:00:00",
            "completed": false
          },
          {
            "id": "a36ec74d-0a7f-4be5-88b1-82f0a4236d9f",
            "title": "Quiz",
            "due_date": "2026-09-11T00:00:00",
            "completed": false
          },
          {
            "id": "820d8990-e26a-4ac6-8c30-6d64e211fac3",
            "title": "Essay",
            "due_date": "2026-09-04T00:00:00",
            "completed": false
          },
          {
            "id": "0d87b2f2-8acd-4c10-a349-d6d504070475",
            "title": "Reading",
            "due_date": "2026-11-06T00:00:00",
            "completed": false
          },
          {
            "id": "91c573bd-cfbb-434a-96f8-ed679fe16b65",
            "title": "Lab",
            "due_date": "2026-09-11T00:00:00",
            "completed": false
          },
          {
            "id": "5fc4b49b-2688-46b4-affc-f69eadc66429",
            "title": "Discussion",
            "due_date": "2026-10-22T00:00:00",
            "completed": false
          },
          {
            "id": "2d1f4411-b13f-449e-8b67-2b8c46f62801",
            "title": "Exam",
            "due_date": "2026-09-08T00:00:00",
            "completed": false
          },
          {
            "id": "3ce5d472-c72a-42d8-832e-b16b3c412d74",
            "title": "Reading",
            "due_date": "2026-10-17T00:00:00",
            "completed": false
          },
          {
            "id": "92c2c2d1-c7bd-4a1c-ac12-7e61f8019ff4",
            "title": "Project",
            "due_date": "2026-08-26T00:00:00",
            "completed": false
          },
          {
            "id": "abdd73b8-05a2-4c49-a643-112b2a0bd0e4",
            "title": "Project",
            "due_date": "2026-08-07T00:00:00",
            "completed": false
          },
          {
            "id": "00fcc338-61a1-423b-a2fe-3963ab53430b",
            "title": "Exam",
            "due_date": "2026-10-09T00:00:00",
            "completed": false
          },
          {
            "id": "0173bb4a-285b-47a0-9776-e4a00bd7e7d3",
            "title": "Exam",
            "due_date": "2026-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "8e057bc2-9e38-47bf-9dc4-0cb4302d9ad0",
            "title": "Test",
            "due_date": "2026-08-27T00:00:00",
            "completed": false
          },
          {
            "id": "ddc5d78d-f86f-4c17-a68c-d4f3ddc49990",
            "title": "Final",
            "due_date": "2026-09-02T00:00:00",
            "completed": false
          },
          {
            "id": "d980a1e8-8efb-44db-968c-f567f0315c7e",
            "title": "Homework",
            "due_date": "2026-10-25T00:00:00",
            "completed": false
          },
          {
            "id": "31095427-d39e-4b7e-bee9-a13960c12f99",
            "title": "Quiz",
            "due_date": "2026-08-24T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "4c866a6d-5de6-4710-9583-f2d761e0eb47",
        "grade": 94.32
      },
      {
        "id": "bff1365e-c51b-42f3-9e7c-a7d1016c0bd8",
        "title": "Data Science Capstone Course",
        "credit_hours": 3,
        "short_id": "STAT(CSCI) 4990",
        "description": "Provides an exposure to advanced methods and technologies in data science, including data acquisition, data quality, big data management and analytics, data mining, data security and privacy, and introduces the students to data science experience with a real-world problem. In addition, effective oral and written communication of technologies, methods, and results are emphasized.",
        "assignments": [
          {
            "id": "54c3192b-9640-4b01-a63e-79ced0edf92c",
            "title": "Presentation",
            "due_date": "2026-09-15T00:00:00",
            "completed": false
          },
          {
            "id": "1918e491-068a-4d09-83d2-f9565daced31",
            "title": "Test",
            "due_date": "2026-10-24T00:00:00",
            "completed": false
          },
          {
            "id": "86f0035c-f889-49a6-b505-6135b5311054",
            "title": "Final",
            "due_date": "2026-10-22T00:00:00",
            "completed": false
          },
          {
            "id": "93deac14-732e-4c8f-a1a9-804fb0ea8e94",
            "title": "Test",
            "due_date": "2026-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "6ca6fd9f-129a-431f-8de2-76fce3a5baf2",
            "title": "Final",
            "due_date": "2026-09-05T00:00:00",
            "completed": false
          },
          {
            "id": "25009b0a-37b6-4ea1-ae26-511fd01a1823",
            "title": "Reading",
            "due_date": "2026-09-10T00:00:00",
            "completed": false
          },
          {
            "id": "4ff45eae-00e7-4bf8-9505-79739abff98a",
            "title": "Test",
            "due_date": "2026-11-12T00:00:00",
            "completed": false
          },
          {
            "id": "0844c5e9-2383-4e38-ac7b-e55a9f4108f6",
            "title": "Project",
            "due_date": "2026-08-21T00:00:00",
            "completed": false
          },
          {
            "id": "59204241-80d1-429e-82aa-deeb7cb0b192",
            "title": "Reading",
            "due_date": "2026-08-23T00:00:00",
            "completed": false
          },
          {
            "id": "4d79cf07-79b6-4953-a047-e9586556a332",
            "title": "Exam",
            "due_date": "2026-10-03T00:00:00",
            "completed": false
          },
          {
            "id": "2f96f591-3545-445a-bf6f-546e332a3dac",
            "title": "Homework",
            "due_date": "2026-11-05T00:00:00",
            "completed": false
          },
          {
            "id": "a7a3315e-74b6-4a42-8952-9a614ca260e5",
            "title": "Final",
            "due_date": "2026-08-13T00:00:00",
            "completed": false
          },
          {
            "id": "bb981c39-41ab-41cc-9cfc-2541ab30ee68",
            "title": "Presentation",
            "due_date": "2026-08-14T00:00:00",
            "completed": false
          },
          {
            "id": "29b58364-ccd5-4ba0-801d-0c96fb10faf1",
            "title": "Presentation",
            "due_date": "2026-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "8b76f1b8-95fd-4ef1-b23f-3e0ebfa98ccb",
            "title": "Paper",
            "due_date": "2026-08-25T00:00:00",
            "completed": false
          },
          {
            "id": "fcfdd993-89ef-4ee0-9439-f5d43ebe693e",
            "title": "Project",
            "due_date": "2026-09-09T00:00:00",
            "completed": false
          },
          {
            "id": "2c867cb2-0b73-4f71-a06b-3025ceeabdf8",
            "title": "Essay",
            "due_date": "2026-11-08T00:00:00",
            "completed": false
          },
          {
            "id": "fc8c1d6f-a890-400e-b9ec-5d039231896c",
            "title": "Project",
            "due_date": "2026-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "7727c99b-f594-4e82-af60-1f3c6496b4d2",
            "title": "Reading",
            "due_date": "2026-08-30T00:00:00",
            "completed": false
          },
          {
            "id": "e091ca18-e763-40e9-aadf-aa7c34ba9e3b",
            "title": "Essay",
            "due_date": "2026-10-15T00:00:00",
            "completed": false
          },
          {
            "id": "b582f8a0-b899-4c12-9684-625a501d0255",
            "title": "Homework",
            "due_date": "2026-09-22T00:00:00",
            "completed": false
          },
          {
            "id": "47199373-435d-4ca7-bbb3-b9dd9996bd40",
            "title": "Essay",
            "due_date": "2026-08-28T00:00:00",
            "completed": false
          },
          {
            "id": "188358ca-e863-4f7b-9104-8d720df15c42",
            "title": "Reading",
            "due_date": "2026-10-29T00:00:00",
            "completed": false
          },
          {
            "id": "8d373bc6-c779-48f0-929a-aea136d60fef",
            "title": "Presentation",
            "due_date": "2026-09-20T00:00:00",
            "completed": false
          },
          {
            "id": "f94ea0ef-a0c3-41eb-ac1a-5c002e10c1c8",
            "title": "Final",
            "due_date": "2026-09-13T00:00:00",
            "completed": false
          },
          {
            "id": "5131a96f-331d-4d54-a972-6ed726d7cd17",
            "title": "Homework",
            "due_date": "2026-11-02T00:00:00",
            "completed": false
          },
          {
            "id": "250d689b-5e03-4e39-8f3d-53b6f1e7cc99",
            "title": "Project",
            "due_date": "2026-10-19T00:00:00",
            "completed": false
          },
          {
            "id": "b27afb9c-301f-4499-bd43-663062f67429",
            "title": "Presentation",
            "due_date": "2026-09-14T00:00:00",
            "completed": false
          },
          {
            "id": "b59c72bb-8315-4d0f-a4dc-a579ddaa2d12",
            "title": "Discussion",
            "due_date": "2026-08-18T00:00:00",
            "completed": false
          },
          {
            "id": "d275a6b9-9b2a-4a36-a646-309c3607fec7",
            "title": "Exam",
            "due_date": "2026-11-11T00:00:00",
            "completed": false
          },
          {
            "id": "c9b76f8a-c04c-4488-951e-a32cd5a866d2",
            "title": "Project",
            "due_date": "2026-08-08T00:00:00",
            "completed": false
          },
          {
            "id": "b02c14cf-1213-467c-80cb-bbd79276cd78",
            "title": "Quiz",
            "due_date": "2026-08-15T00:00:00",
            "completed": false
          },
          {
            "id": "fed9cbaa-f6de-428e-bedd-f43f47825e02",
            "title": "Reading",
            "due_date": "2026-10-14T00:00:00",
            "completed": false
          },
          {
            "id": "2590048e-2455-49a7-89d0-224da9c6073d",
            "title": "Presentation",
            "due_date": "2026-11-21T00:00:00",
            "completed": false
          },
          {
            "id": "cac09048-4f6b-49c2-8b82-fdee320953db",
            "title": "Presentation",
            "due_date": "2026-08-30T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "4c866a6d-5de6-4710-9583-f2d761e0eb47",
        "grade": 91.24
      },
      {
        "id": "337aa21f-0182-45f6-a654-8068fbf7358d",
        "title": "Undergraduate Research Thesis (or Final Project)",
        "credit_hours": 1,
        "short_id": "CSCI 4990R",
        "description": "Faculty-supervised independent or collaborative inquiry into fundamental and applied problems within a discipline that requires students to gather, analyze, synthesize, and interpret data. Students will write or produce a thesis or other professional capstone product, such as a report or portfolio that describes their systematic and in-depth inquiry.",
        "assignments": [
          {
            "id": "d13ea57e-0714-4bf5-8bf4-7dd43ce4ee1a",
            "title": "Discussion",
            "due_date": "2026-09-08T00:00:00",
            "completed": false
          },
          {
            "id": "936175a5-f663-4cf0-9640-b71c1fdd962a",
            "title": "Homework",
            "due_date": "2026-08-19T00:00:00",
            "completed": false
          },
          {
            "id": "a3952cb1-f289-460e-ab2a-d446955dcea0",
            "title": "Paper",
            "due_date": "2026-09-26T00:00:00",
            "completed": false
          },
          {
            "id": "ba9a33ed-7ebc-478c-aaac-b28ccc61bdf0",
            "title": "Presentation",
            "due_date": "2026-09-08T00:00:00",
            "completed": false
          },
          {
            "id": "8f14e307-56df-4d06-a726-92a71f225afb",
            "title": "Quiz",
            "due_date": "2026-11-02T00:00:00",
            "completed": false
          },
          {
            "id": "3623a82f-ec44-46b0-874f-8b436eda321b",
            "title": "Lab",
            "due_date": "2026-09-09T00:00:00",
            "completed": false
          },
          {
            "id": "7f6c926f-477e-45f8-8ed9-3b155087a40f",
            "title": "Presentation",
            "due_date": "2026-08-31T00:00:00",
            "completed": false
          },
          {
            "id": "316eebbd-1628-4eee-af70-7eb80b7ea92c",
            "title": "Test",
            "due_date": "2026-11-14T00:00:00",
            "completed": false
          },
          {
            "id": "719ab583-c0ff-4ee1-9c3a-471f647cb7e2",
            "title": "Paper",
            "due_date": "2026-09-26T00:00:00",
            "completed": false
          },
          {
            "id": "0db4b4bd-49ec-4f36-8a1f-17439d52c765",
            "title": "Reading",
            "due_date": "2026-08-10T00:00:00",
            "completed": false
          },
          {
            "id": "3a432645-b741-432a-93ec-84446ae7f91c",
            "title": "Test",
            "due_date": "2026-11-05T00:00:00",
            "completed": false
          },
          {
            "id": "3733f8ac-b0a7-4ae2-b882-9918172963b2",
            "title": "Essay",
            "due_date": "2026-08-09T00:00:00",
            "completed": false
          },
          {
            "id": "c0b8bc0c-1ea9-4c46-acb4-07e747d0c29c",
            "title": "Test",
            "due_date": "2026-10-19T00:00:00",
            "completed": false
          },
          {
            "id": "02adfb1a-3256-4d22-a978-52fb02e4da21",
            "title": "Paper",
            "due_date": "2026-09-28T00:00:00",
            "completed": false
          },
          {
            "id": "4000db20-8657-4773-8e4f-c06063949342",
            "title": "Essay",
            "due_date": "2026-08-07T00:00:00",
            "completed": false
          },
          {
            "id": "c47dc380-56a9-4d84-92c4-8c757b32e48b",
            "title": "Test",
            "due_date": "2026-11-10T00:00:00",
            "completed": false
          },
          {
            "id": "6dbf3cf1-f96e-4966-852d-2622bfc98d89",
            "title": "Project",
            "due_date": "2026-10-01T00:00:00",
            "completed": false
          },
          {
            "id": "c6e22b6f-c20b-44f5-b8df-4673f43c5a5f",
            "title": "Homework",
            "due_date": "2026-08-19T00:00:00",
            "completed": false
          },
          {
            "id": "f3463f60-5f16-468e-a3ed-0933ea03d060",
            "title": "Test",
            "due_date": "2026-10-02T00:00:00",
            "completed": false
          },
          {
            "id": "e62ca67b-8fe5-42b3-b5dc-bfd59cbf4257",
            "title": "Essay",
            "due_date": "2026-09-11T00:00:00",
            "completed": false
          },
          {
            "id": "ee37a76f-4f84-46b6-b8ad-e4f895c37bd1",
            "title": "Essay",
            "due_date": "2026-08-29T00:00:00",
            "completed": false
          },
          {
            "id": "4e85de47-67ee-496c-99bd-2b61e28e104f",
            "title": "Project",
            "due_date": "2026-09-12T00:00:00",
            "completed": false
          },
          {
            "id": "253cc99a-419d-4b07-a64f-a99b395c3361",
            "title": "Paper",
            "due_date": "2026-08-28T00:00:00",
            "completed": false
          },
          {
            "id": "b2fc7f48-ccba-4606-a85b-6d352cb60f9f",
            "title": "Paper",
            "due_date": "2026-08-30T00:00:00",
            "completed": false
          },
          {
            "id": "5d78082f-d3d7-4da2-af2e-a10a9b47a346",
            "title": "Quiz",
            "due_date": "2026-09-20T00:00:00",
            "completed": false
          },
          {
            "id": "2232c9ac-e043-420c-b6d8-a35835042502",
            "title": "Final",
            "due_date": "2026-10-25T00:00:00",
            "completed": false
          },
          {
            "id": "b41044ef-31d2-4c25-b1f1-905954e55e77",
            "title": "Project",
            "due_date": "2026-09-12T00:00:00",
            "completed": false
          },
          {
            "id": "a800c2a7-160c-4cc0-99c0-896b5d7ca5d9",
            "title": "Lab",
            "due_date": "2026-09-21T00:00:00",
            "completed": false
          }
        ],
        "connected_semester_id": "4c866a6d-5de6-4710-9583-f2d761e0eb47",
        "grade": 96.98
      }
    ]
  }
}