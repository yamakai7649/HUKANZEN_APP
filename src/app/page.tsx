"use client";

import { useUser } from "@/context/UserContext";
import { TimerSection } from "@/components/timer/TimerSection";

export default function Home() {
  const { loading } = useUser();

  if (loading) return null;

  return <TimerSection />;
}
