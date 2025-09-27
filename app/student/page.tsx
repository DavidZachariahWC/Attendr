/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Student {
  id: string;
  name: string | null;
}

interface Course {
  id: string;
  name: string;
  location: string;
  start_time: string;
  end_time: string;
}

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      const { data, error } = await supabase
        .from("users")
        .select("id, name")
        .eq("role", "student");

      if (error) {
        console.error("Error fetching students:", error);
        setError("Could not fetch students. Please try again.");
      } else if (data) {
        setStudents(data);
      }
      setLoadingStudents(false);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!selectedStudent) return;

      setLoadingCourses(true);
      setError("");

      const { data: enrollments, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("student_id", selectedStudent.id);

      if (enrollmentsError) {
        setError("Could not fetch your courses. Please try again.");
        console.error(enrollmentsError);
        setLoadingCourses(false);
        return;
      }

      if (!enrollments || enrollments.length === 0) {
        setEnrolledCourses([]);
        setLoadingCourses(false);
        return;
      }

      const courseIds = enrollments.map((e) => e.course_id);

      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("id, name, location, start_time, end_time")
        .in("id", courseIds);

      if (coursesError) {
        setError("Could not fetch your course details. Please try again.");
        console.error(coursesError);
      } else {
        setEnrolledCourses(courses || []);
      }
      setLoadingCourses(false);
    };

    fetchEnrolledCourses();
  }, [selectedStudent]);

  useEffect(() => {
    // Reset state when selection changes
    setIsCheckedIn(false);
    setError("");
    setLocation("");

    if (!selectedStudent || !selectedCourse) {
      return;
    }

    const checkAttendanceStatus = async () => {
      // Query attendance_logs table
      const { data, error } = await supabase
        .from("attendance_logs")
        .select("id")
        .eq("student_id", selectedStudent.id)
        .eq("course_id", selectedCourse.id)
        .limit(1);

      if (error) {
        console.error("Error checking attendance status:", error);
        setError("Could not verify check-in status.");
      } else if (data && data.length > 0) {
        setIsCheckedIn(true);
      }
    };

    checkAttendanceStatus();
  }, [selectedStudent, selectedCourse]);

  const handleCheckIn = async () => {
    if (!selectedCourse) return;
    setError("");

    // Time validation
    const now = new Date();
    const startTime = selectedCourse.start_time
      ? new Date(selectedCourse.start_time)
      : null;
    const endTime = selectedCourse.end_time
      ? new Date(selectedCourse.end_time)
      : null;

    if (!startTime || !endTime || now < startTime || now > endTime) {
      setError("Check-in is only available between class start and end times.");
      return;
    }

    if (location.toLowerCase() !== selectedCourse.location.toLowerCase()) {
      setError("You must be in the classroom to check in.");
      return;
    }

    const passkeyVerified = window.confirm(
      `Please verify your identity, ${selectedStudent?.name}.\n(This is a simulated passkey prompt)`,
    );

    if (passkeyVerified && selectedStudent) {
      try {
        const response = await fetch("/api/check-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: selectedStudent.id,
            courseId: selectedCourse.id,
          }),
        });

        if (response.ok) {
          setIsCheckedIn(true);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to check in. Please try again.");
        }
      } catch (_err) {
        setError("An error occurred. Please try again.");
      }
    }
  };

  // Step 1: Profile Selection
  if (!selectedStudent) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Select Your Profile
        </h2>
        {loadingStudents ? (
          <p>Loading students...</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {students.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="h-24 min-w-32 text-lg px-6"
                onClick={() =>
                  setSelectedStudent({
                    id: user.id,
                    name: user.name || "Unnamed Student",
                  })
                }
              >
                {user.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Step 2: Course Selection
  if (!selectedCourse) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Welcome, {selectedStudent.name}
          </h2>
          <Button variant="link" onClick={() => setSelectedStudent(null)}>
            Switch Profile
          </Button>
        </div>
        <h3 className="text-lg font-medium mb-2">Select a Class to Check In</h3>
        {loadingCourses ? (
          <p>Loading your courses...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : enrolledCourses.length > 0 ? (
          <div className="space-y-2">
            {enrolledCourses.map((course) => (
              <Button
                key={course.id}
                variant="outline"
                className="w-full justify-start h-12 text-left"
                onClick={() => setSelectedCourse(course)}
              >
                {course.name}
              </Button>
            ))}
          </div>
        ) : (
          <p>You are not enrolled in any courses.</p>
        )}
      </div>
    );
  }

  // Step 3: Check-in
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Check-in for {selectedCourse.name}
        </h2>
        <Button variant="link" onClick={() => setSelectedCourse(null)}>
          Back to Courses
        </Button>
      </div>

      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">{selectedCourse.name}</h3>
          {isCheckedIn && (
            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">
              Checked In
            </span>
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <label
            htmlFor="location-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Current Location
          </label>
          <input
            type="text"
            id="location-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder={`e.g., ${selectedCourse.location || "Classroom..."}`}
            disabled={isCheckedIn}
          />
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>

        <div className="mt-4">
          <Button
            onClick={handleCheckIn}
            disabled={isCheckedIn || !location}
            className="w-full"
          >
            {isCheckedIn ? "Check-in Complete" : "Confirm & Verify Check-in"}
          </Button>
        </div>
      </div>
    </div>
  );
}
