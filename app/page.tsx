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
    format: "inline" | "separate"
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
        const line = lines[i];
        if (line.startsWith("Ans:")) {
          correctAnswers = line
            .substring(4)
            .split(",")
            .map((a) => a.trim());
          break;
        }
        const match = line.match(/^([A-Z])\.(.*)/);
        if (match) {
          options.push(line);
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
    format: "inline" | "separate"
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
