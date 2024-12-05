"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import { QuestionInput } from "../components/QuestionInput";
import { QuestionDisplay } from "../components/QuestionDisplay";
import { parseAnswers } from "../components/AnswerParser";
import ThemeToggle from "../components/ThemeToggle";

interface Question {
  text: string;
  options: string[];
  correctAnswers: string[];
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const parseQuestions = (
    input: string,
    answers: string,
    format: "inline" | "separate" | "markdown" | "docx"
  ): Question[] => {
    const questionBlocks = input
      .split(/\d+\./)
      .filter((block) => block.trim() !== "");

    let parsedAnswers: string[][] = [];

    if (format === "separate") {
      parsedAnswers = parseAnswers(answers);
    }

    return questionBlocks.map((block, index) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      const questionText = lines[0];
      const options: string[] = [];
      let correctAnswers: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        let line = lines[i];
        let isCorrect = false;

        if (format === "markdown" && line.startsWith("!")) {
          isCorrect = true;
          line = line.substring(1).trim();
        }

        const match = line.match(/^([A-Z])\.(.*)/);
        if (match) {
          const optionText = line;
          options.push(optionText);

          if (isCorrect) {
            const optionLetter = optionText.split(".")[0];
            correctAnswers.push(optionLetter);
          }
        }
      }

      if (format === "separate") {
        correctAnswers = parsedAnswers[index] || [];
      }

      return {
        text: questionText,
        options: options,
        correctAnswers: correctAnswers,
      };
    });
  };

  const handleQuestionsSubmit = (
    questions: string,
    answers: string,
    format: "inline" | "separate" | "markdown" | "docx" // Add the 'docx' format
  ) => {
    const parsedQuestions = parseQuestions(questions, answers, format);
    setQuestions(parsedQuestions);
  };

  return (
    <main className="container mx-auto p-4 space-y-4">
      <motion.h1
        className="text-3xl font-bold"
        style={{ fontFamily: "Knowhere" }}
        initial={{ opacity: 0, y: -50 }} // Start state
        animate={{ opacity: 1, y: 0 }} // Animate to this state
        transition={{ duration: 0.5 }} // Transition duration
      >
        VALIMCQ
      </motion.h1>
      <a
        href="https://www.linkedin.com/in/axshatind"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-1"
      >
        <p className="text-sm pppangaia text-gray-500">
          made by{" "}
          <span className="flex items-center">
            axshatInd
            <svg
              className="h-4 w-4 text-gray-500 ml-1" // Adjust margin as needed
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22.225 0H1.775C.796 0 0 .796 0 1.775v20.451C0 23.204.796 24 1.775 24h20.451C23.204 24 24 23.204 24 22.225V1.775C24 .796 23.204 0 22.225 0zM7.25 20.452H3.75V9h3.5v11.452zm-1.75-12.94a2.02 2.02 0 1 1 0-4.04 2.02 2.02 0 0 1 0 4.04zm16.44 12.94h-3.5v-5.65c0-1.352-.027-3.09-1.88-3.09-1.877 0-2.166 1.474-2.166 3.007v5.733h-3.5V9h3.5v1.55h.048c.487-.92 1.675-1.894 3.448-1.894 3.688 0 4.359 2.43 4.359 5.59v6.206z" />
            </svg>
          </span>
        </p>
      </a>

      {/* Position the ThemeToggle button in the top right corner */}
      <div className="absolute flex flex-col col-span-2 top-1 right-4 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <QuestionInput onQuestionsSubmit={handleQuestionsSubmit} />
      </motion.div>

      {questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <QuestionDisplay questions={questions} />
        </motion.div>
      )}
    </main>
  );
}
