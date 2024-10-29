"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionInputProps {
  onQuestionsSubmit: (
    questions: string,
    answers: string,
    format: "inline" | "separate" | "markdown"
  ) => void;
}

export function QuestionInput({ onQuestionsSubmit }: QuestionInputProps) {
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  // Set the default format to "markdown"
  const [format, setFormat] = useState<"inline" | "separate" | "markdown">(
    "markdown"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuestionsSubmit(questions, answers, format);
  };

  const getPlaceholder = () => {
    switch (format) {
      case "inline":
        return `Paste your MCQ questions with answers here...\nExample for correct Input format:\n \n1. Which term refers to application menus and modules which you may want to access quickly and often?\nA. Breadcrumb\nB. Favorite\nC. Tag\nD. Bookmark\nAns: B\n\n2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)\nA. Most recent update\nB. Popularity\nC. Relevancy\nD. Manager assignment\nE. Number of views\nAns: A,C,E`;
      case "separate":
        return `Paste your MCQ questions here...\nExample for correct Input format for question:\n \n1. Which term refers to application menus and modules which you may want to access quickly and often?\nA. Breadcrumb\nB. Favorite\nC. Tag\nD. Bookmark\n\n2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)\nA. Most recent update\nB. Popularity\nC. Relevancy\nD. Manager assignment\nE. Number of views`;
      case "markdown":
        return `Paste your MCQ questions...\nuse symbol ! for marking correct options,\n \nExample for correct Input format:\n1. Which term refers to application menus and modules which you may want to access quickly and often?\nA. Breadcrumb\n!B. Favorite\nC. Tag\nD. Bookmark\n\n2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)\n!A. Most recent update\nB. Popularity\n!C. Relevancy\nD. Manager assignment\n!E. Number of views`;
      default:
        return "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="format" className="pppangaia">
          Select Input Format
        </Label>
        <RadioGroup
          id="format"
          value={format}
          onValueChange={(value: "inline" | "separate" | "markdown") =>
            setFormat(value)
          }
          className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="inline" id="inline" />
            <Label htmlFor="inline" className="pppangaia">
              Answers with each question
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="separate" id="separate" />
            <Label htmlFor="separate" className="pppangaia">
              Answers at the end
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="markdown" id="markdown" />
            <Label htmlFor="markdown" className="pppangaia">
              Answers as Markdown
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Textarea
        placeholder={getPlaceholder()} // Always get the questions placeholder
        value={questions}
        onChange={(e) => setQuestions(e.target.value)}
        className="min-h-[400px]" // Increased height
      />
      {format === "separate" && (
        <Textarea
          placeholder={`Paste your answers here...\nExample for correct Input format for answers:\nAns: 1. B; 2. A,C,E`}
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          className="min-h-[200px]" // Increased height
        />
      )}
      <Button type="submit" className="pppangaia">
        Submit Questions
      </Button>
    </form>
  );
}
