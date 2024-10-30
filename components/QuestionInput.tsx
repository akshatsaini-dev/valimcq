"use client";

import { useState, useEffect } from "react";
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

interface SavedInput {
  questions: string;
  answers: string;
  format: "inline" | "separate" | "markdown";
  timestamp: string;
}

export function QuestionInput({ onQuestionsSubmit }: QuestionInputProps) {
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [format, setFormat] = useState<"inline" | "separate" | "markdown">(
    "markdown"
  );
  const [savedInputs, setSavedInputs] = useState<SavedInput[]>([]);

  // Load saved inputs from localStorage on component mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("savedInputs") || "[]");
    setSavedInputs(savedData);
  }, []);

  // Save current input on form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInput: SavedInput = {
      questions,
      answers,
      format,
      timestamp: new Date().toLocaleString(), // Get current system time
    };

    const isDuplicate = savedInputs.some(
      (input) =>
        input.questions === questions &&
        input.answers === answers &&
        input.format === format
    );

    if (!isDuplicate) {
      const updatedInputs = [newInput, ...savedInputs]; // Add new input to the start
      setSavedInputs(updatedInputs);
      localStorage.setItem("savedInputs", JSON.stringify(updatedInputs));
    }

    onQuestionsSubmit(questions, answers, format);
    setQuestions("");
    setAnswers("");
  };

  const handleLoadInput = (input: SavedInput) => {
    setQuestions(input.questions);
    setAnswers(input.answers);
    setFormat(input.format);
  };

  const handleDeleteInput = (index: number) => {
    const updatedInputs = savedInputs.filter((_, i) => i !== index);
    setSavedInputs(updatedInputs);
    localStorage.setItem("savedInputs", JSON.stringify(updatedInputs));
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
        <Label htmlFor="format">Select Input Flow</Label>
        <RadioGroup
          id="format"
          value={format}
          onValueChange={(value: "inline" | "separate" | "markdown") =>
            setFormat(value)
          }
          className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 pt-4"
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
        placeholder={getPlaceholder()}
        value={questions}
        onChange={(e) => setQuestions(e.target.value)}
        className="min-h-[400px]"
      />
      {format === "separate" && (
        <Textarea
          placeholder={`Paste your answers here...\nExample for correct Input format for answers:\nAns: 1. B; 2. A,C,E`}
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          className="min-h-[200px]" // Increased height
        />
      )}
      <div className="flex justify-end">
        <Button type="submit">Submit Questions</Button>
      </div>

      {/* Display saved inputs if there are any */}
      {savedInputs.length > 0 && (
        <div className="space-y-2 pt-4">
          <h3 className="text-lg font-semibold">Saved Inputs:</h3>
          {savedInputs.map((input, index) => (
            <div
              key={index}
              className="border p-2 flex justify-between items-center"
            >
              <div
                onClick={() => handleLoadInput(input)}
                className="cursor-pointer"
              >
                <p>{input.questions.slice(0, 50)}...</p>{" "}
                <small className="text-gray-500">
                  {input.format} format - {input.timestamp}
                </small>
              </div>
              <Button
                onClick={() => handleDeleteInput(index)}
                variant="destructive"
                size="sm"
                className="ml-4"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
