// components/ThemeToggle.js
"use client"; // Ensure this component can manage state

import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center" // Adjusted for circular shape
    >
      {isDark ? (
        <SunIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" /> // Adjusted size to fit the button
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" /> // Adjusted size to fit the button
      )}
    </button>
  );
};

export default ThemeToggle;
