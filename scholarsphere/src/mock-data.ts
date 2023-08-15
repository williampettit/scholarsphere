export interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  status: string;
}

export interface Course {
  id: number;
  shortId: string;
  semesterId?: number;
  title: string;
  description: string;
  credits: number;
  grade: number;
  status: string;
  assignments: Assignment[];
}

export interface Semester {
  id: number;
  season: string;
  year: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  semesters: Semester[];
  courses: Course[];
}

interface MockData {
  user: User;
}

export const MOCK_DATA: MockData = {
  user: {
    id: 0,
    firstName: "William",
    lastName: "Pettit",
    email: "wm@uga.edu",
    avatar: "https://avatars.githubusercontent.com/u/14142910?v=4",
    semesters: [
      {
        id: 0,
        season: "Fall",
        year: 2021,
      },
      {
        id: 1,
        season: "Spring",
        year: 2021,
      },
    ],
    courses: [
      {
        id: 0,
        shortId: "CSCI 1301",
        semesterId: 0,
        title: "Introduction to Computer Science Principles I",
        description: "Learn the basics of computer science",
        credits: 4,
        grade: 99.5125,
        status: "complete",
        assignments: [
          {
            id: 0,
            title: "Assignment 1",
            dueDate: "2023-03-16T00:00:00.000Z",
            status: "active",
          },
        ],
      },
      {
        id: 1,
        shortId: "CSCI 2720",
        title: "Data Structures",
        description: "Learn advanced topics of computer science",
        credits: 4,
        grade: 99.5125,
        status: "active",
        assignments: [
          {
            id: 0,
            title: "Assignment 1",
            dueDate: "2023-08-16T00:00:00.000Z",
            status: "active",
          },
          {
            id: 1,
            title: "Quiz 1",
            dueDate: "2023-08-25T00:00:00.000Z",
            status: "active",
          },
          {
            id: 2,
            title: "Quiz 2",
            dueDate: "2023-08-26T00:00:00.000Z",
            status: "active",
          },
          {
            id: 3,
            title: "Quiz 3",
            dueDate: "2023-08-27T00:00:00.000Z",
            status: "active",
          },
          {
            id: 4,
            title: "Test 1",
            dueDate: "2023-08-28T00:00:00.000Z",
            status: "active",
          },
          {
            id: 5,
            title: "Test 2",
            dueDate: "2023-08-29T00:00:00.000Z",
            status: "active",
          },
        ],
      },
      {
        id: 2,
        shortId: "MATH 2260",
        title: "Calculus II",
        description: "Learn advanced topics of calculus",
        credits: 4,
        grade: 96.5125,
        status: "active",
        assignments: [
          {
            id: 0,
            title: "Test 1",
            dueDate: "2023-08-17T00:00:00.000Z",
            status: "active",
          },
          {
            id: 1,
            title: "Discussion 1",
            dueDate: "2023-08-17T00:00:00.000Z",
            status: "active",
          },
          {
            id: 2,
            title: "Discussion 2",
            dueDate: "2023-08-18T00:00:00.000Z",
            status: "active",
          },
          {
            id: 3,
            title: "Discussion 3",
            dueDate: "2023-08-19T00:00:00.000Z",
            status: "active",
          },
          {
            id: 4,
            title: "Discussion 4",
            dueDate: "2023-08-20T00:00:00.000Z",
            status: "active",
          },
        ],
      },
      {
        id: 3,
        shortId: "CSCI 1302",
        title: "Introduction to Computer Science Principles II",
        description: "Learn the basics of computer science",
        credits: 4,
        grade: 50.123,
        status: "active",
        assignments: [
          {
            id: 0,
            title: "Assignment 1",
            dueDate: "2023-08-21T00:00:00.000Z",
            status: "active",
          },
        ],
      },
    ],
  },
};
