import { Course, Grade } from "./enums";

export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    schoolNumber: string;
    birthDate: string;
    studentClass: string;
    courses: Record<Course, Grade>;
}
