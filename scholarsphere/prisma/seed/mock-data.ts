export type CourseCreditsType =
  | 1 //
  | 2 //
  | 3 //
  | 4;

export type CourseFinalGpaType =
  | 0.0 //
  | 1.0 //
  | 2.0 //
  | 3.0 //
  | 4.0;

export interface CourseCatalogEntryProps {
  title: string;
  credits: CourseCreditsType;
}

export interface CourseCatalogProps {
  [key: string]: CourseCatalogEntryProps;
}

export type CourseShortIdType = keyof typeof MOCK_COURSE_CATALOG_DATA;

export interface SemesterProps {
  name: string;
  startDate: string;
  endDate: string;
  courses: {
    [key in CourseShortIdType]: CourseFinalGpaType;
  };
}

export interface MockUserDataProps {
  email: string;
  semesters: SemesterProps[];
}

export const MOCK_COURSE_CATALOG_DATA: CourseCatalogProps = {
  // Latin
  LATN1001: { credits: 4, title: "Elementary Latin I" },
  LATN1002: { credits: 4, title: "Elementary Latin II" },
  LATN2001: { credits: 3, title: "Intermediate Latin I" },

  // CS
  CSCI1301: { credits: 4, title: "Computer Science Principles I" },
  CSCI1302: { credits: 4, title: "Computer Science Principles II" },
  CSCI2510: { credits: 3, title: "Discrete Math" },
  CSCI2720: { credits: 3, title: "Data Structures" },
  CSCI2920: { credits: 3, title: "Computer Science Ethics" },
  CSCI1730: { credits: 3, title: "Systems Programming" },
  CSCI2670: { credits: 3, title: "Intro to Theory of Computing" },

  // Math
  MATH1111: { credits: 3, title: "Algebra" },
  MATH1113: { credits: 3, title: "Precalculus" },
  MATH2211: { credits: 4, title: "Calculus I" },
  MATH2212: { credits: 4, title: "Calculus II" },
  MATH3300: { credits: 3, title: "Applied Linear Algebra" },

  // Science
  ASTR1010: { credits: 3, title: "Astronomy" },
  ASTR1010L: { credits: 1, title: "Astronomy Lab" },
  ENVS1401: { credits: 3, title: "Environmental Science" },
  ENVS1401L: { credits: 1, title: "Environmental Science Lab" },

  // Psychology / Philosophy
  PSYC1101: { credits: 3, title: "Intro to Psychology" },
  PHIL1010: { credits: 2, title: "Intro to Philosophy" },

  // Music
  MUA1500: { credits: 3, title: "Influence/History of Jazz" },

  // Communications
  SCOM1000: { credits: 2, title: "Human Communications" },
  SCOM1500: { credits: 3, title: "Public Speaking" },
  SCOM2050: { credits: 3, title: "Media, Culture, and Society" },

  // English
  ENGL1101: { credits: 3, title: "English Composition I" },
  ENGL1102: { credits: 3, title: "English Composition II" },
  ENGL2110: { credits: 3, title: "World Literature" },

  // History / Political Science
  HIST1111: { credits: 3, title: "World History to the 1500s" },
  HIST2110: { credits: 3, title: "Survey of U.S. History" },
  POLS1101: { credits: 3, title: "Intro to Political Science" },
};

export const MOCK_USER_DATA: MockUserDataProps = {
  email: "wm@uga.edu",
  semesters: [
    {
      name: "Fall 2020",
      startDate: "08/20/2020",
      endDate: "12/12/2020",
      courses: {
        ENGL1101: 3.0,
      },
    },
    {
      name: "Spring 2021",
      startDate: "01/08/2021",
      endDate: "04/28/2021",
      courses: {
        ENGL1102: 0.0,
      },
    },
    {
      name: "Spring 2022",
      startDate: "01/08/2022",
      endDate: "04/28/2022",
      courses: {
        SCOM2050: 4.0,
        HIST2110: 3.0,
        ENGL1102: 2.0,
      },
    },
    {
      name: "Fall 2022",
      startDate: "08/20/2022",
      endDate: "12/12/2022",
      courses: {
        SCOM1500: 4.0,
        SCOM1000: 4.0,
        MATH1111: 3.0,
        POLS1101: 2.0,
      },
    },
    {
      name: "Spring 2023",
      startDate: "01/08/2023",
      endDate: "04/28/2023",
      courses: {
        MATH1113: 4.0,
        CSCI1301: 4.0,
        HIST1111: 4.0,
        ENGL2110: 4.0,
        PSYC1101: 4.0,
        PHIL1010: 4.0,
      },
    },
    {
      name: "Summer 2023",
      startDate: "06/05/2023",
      endDate: "07/27/2023",
      courses: {
        ASTR1010L: 4.0,
        ASTR1010: 4.0,
        MATH2211: 4.0,
        CSCI1302: 4.0,
        CSCI2510: 4.0,
        MUA1500: 4.0,
      },
    },
    {
      name: "Fall 2023",
      startDate: "08/20/2023",
      endDate: "12/12/2023",
      courses: {
        MATH2212: 4.0,
        CSCI2720: 4.0,
        CSCI2920: 4.0,
        ENVS1401: 4.0,
        ENVS1401L: 4.0,
      },
    },
    {
      name: "Spring 2024",
      startDate: "01/08/2024",
      endDate: "04/28/2024",
      courses: {
        MATH3300: 4.0,
        CSCI1730: 4.0,
        LATN1001: 4.0,
        CSCI2670: 4.0,
      },
    },
  ],
};
