// app/components/SmoothScrollWrapper.js

"use client"; // This component will be a client component

import { useEffect } from "react";
import Lenis from "lenis";

const SmoothScrollWrapper = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => t,
      smooth: true,
      direction: "vertical",
    });

    const update = (time) => {
      lenis.raf(time);
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>; // Render children normally
};

export default SmoothScrollWrapper;
