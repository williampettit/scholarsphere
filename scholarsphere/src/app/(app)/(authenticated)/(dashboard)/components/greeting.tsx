"use client";

import { useState } from "react";

type GreetingProps = {
  name: string;
};

function getGreeting(date: Date): string {
  const hour = date.getHours();

  if (hour > 23 || hour < 5) {
    return "Good night";
  }

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function Greeting({ name }: GreetingProps) {
  const [date, setDate] = useState(new Date());

  setInterval(() => setDate(new Date()), 60 * 1000);

  const greeting = getGreeting(date);

  return (
    <>
      {greeting}, {name}!
    </>
  );
}
