"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const DEMO_USERS = [
  { name: "Will", id: "00000000-0000-0000-0000-000000000003" },
  { name: "Julian", id: "00000000-0000-0000-0000-000000000002" },
  { name: "Lan", id: "00000000-0000-0000-0000-000000000004" },
];

const DEMO_COURSE = {
  id: "00000000-0000-0000-0000-00000000003C",
  name: "Interview Demo",
  // This is now dynamic, so we remove the hardcoded location
};

export default function StudentPage() {
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [courseDetails, setCourseDetails] = useState({
    location: "",
    startTime: null,
    endTime: null,
  });

  useEffect(() => {
    // Fetch the course location when a student is selected
    const fetchCourseDetails = async () => {
      if (!selectedStudent) return;

      const { data, error } = await supabase
        .from("courses")
        .select("location, start_time, end_time")
        .eq("id", DEMO_COURSE.id)
        .single();

      if (data) {
        setCourseDetails({
          location: data.location,
          startTime: data.start_time,
          endTime: data.end_time,
        });
      }
    };

    fetchCourseDetails();
  }, [selectedStudent]);

  const handleCheckIn = async () => {
    setError("");

    // Time validation
    const now = new Date();
    const startTime = courseDetails.startTime
      ? new Date(courseDetails.startTime)
      : null;
    const endTime = courseDetails.endTime
      ? new Date(courseDetails.endTime)
      : null;

    if (!startTime || !endTime || now < startTime || now > endTime) {
      setError("Check-in is only available between class start and end times.");
      return;
    }

    if (location.toLowerCase() !== courseDetails.location.toLowerCase()) {
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
            courseId: DEMO_COURSE.id,
          }),
        });

        if (response.ok) {
          setIsCheckedIn(true);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to check in. Please try again.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    }
  };

  if (!selectedStudent) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Select Your Profile
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {DEMO_USERS.map((user) => (
            <Button
              key={user.id}
              variant="outline"
              className="h-24 text-lg"
              onClick={() => setSelectedStudent(user)}
            >
              {user.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Welcome, {selectedStudent.name}
        </h2>
      </div>

      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">{DEMO_COURSE.name}</h3>
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
            placeholder={`e.g., ${courseDetails.location || "Classroom..."}`}
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
