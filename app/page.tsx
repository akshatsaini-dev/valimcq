"use client";

import { useState } from "react";
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
    format: "inline" | "separate" | "markdown"
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
    format: "inline" | "separate" | "markdown"
  ) => {
    const parsedQuestions = parseQuestions(questions, answers, format);
    setQuestions(parsedQuestions);
  };

  return (
    <main className="relative container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold" style={{ fontFamily: "Knowhere" }}>
        VALIMCQ
      </h1>
      <a
        href="https://www.linkedin.com/in/axshatind"
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="text-sm pppangaia text-gray-500">made by axshatInd</p>
      </a>

      {/* Position the ThemeToggle button in the top right corner */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <QuestionInput onQuestionsSubmit={handleQuestionsSubmit} />
      {questions.length > 0 && <QuestionDisplay questions={questions} />}
    </main>
  );
}
