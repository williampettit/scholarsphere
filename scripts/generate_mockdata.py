# pip3 install "pydantic[email]"

from datetime import datetime, timedelta
from pydantic import BaseModel, Field, UUID4, EmailStr, HttpUrl
from typing import Dict, List, Optional, Tuple
from uuid import uuid4
import json
import random

# for consistency, we use a custom UUID type
UuidType      = UUID4
generate_uuid = uuid4

# enums
SEASONS = ["spring", "summer", "fall"]

# database constants
MIN_VANITY_NAME_LENGTH          = 2
MAX_VANITY_NAME_LENGTH          = 32
MAX_COURSE_TITLE_LENGTH         = 128
MAX_COURSE_DESCRIPTION_LENGTH   = 1024
MAX_SEMESTER_CUSTOM_NAME_LENGTH = 128
MAX_ASSIGNMENT_TITLE_LENGTH     = 128
MAX_SHORT_ID_LENGTH             = 32
MAX_NUM_COURSES_PER_SEMESTER    = 16
MAX_NUM_ASSIGNMENTS_PER_COURSE  = 512
MAX_NUM_COURSES_PER_USER        = 128
MAX_NUM_SEMESTERS_PER_USER      = 32
MIN_CREDIT_HOURS_PER_COURSE     = 0
MAX_CREDIT_HOURS_PER_COURSE     = 16

# base model with a unique id
class BaseModelWithId(BaseModel):
  id: UuidType = Field(default_factory=generate_uuid)

#
# models
#

class Semester(BaseModelWithId):
  start_date:           str            # TODO: use proper date type rather than a string
  end_date:             str            # TODO: use proper date type rather than a string
  custom_name:          Optional[str]  = Field(max_length=MAX_SEMESTER_CUSTOM_NAME_LENGTH)
  connected_course_ids: List[UuidType] = Field(max_items=MAX_NUM_COURSES_PER_SEMESTER, default_factory=list)

  def __hash__(self) -> int:
    return hash((
      self.id,
      self.start_date,
      self.end_date,
      self.custom_name,
      self.connected_course_ids,
    ))

class Assignment(BaseModelWithId):
  title:     str  = Field(max_length=MAX_ASSIGNMENT_TITLE_LENGTH)
  due_date:  str  # TODO: use proper date type rather than a string
  completed: bool = Field(default=False)

  def __hash__(self) -> int:
    return hash((
      self.id,
      # self.title,
      # self.due_date,
      # self.completed,
    ))

class Course(BaseModelWithId):
  title:                 str                = Field(max_length=MAX_COURSE_TITLE_LENGTH)
  credit_hours:          Optional[int]      = Field(ge=MIN_CREDIT_HOURS_PER_COURSE, le=MAX_CREDIT_HOURS_PER_COURSE)
  short_id:              Optional[str]      = Field(max_length=MAX_SHORT_ID_LENGTH)
  description:           Optional[str]      = Field(max_length=MAX_COURSE_DESCRIPTION_LENGTH)
  assignments:           List[Assignment]   = Field(max_items=MAX_NUM_ASSIGNMENTS_PER_COURSE, default_factory=list)
  connected_semester_id: Optional[UuidType] # 
  grade:                 Optional[float]    = Field(ge=0, le=100)

  def __hash__(self) -> int:
    return hash((
      self.id,
      self.title,
      self.credit_hours,
      self.short_id,
      self.description,
      self.connected_semester_id,
    ))

class User(BaseModelWithId):
  email:       EmailStr          # 
  avatar_url:  Optional[HttpUrl] # 
  vanity_name: Optional[str]     = Field(min_length=MIN_VANITY_NAME_LENGTH, max_length=MAX_VANITY_NAME_LENGTH)
  semesters:   List[Semester]    = Field(max_items=MAX_NUM_SEMESTERS_PER_USER, default_factory=list)
  courses:     List[Course]      = Field(max_items=MAX_NUM_COURSES_PER_USER, default_factory=list)

def _generate_mock_semester_with_courses(
  year:             int,
  season:           str,
  possible_courses: List[Course],
) -> Tuple[Semester, List[Course]]:
  match season:
    case "spring":
      start_date  = datetime(year=year, month=1, day=5) + timedelta(days=random.randint(0, 5))
      end_date    = start_date + timedelta(days=105 + random.randint(0, 10))
      num_courses = random.randint(4, 6)
    case "summer":
      start_date  = datetime(year=year, month=6, day=2) + timedelta(days=random.randint(0, 5))
      end_date    = start_date + timedelta(days=45 + random.randint(0, 5))
      num_courses = random.randint(1, 2)
    case "fall":
      start_date  = datetime(year=year, month=8, day=3)  + timedelta(days=random.randint(0, 5))
      end_date    = start_date + timedelta(days=105 + random.randint(0, 10))
      num_courses = random.randint(4, 6)
    case _:
      raise ValueError(f"invalid season: {season}")
  
  semester = Semester(
    start_date = start_date.isoformat(),
    end_date   = end_date.isoformat(),
  )

  courses: List[Course] = []
  
  POSSIBLE_ASSIGNMENT_TITLES = [
    "Homework",
    "Quiz",
    "Test",
    "Exam",
    "Project",
    "Paper",
    "Essay",
    "Lab",
    "Discussion",
    "Reading",
    "Presentation",
    "Final",
  ]

  for _ in range(num_courses):
    course = possible_courses.pop()
    
    total_days = (end_date - start_date).days

    # generate assignments
    for _ in range( int(total_days / 3.5 + random.randint(-5, 5)) ):
      # generate a random due date
      due_date = start_date + timedelta(days=random.randint(0, total_days))
      completed = random.random() > 0.3 and due_date < datetime.now()

      # create the assignment
      assignment = Assignment(
        title     = random.choice(POSSIBLE_ASSIGNMENT_TITLES),
        due_date  = due_date.isoformat(),
        completed = completed,
      )

      # link the assignment to the course
      course.assignments.append(assignment)
    
    # link the course to the semester
    course.connected_semester_id = semester.id

    # link the semester to the course
    semester.connected_course_ids.append(course.id)

    # add the course to the set of courses
    courses.append(course)

  return (semester, courses)

def _sort_by_course_number(course: Course):
  return int("".join([c for c in course.short_id if c.isdigit()]))

def generate_mock_user(
  start_year: int,
  end_year: int,
  possible_courses: List[Course],
) -> User:
  possible_courses = sorted(
    possible_courses,
    key=_sort_by_course_number,
    reverse=True,
  )

  user = User(
    id          = generate_uuid(),
    email       = "wm@uga.edu",
    vanity_name = "william",
    avatar_url  = "https://avatars.githubusercontent.com/u/14142910?v=4",
  )

  for year in range(start_year, end_year):
    for season in SEASONS:
      (semester, courses) = _generate_mock_semester_with_courses(
        year=year,
        season=season,
        possible_courses=possible_courses,
      )

      user.courses.extend(courses)
      user.semesters.append(semester)

  return user

if __name__ == "__main__":
  with open("course_descriptions.json") as file:
    course_descriptions = json.load(file)

  def _skip_course(course_id: str) -> bool:
    if course_id.endswith(("H", "E", "W", )):
      return True
    if "EMAT" in course_id:
      return True
    return False

  possible_courses = [
    Course(
      id           = generate_uuid(),
      short_id     = course_id,
      title        = course_info["title"],
      description  = course_info["description"],
      credit_hours = course_info["hours"],
      grade        = round(90 + random.random() * 10, 2),
    )
    for (course_id, course_info) in course_descriptions.items()
    if not _skip_course(course_id=course_id)
  ]

  mock_user = generate_mock_user(
    start_year=2021,
    end_year=2025,
    possible_courses=possible_courses,
  )
  
  print("Total Semesters:", len(mock_user.semesters))
  print("Total Courses:", len(mock_user.courses))
  print("Total Credits:", sum(course.credit_hours for course in mock_user.courses))

  mock_user_data = mock_user.json(
    models_as_dict=False,
    indent=2,
  )

  with open("mock_user_data.json", "w") as file:
    file.write(mock_user_data)