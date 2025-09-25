# Product Vision: Attendr (Live Demo)

## 1. Introduction

Professors are required to take attendance, but current solutions are clunky and require repetitive setup for each class. Attendr's mission is to make attendance effortless and automated.

This document outlines the vision for a high-impact, local-first live demo designed to showcase Attendr's core value proposition: **seamless, automated, and secure attendance tracking.**

## 2. The Demo Story

The live demo will focus on two key user journeys that tell a compelling story:

- **The Student (Effortless Check-in):** A student has the Attendr Chrome extension installed. When their class is scheduled to start, the extension automatically verifies they are in the correct location (simulated), prompts for a quick identity verification via a mock Passkey, and checks them in—all in the background. **The student does nothing.**
- **The Professor (Effortless Oversight):** The professor logs into the Attendr web dashboard. They see a real-time view of their class roster, with attendance statuses already populated. They can also view overall attendance rates for each student and export the data with a single click. **The professor's only task is a one-time setup.**

## 3. Core Components

### Student-Side (Local Chrome Extension)

- **Purpose:** Demonstrate a fully automated, "zero-touch" student experience.
- **Features (Simulated):**
  - **Background Operation:** The extension runs locally, checking a hardcoded class schedule.
  - **Geolocation:** Simulates a check to ensure the student is near the classroom.
  - **Passkey Mock:** A simple browser pop-up will mimic a passkey/biometric prompt to confirm the student's identity securely. This is a crucial differentiator against QR code spoofing.
  - **API Call:** After successful "verification," the extension sends the check-in data to the backend.
- **Key Takeaway:** The student experience is entirely passive. There is no web page or manual action required from them.

### Professor-Side (Web Dashboard)

- **Purpose:** Showcase a clean, data-rich, and simple interface for professors.
- **Features:**
  - **Live Roster:** View student attendance status for each course in real-time.
  - **Attendance Rate:** See an aggregated attendance percentage for each student over time.
  - **CSV Export:** One-click export of attendance data.
- **Key Takeaway:** Emphasize the "one-time setup" benefit. The professor does not need to initiate an attendance session for each class.

### Website (Marketing Page)

- **Purpose:** Serve as the entry point for the demo, explaining the product's vision.
- **Feel:** Clean, modern, and tech-focused.
- **Content:** Clearly articulate the problems with current systems and how Attendr's automated, secure approach is superior.

## 4. Technical Strategy for Demo

- **Simplified Backend:** We will use a Supabase instance with a raw SQL schema. All data (student rosters, class schedules) will be manually inserted for the demo.
- **No Complex Routes:** We will only build the necessary API endpoint for the Chrome extension to submit attendance data. No other data manipulation routes are needed.
- **Local First:** The Chrome extension will be run locally and unpacked directly in the browser for the demo.

## 5. Success Metrics for Demo

- The demo convincingly shows the end-to-end flow from automated student check-in to professor data-view.
- The value proposition of "effortless attendance" is clear and compelling.
- The "one-time setup" benefit for professors is explicitly highlighted and understood.
