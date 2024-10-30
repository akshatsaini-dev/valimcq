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

export function QuestionInput({ onQuestionsSubmit }: QuestionInputProps) {
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [format, setFormat] = useState<"inline" | "separate" | "markdown">(
    "markdown"
  );
  const [savedInputs, setSavedInputs] = useState([]);

  // Load saved inputs from localStorage on component mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("savedInputs") || "[]");
    setSavedInputs(savedData);
  }, []);

  // Save current input on form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInput = { questions, answers, format };

    // Check if the input already exists in savedInputs
    const isDuplicate = savedInputs.some(
      (input) =>
        input.questions === questions &&
        input.answers === answers &&
        input.format === format
    );

    // If it's not a duplicate, save it
    if (!isDuplicate) {
      const updatedInputs = [...savedInputs, newInput];

      // Update state and save to localStorage
      setSavedInputs(updatedInputs);
      localStorage.setItem("savedInputs", JSON.stringify(updatedInputs));
    }

    // Call onQuestionsSubmit callback and clear inputs
    onQuestionsSubmit(questions, answers, format);
    setQuestions("");
    setAnswers("");
  };

  // Re-populate form fields when clicking on a saved input
  const handleLoadInput = (input) => {
    setQuestions(input.questions);
    setAnswers(input.answers);
    setFormat(input.format);
  };

  // Delete a specific saved input
  const handleDeleteInput = (index: number) => {
    const updatedInputs = savedInputs.filter((_, i) => i !== index);
    setSavedInputs(updatedInputs);
    localStorage.setItem("savedInputs", JSON.stringify(updatedInputs));
  };

  const getPlaceholder = () => {
    switch (format) {
      case "inline":
        return `Paste your MCQ questions with answers here...\nExample format:\n \n1. Question...\nA. Option\nB. Option\nAns: B`;
      case "separate":
        return `Paste your MCQ questions here...\nExample format:\n \n1. Question...\nA. Option\nB. Option`;
      case "markdown":
        return `Paste your MCQ questions...\nUse symbol ! for marking correct options,\nExample:\n1. Question...\n!A. Correct\nB. Option`;
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
          placeholder="Paste your answers here..."
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          className="min-h-[200px]"
        />
      )}
      <div className="flex justify-end">
        <Button type="submit">Submit Questions</Button>
      </div>

      {/* Display saved inputs */}
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
              {/* Display preview of saved question */}
              <small className="text-gray-500">{input.format} format</small>
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
    </form>
  );
}
