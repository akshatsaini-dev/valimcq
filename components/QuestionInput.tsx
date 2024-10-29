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
  const [format, setFormat] = useState<"inline" | "separate" | "markdown">(
    "inline"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuestionsSubmit(questions, answers, format);
  };

  const getPlaceholder = () => {
    switch (format) {
      case "inline":
        return `Paste your MCQ questions with answers here...\nExample for correct Input format:\n1. Which term refers to application menus and modules which you may want to access quickly and often?\nA. Breadcrumb\nB. Favorite\nC. Tag\nD. Bookmark\nAns: B\n\n2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)\nA. Most recent update\nB. Popularity\nC. Relevancy\nD. Manager assignment\nE. Number of views\nAns: A,C,E`;
      case "separate":
        return {
          questions: `Paste your MCQ questions here...\nExample for correct Input format for question:\n1. Which term refers to application menus and modules which you may want to access quickly and often?\nA. Breadcrumb\nB. Favorite\nC. Tag\nD. Bookmark\n\n2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)\nA. Most recent update\nB. Popularity\nC. Relevancy\nD. Manager assignment\nE. Number of views`,
          answers: `Paste your answers here...\nExample for correct Input format for question:\nAns: 1. B; 2. A,C,E`,
        };
      case "markdown":
        return `Paste your MCQ questions with answers here...\nuse symbol ! for marking correct options,\nExample for correct Input format:\n1. Which term refers to application menus and modules which you may want to access quickly and often?\nA. Breadcrumb\n!B. Favorite\nC. Tag\nD. Bookmark\n\n2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)\n!A. Most recent update\nB. Popularity\n!C. Relevancy\nD. Manager assignment\n!E. Number of views`;
      default:
        return "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="format">Select Input Format</Label>
        <RadioGroup
          id="format"
          value={format}
          onValueChange={(value: "inline" | "separate" | "markdown") =>
            setFormat(value)
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="inline" id="inline" />
            <Label htmlFor="inline">Answers with each question</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="separate" id="separate" />
            <Label htmlFor="separate">Answers at the end</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="markdown" id="markdown" />
            <Label htmlFor="markdown">Answers as Markdown</Label>
          </div>
        </RadioGroup>
      </div>
      <Textarea
        placeholder={
          format === "separate" ? getPlaceholder().questions : getPlaceholder()
        }
        value={questions}
        onChange={(e) => setQuestions(e.target.value)}
        className="min-h-[200px]"
      />
      {format === "separate" && (
        <Textarea
          placeholder={getPlaceholder().answers}
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          className="min-h-[100px]"
        />
      )}
      <Button type="submit">Submit Questions</Button>
    </form>
  );
}
