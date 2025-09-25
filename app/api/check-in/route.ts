import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const { studentId, courseId } = await request.json();

    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: "Missing studentId or courseId" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Fetch course start and end times
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("start_time, end_time")
      .eq("id", courseId)
      .single();

    if (courseError || !courseData) {
      return NextResponse.json(
        { error: "Course not found or error fetching course details." },
        { status: 404, headers: corsHeaders },
      );
    }

    const now = new Date();
    const startTime = new Date(courseData.start_time);
    const endTime = new Date(courseData.end_time);

    if (now < startTime || now > endTime) {
      return NextResponse.json(
        { error: "Check-in is not available at this time." },
        { status: 403, headers: corsHeaders },
      );
    }

    const { data, error } = await supabase
      .from("attendance_logs")
      .insert([{ student_id: studentId, course_id: courseId }]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500, headers: corsHeaders },
    );
  }
}
