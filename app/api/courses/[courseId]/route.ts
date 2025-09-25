import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-control-allow-methods": "PUT, OPTIONS",
  "Access-control-allow-headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const { courseId } = params;
    const { start_time, end_time } = await request.json();

    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: "Missing start_time or end_time" },
        { status: 400, headers: corsHeaders },
      );
    }

    const { data, error } = await supabase
      .from("courses")
      .update({ start_time, end_time })
      .eq("id", courseId);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500, headers: corsHeaders },
    );
  }
}
