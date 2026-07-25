"use client";
import React from "react";
import { ThemeProvider } from "next-themes";

export function AppTheme({ children }: { children: React.ReactNode }) {
  const themes = [
    "blue",
    "blue-light",
    "green",
    "green-light",
    "purple",
    "purple-light",
    "amber",
    "amber-light",
    "crimson",
    "cyberpunk",
    "paper",
    "candy",
  ];
  return (
    <ThemeProvider attribute="class" defaultTheme="system" themes={themes}>
      {children}
    </ThemeProvider>
  );
}
