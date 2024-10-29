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
    format: "inline" | "separate"
  ) => void;
}

export function QuestionInput({ onQuestionsSubmit }: QuestionInputProps) {
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [format, setFormat] = useState<"inline" | "separate">("inline");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuestionsSubmit(questions, answers, format);
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
        placeholder="Paste your MCQ questions here..."
        value={questions}
        onChange={(e) => setQuestions(e.target.value)}
        className="min-h-[200px]"
      />
      {format === "separate" && (
        <Textarea
          placeholder="Paste your answers here..."
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          className="min-h-[100px]"
        />
      )}
      <Button type="submit">Submit Questions</Button>
    </form>
  );
}
