"use client";

import Header from "./components/header";
import InitialDisplay from "./components/initial-display";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <InitialDisplay />
      </main>
    </div>
  );
}
