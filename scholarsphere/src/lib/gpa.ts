//
// `GPA` class holds values while iterating over courses
//

export class GPA {
  private _nCourses = 0;
  private _nEarnedCredits = 0;
  private _nEarnedGradePoints = 0;
  private _nEttemptedGradePoints = 0;
  private _nPlaces = 2;

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
    if (this._nEttemptedGradePoints === 0) {
      return 0;
    }

    const gpa = this._nEarnedGradePoints / this._nEttemptedGradePoints;

    return this._truncateGpa(gpa);
  }
}
