"use client";

import { useState } from "react";
import { QuestionInput } from "../components/QuestionInput";
import { QuestionDisplay } from "../components/QuestionDisplay";
import { parseAnswers } from "../components/AnswerParser";

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

        // Check if it's markdown format and if the option starts with '!'
        if (format === "markdown" && line.startsWith("!")) {
          isCorrect = true;
          line = line.substring(1).trim(); // Remove '!' to store the option without it
        }

        const match = line.match(/^([A-Z])\.(.*)/);
        if (match) {
          const optionText = line;
          options.push(optionText);

          // If the option is correct, add it to the correctAnswers list
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
    format: "inline" | "separate" | "markdown" // Include "markdown" here
  ) => {
    const parsedQuestions = parseQuestions(questions, answers, format);
    setQuestions(parsedQuestions);
  };

  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">MCQ Quiz</h1>
      <QuestionInput onQuestionsSubmit={handleQuestionsSubmit} />
      {questions.length > 0 && <QuestionDisplay questions={questions} />}
    </main>
  );
}
