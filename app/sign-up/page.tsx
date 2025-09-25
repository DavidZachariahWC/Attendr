"use client";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <p className="text-muted-foreground mb-4">
          Sign-up is not required for this demo.
        </p>
        <Link href="/sign-in" className="text-primary hover:underline">
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}
