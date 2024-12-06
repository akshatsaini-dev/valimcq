// components/ScrollToBottom.tsx

"use client"; // This marks the component as a client component

import React from "react";

export default function ScrollToBottom() {
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToBottom}
      className="fixed bottom-4 right-4 p-2 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 z-50"
      aria-label="Scroll to Bottom"
    >
      ↓
    </button>
  );
}
