import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Attendr Chrome Extension - Background Script

// Initialize Supabase client
// NOTE: In a real extension, you'd protect these keys, but for a local demo this is fine.
const supabaseUrl = "YOUR_SUPABASE_URL"; // IMPORTANT: Replace with your Supabase URL
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY"; // IMPORTANT: Replace with your Supabase Anon Key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Attendr Background Script Loaded.");

const MOCK_STUDENT_ID = "00000000-0000-0000-0000-000000000001";

// --- Extension Lifecycle ---

chrome.runtime.onInstalled.addListener(() => {
  console.log("Attendr extension installed.");
  // Set up the periodic alarm
  chrome.alarms.create("check-schedule-alarm", {
    periodInMinutes: 1, // Check every minute
  });
  // The schedule is now fetched dynamically, so we remove the static storage.
});

// --- Alarm Listener ---

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "check-schedule-alarm") {
    console.log("Alarm triggered: Checking schedule...");
    const schedule = await getScheduleFromAPI(MOCK_STUDENT_ID);
    const now = new Date();

    for (const course of schedule) {
      const isDue = isCourseTime(course, now);
      const hasBeenCheckedIn = await hasCheckedInToday(course.id);

      if (isDue && !hasBeenCheckedIn) {
        console.log(`Course ${course.id} is due. Starting check-in process.`);
        await initiateCheckIn(course); // Pass the whole course object
      }
    }
  }
});

// --- Message Listener ---

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "completeCheckIn") {
    console.log(`Received confirmation for course ${message.courseId}.`);
    // All checks passed. Sending check-in to API...
    sendCheckInToApi(message.courseId);
    sendResponse({ status: "success" });
  }
  return true; // Keep the message channel open for async response
});

// New API to fetch schedule
async function getScheduleFromAPI(studentId) {
  try {
    // In a real app, you would have an endpoint that returns the schedule for a given student
    // For this demo, we will simulate this by fetching all course data for the mock student's enrollments.
    // This is NOT efficient, but demonstrates the principle.

    // This part would be a single API call in a real app.
    // 1. Get student enrollments
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("student_id", studentId);
    if (!enrollments) return [];

    const courseIds = enrollments.map((e) => e.course_id);
    // 2. Get course details
    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .in("id", courseIds);

    return courses || [];
  } catch (error) {
    console.error("Failed to fetch schedule from API:", error);
    return [];
  }
}

// --- Core Logic ---

async function initiateCheckIn(course) {
  // Open confirmation window with all necessary details
  const url = new URL(chrome.runtime.getURL("confirmation.html"));
  url.searchParams.append("courseId", course.courseId);
  url.searchParams.append("courseName", course.courseName);
  url.searchParams.append("location", course.location);

  chrome.windows.create({
    url: url.href,
    type: "popup",
    width: 360,
    height: 250, // Increased height for the input field
  });
}

async function sendCheckInToApi(courseId) {
  console.log(`Sending check-in for ${courseId} to API...`);
  try {
    const response = await fetch("http://localhost:3000/api/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: MOCK_STUDENT_ID,
        courseId: courseId,
      }),
    });

    if (response.ok) {
      console.log("Successfully checked in!");
      // Mark as checked in for today
      await markAsCheckedIn(courseId);
    } else {
      const errorData = await response.json();
      console.error("Failed to check in:", errorData.error);
    }
  } catch (error) {
    console.error("Error calling check-in API:", error);
  }
}

// --- Helper Functions & Simulations ---

function isCourseTime(course, now) {
  const startTime = new Date(course.start_time);
  const endTime = new Date(course.end_time);

  // For the demo, we'll ignore the date part and only check day of the week and time
  const nowDay = now.getDay();
  const startDay = startTime.getDay();

  const nowTime = now.getHours() * 60 + now.getMinutes();
  const startTimeMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const endTimeMinutes = endTime.getHours() * 60 + endTime.getMinutes();

  return (
    nowDay === startDay &&
    nowTime >= startTimeMinutes &&
    nowTime <= endTimeMinutes
  );
}

async function hasCheckedInToday(courseId) {
  const key = `checkedIn_${courseId}_${new Date().toISOString().split("T")[0]}`;
  const result = await chrome.storage.local.get(key);
  return result[key] || false;
}

async function markAsCheckedIn(courseId) {
  const key = `checkedIn_${courseId}_${new Date().toISOString().split("T")[0]}`;
  await chrome.storage.local.set({ [key]: true });
  console.log(`Marked ${courseId} as checked in for today.`);
}

function simulatePasskey() {
  // This is a placeholder for a real passkey interaction.
  // For the demo, we'll just use a simple confirm dialog.
  console.log("Simulating passkey prompt...");
  // Note: In a real background script, you can't use `confirm`.
  // This is a simplification for the demo. You'd typically open a small window.
  // For our purpose, we'll assume it's always confirmed.
  return Promise.resolve(true);
}
