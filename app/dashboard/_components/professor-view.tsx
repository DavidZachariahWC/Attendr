"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

// Define interfaces for our data structure
interface Student {
  id: string;
  name: string | null;
  attendance: { is_present: boolean }[];
}

interface Course {
  id: string;
  name: string | null;
  students: Student[];
}

// A mock professor ID for the demo.
const MOCK_PROFESSOR_ID = "00000000-0000-0000-0000-00000000000A";

export default function ProfessorView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessorData = async () => {
      setLoading(true);

      // 1. Fetch courses for the professor
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("id, name")
        .eq("professor_id", MOCK_PROFESSOR_ID);

      if (courseError) {
        console.error("Error fetching courses:", courseError);
        setLoading(false);
        return;
      }

      // 2. For each course, fetch enrolled students and their attendance
      const coursesWithDetails = await Promise.all(
        courseData.map(async (course) => {
          // Fetch students enrolled in the course
          const { data: enrollmentData, error: enrollmentError } =
            await supabase
              .from("enrollments")
              .select("student_id")
              .eq("course_id", course.id);

          if (enrollmentError) {
            console.error("Error fetching enrollments:", enrollmentError);
            return { ...course, students: [] };
          }

          const studentIds = enrollmentData.map((e) => e.student_id);

          // Fetch student details and their attendance for this specific course
          const studentsWithAttendance = await Promise.all(
            studentIds.map(async (studentId) => {
              const { data: studentData, error: studentError } = await supabase
                .from("users")
                .select("id, name")
                .eq("id", studentId)
                .single();

              const { data: attendanceData, error: attendanceError } =
                await supabase
                  .from("attendance_logs")
                  .select("is_present")
                  .eq("student_id", studentId)
                  .eq("course_id", course.id);

              return {
                id: studentData?.id || studentId,
                name: studentData?.name || "Unknown Student",
                attendance: attendanceData || [],
              };
            }),
          );

          return { ...course, students: studentsWithAttendance };
        }),
      );

      setCourses(coursesWithDetails);
      setLoading(false);
    };

    fetchProfessorData();
  }, []);

  const calculateAttendanceRate = (attendance: { is_present: boolean }[]) => {
    if (!attendance || attendance.length === 0) return 0;
    const presentCount = attendance.filter((log) => log.is_present).length;
    return Math.round((presentCount / attendance.length) * 100);
  };

  const handleExport = (courseName: string, students: Student[]) => {
    const headers = ["Student ID", "Student Name", "Attendance Rate (%)"];
    const rows = students.map((student) => [
      student.id,
      student.name,
      calculateAttendanceRate(student.attendance),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const sanitizedCourseName = (courseName || "course").replace(/ /g, "_");
    link.setAttribute("download", `${sanitizedCourseName}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Professor View</h2>
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">{course.name}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(course.name!, course.students)}
                >
                  Export CSV
                </Button>
              </div>
            </div>
            <ul className="border rounded-md divide-y">
              {course.students.map((student) => {
                const attendanceRate = calculateAttendanceRate(
                  student.attendance,
                );
                return (
                  <li
                    key={student.id}
                    className="p-3 flex justify-between items-center"
                  >
                    <span>{student.name}</span>
                    <span
                      className={`font-semibold ${
                        attendanceRate >= 90
                          ? "text-green-600"
                          : attendanceRate >= 70
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {attendanceRate}% Attendance
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
