"use client";

import { useState } from "react";

type GreetingProps = {
  name: string;
};

function getGreeting(date: Date) {
  const hour = date.getHours();

  if (hour > 23 || hour < 5) {
    return "Good night";
  } else if (hour < 12) {
    return "Good morning";
  } else if (hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
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
