"use client";

import ProfessorView from "./_components/professor-view";

export default function Dashboard() {
  return (
    <section className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Attendr dashboard.
        </p>
      </header>
      <div className="flex flex-1 flex-col gap-4">
        <ProfessorView />
      </div>
    </section>
  );
}
