"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const handleLogin = (role: "student" | "professor") => {
    if (role === "professor") {
      const password = prompt("Please enter the professor password:");
      if (password === "1234") {
        document.cookie = `mockUserRole=professor; path=/;`;
        router.push("/dashboard");
      } else {
        alert("Incorrect password.");
      }
      return;
    }
    // In a real app, you'd perform authentication here.
    // For this MVP, we'll just set a mock cookie/local storage item
    // and redirect.
    document.cookie = `mockUserRole=${role}; path=/;`;
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-50">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Attendr</CardTitle>
          <CardDescription>
            Select a role to sign in for the demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" onClick={() => handleLogin("student")}>
              Sign In as Student
            </Button>
            <Button onClick={() => handleLogin("professor")}>
              Sign In as Professor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
