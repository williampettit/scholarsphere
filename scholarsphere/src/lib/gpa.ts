//
// GPA class is used while iterating over list of courses
//

export class GPA {
  _nCourses = 0;
  _nEarnedCredits = 0;
  _nEarnedGradePoints = 0;
  _nEttemptedGradePoints = 0;
  _nPlaces = 2;

  gradeToPoints(grade: number): number {
    if (grade >= 90) return 4.0;
    if (grade >= 80) return 3.0;
    if (grade >= 70) return 2.0;
    if (grade >= 60) return 1.0;
    return 0.0;
  }

  addCourse(course: { grade: number; creditHours: number }) {
    //
    this._nCourses += 1;

    // e.g. 4.0
    const gradePoints = this.gradeToPoints(course.grade);

    // e.g. 4.0 * 3 = 12
    this._nEarnedGradePoints += gradePoints * course.creditHours;

    // e.g. 3
    this._nEttemptedGradePoints += course.creditHours;

    // e.g. 4.0 > 0, so add 3 to credits
    if (gradePoints > 0) {
      this._nEarnedCredits += course.creditHours;
    }
  }

  getEarnedCredits(): number {
    return this._nEarnedCredits;
  }

  _truncateGpa(gpa: number): number {
    return Math.round(gpa * 10 ** this._nPlaces) / 10 ** this._nPlaces;
  }

  getGpa(): number {
    return this._truncateGpa(
      this._nEarnedGradePoints / this._nEttemptedGradePoints,
    );
  }
}
