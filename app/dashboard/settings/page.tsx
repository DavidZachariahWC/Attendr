/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState, FormEvent } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// A mock professor ID for the demo.
const MOCK_PROFESSOR_ID = "00000000-0000-0000-0000-00000000000A";

// Define interfaces for our data structures
interface Student {
  id: string;
  name: string | null;
}

interface Course {
  id: string;
  name: string | null;
  location: string | null;
  start_time: string | null;
  end_time: string | null;
  students: Student[];
}

export default function SettingsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This is now a client-side function
  const updateCourseLocation = async (formData: FormData) => {
    const courseId = formData.get("courseId") as string;
    const location = formData.get("location") as string;

    if (!courseId) return;

    await supabase.from("courses").update({ location }).eq("id", courseId);

    // Re-fetch data to show the update immediately
    fetchCourseData();
  };

  const fetchCourseData = async () => {
    setLoading(true);
    // 1. Fetch courses for the professor
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("id, name, location, start_time, end_time")
      .eq("professor_id", MOCK_PROFESSOR_ID);

    if (courseError) {
      console.error("Error fetching courses:", courseError);
      setLoading(false);
      return;
    }

    // 2. For each course, fetch enrolled students
    const coursesWithStudents = await Promise.all(
      courseData.map(async (course) => {
        const { data: enrollments, error: _enrollmentError } = await supabase
          .from("enrollments")
          .select("users(id, name)") // Join with users table
          .eq("course_id", course.id);

        const students = enrollments?.map((e) => e.users as Student) || [];
        return { ...course, students };
      }),
    );

    setCourses(coursesWithStudents);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  const handleTimeChange = (course: Course) => {
    setSelectedCourse(course);
    setStartTime(
      course.start_time
        ? format(new Date(course.start_time), "yyyy-MM-dd'T'HH:mm")
        : "",
    );
    setEndTime(
      course.end_time
        ? format(new Date(course.end_time), "yyyy-MM-dd'T'HH:mm")
        : "",
    );
    setIsModalOpen(true);
  };

  const handleTimeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const { error } = await supabase
      .from("courses")
      .update({
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      })
      .eq("id", selectedCourse.id);

    if (error) {
      alert("Error updating time: " + error.message);
    } else {
      await fetchCourseData();
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading class settings...</p>;
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Class Settings</h1>
        <p className="text-muted-foreground">
          Update classroom locations and view student rosters.
        </p>
      </header>
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{course.name}</h3>
              <div className="flex items-center gap-2">
                <form
                  action={updateCourseLocation}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="courseId" value={course.id} />
                  <Input
                    type="text"
                    name="location"
                    defaultValue={course.location || ""}
                    placeholder="e.g., Classroom A"
                    className="px-2 py-1 border rounded-md w-36"
                  />
                  <Button type="submit" size="sm">
                    Save Location
                  </Button>
                </form>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTimeChange(course)}
                >
                  Set Times
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setExpandedCourseId(
                      expandedCourseId === course.id ? null : course.id,
                    )
                  }
                >
                  {expandedCourseId === course.id ? "Hide" : "View"} Roster
                </Button>
              </div>
            </div>
            {expandedCourseId === course.id && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2">
                  Enrolled Students ({course.students.length})
                </h4>
                {course.students.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {course.students.map((student) => (
                      <li key={student.id} className="text-sm text-gray-700">
                        {student.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No students are enrolled in this class.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Set Class Times for {selectedCourse?.name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTimeSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-time" className="text-right">
                  Start Time
                </Label>
                <Input
                  id="start-time"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-time" className="text-right">
                  End Time
                </Label>
                <Input
                  id="end-time"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
