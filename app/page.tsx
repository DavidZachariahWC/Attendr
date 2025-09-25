"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";
import { useEffect } from "react";
import AnimatedSection from "@/components/homepage/animated-section";

export default function HomePage() {
  useEffect(() => {
    console.log("secret: 1234");
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-6 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 12L22 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 12V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 12L2 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xl font-semibold">Attendr</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="hero-pattern text-center py-20 px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Effortless Attendance Tracking is Here
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              Attendr automates attendance with secure, location-aware technology.
              No more QR codes. No more wasted class time.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <div className="mt-8 flex justify-center">
              <Link href="/sign-in">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-center">
                Why Professors Love Attendr
              </h2>
            </AnimatedSection>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
              <AnimatedSection delay={0.2}>
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                    <Check />
                  </div>
                  <h3 className="mt-5 text-lg font-medium">One-Time Setup</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Set up your courses once. Attendr handles the rest, every
                    single class.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.4}>
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                    <Check />
                  </div>
                  <h3 className="mt-5 text-lg font-medium">
                    Secure & Reliable
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Location verification and passkey prompts prevent students
                    from checking in when they are not in class.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.6}>
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                    <Check />
                  </div>
                  <h3 className="mt-5 text-lg font-medium">
                    Seamless Exports
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Export attendance data to CSV for easy integration with your
                    school&apos;s grading system.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="section-pattern py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold">
                A Seamless Experience for Students
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="mt-4 text-lg text-gray-500">
                With the Attendr Chrome extension, students can say goodbye to
                classroom distractions. No more fumbling for phones or scanning
                QR codes.
              </p>
            </AnimatedSection>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
              <AnimatedSection delay={0.4}>
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 1a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-5V3a2 2 0 0 0-2-2z" />
                    <path d="M9 11l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-medium">
                  Zero-Touch Check-in
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  The extension handles check-in automatically in the
                  background. Students don&apos;t have to do a thing.
                </p>
              </div>
            </AnimatedSection>
              <AnimatedSection delay={0.6}>
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 1a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-5V3a2 2 0 0 0-2-2z" />
                    <path d="M9 11l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-medium">
                  Fewer Distractions
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  By keeping phones away, students can stay focused on the
                  lecture, not on scanning codes.
                </p>
              </div>
            </AnimatedSection>
              <AnimatedSection delay={0.8}>
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 1a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-5V3a2 2 0 0 0-2-2z" />
                    <path d="M9 11l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-medium">
                  Secure and Private
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Our extension uses location verification and passkeys,
                  keeping student data safe and secure.
                </p>
              </div>
            </AnimatedSection>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 px-6 md:px-8 border-t">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Attendr. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
