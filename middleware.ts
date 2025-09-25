import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const role = request.cookies.get("mockUserRole")?.value;
  const url = request.nextUrl.clone();

  // If no role, and trying to access a protected route, redirect to sign-in
  if (
    !role &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/student"))
  ) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Role-based redirection logic
  if (role) {
    if (role === "student" && !pathname.startsWith("/student")) {
      url.pathname = "/student";
      return NextResponse.redirect(url);
    }
    if (role === "professor" && !pathname.startsWith("/dashboard")) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/student/:path*"],
};
