"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import mammoth from "mammoth";

interface QuestionInputProps {
  onQuestionsSubmit: (
    questions: string,
    answers: string,
    format: "inline" | "separate" | "markdown" | "docx"
  ) => void;
}

interface SavedInput {
  questions: string;
  answers: string;
  format: "inline" | "separate" | "markdown" | "docx";
  timestamp: string;
  title?: string; // Added title property
}

export function QuestionInput({ onQuestionsSubmit }: QuestionInputProps) {
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [format, setFormat] = useState<
    "inline" | "separate" | "markdown" | "docx"
  >("markdown");
  const [savedInputs, setSavedInputs] = useState<SavedInput[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>(""); // Ensure this is always a string

  // Load saved inputs from localStorage on component mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("savedInputs") || "[]");
    setSavedInputs(savedData);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInput: SavedInput = {
      questions,
      answers,
      format,
      timestamp: new Date().toLocaleString(), // Get current system time
      title: newTitle, // Save the title with the input
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
    setNewTitle("");
  };

  const handleLoadInput = (input: SavedInput) => {
    setQuestions(input.questions);
    setAnswers(input.answers);
    setFormat(input.format);
    setNewTitle(input.title || ""); // Load the title into the input if available
  };

  const handleDocxUpload = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      const formattedContent = parseDocxContent(value); // Parse content from DOCX
      setQuestions(formattedContent); // Set parsed questions
      onQuestionsSubmit(formattedContent, "", "docx"); // Pass the content as docx format
    } catch (error) {
      console.error("Error reading .docx file:", error);
      alert("Failed to read the .docx file. Please try again.");
    }
  };

  const parseDocxContent = (content: string): string => {
    // Directly return content as it contains `!` for correct answers
    return content;
  };

  const handleDeleteInput = (index: number) => {
    const updatedInputs = savedInputs.filter((_, i) => i !== index);
    setSavedInputs(updatedInputs);
    localStorage.setItem("savedInputs", JSON.stringify(updatedInputs));
  };

  const handleEditTitle = (index: number) => {
    setEditingIndex(index);
    setNewTitle(savedInputs[index].title || ""); // Ensure we always set a string
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleSubmit = (index: number) => {
    const updatedInputs = savedInputs.map((input, i) =>
      i === index ? { ...input, title: newTitle } : input
    );
    setSavedInputs(updatedInputs);
    localStorage.setItem("savedInputs", JSON.stringify(updatedInputs));
    setEditingIndex(null);
    setNewTitle(""); // Clear new title after saving
  };

  const getPlaceholder = () => {
    switch (format) {
      case "inline":
        return `Paste your MCQ questions with answers here...\nExample for correct Input format:\n \n1. Which term refers to application menus and modules which you may want to access quickly and often?\nA. Breadcrumb\nB. Favorite\nC. Tag\nD. Bookmark\nAns: B\n\n2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)\nA. Most recent update\nB. Popularity\nC. Relevancy\nD. Manager assignment\nE. Number of views\nAns: A,C,E`;
      case "separate":
        return `Paste your MCQ questions here...\nExample for correct Input format for question:\n \n1. Which term refers to application menus and modules which you may want to access quickly and often?\nA. Breadcrumb\nB. Favorite\nC. Tag\nD. Bookmark\n\n2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)\nA. Most recent update\nB. Popularity\nC. Relevancy\nD. Manager assignment\nE. Number of views`;
      case "markdown":
        return `Paste your MCQ questions...\nuse symbol ! for marking correct options,\n \nExample for correct Input format:\n1. Which term refers to application menus and modules which you may want to access quickly and often?\nA. Breadcrumb\n!B. Favorite\nC. Tag\nD. Bookmark\n\n2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)\n!A. Most recent update\nB. Popularity\n!C. Relevancy\nD. Manager assignment\n!E. Number of views`;
      case "docx":
        return `Upload your DOCX file with questions...`;
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
          onValueChange={(value: "inline" | "separate" | "markdown" | "docx") =>
            setFormat(value)
          }
          className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 pt-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="markdown" id="markdown" />
            <Label htmlFor="markdown">! Symbol Marked</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="inline" id="inline" />
            <Label htmlFor="inline">Answers With-Q</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="separate" id="separate" />
            <Label htmlFor="separate">Answers Post-Q</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="docx" id="docx" />
            <Label htmlFor="docx">( ! Symbol Marked ) .docx Import</Label>
          </div>
        </RadioGroup>
      </div>
      {format === "docx" ? (
        <div className="mt-4">
          <Label>Upload .docx file</Label>
          <input
            type="file"
            accept=".docx"
            onChange={(e) => handleDocxUpload(e.target.files?.[0]!)}
            className="block w-full mt-2 border p-2"
          />
        </div>
      ) : (
        <Textarea
          placeholder={getPlaceholder()}
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
          className="min-h-[400px]"
        />
      )}
      {format === "separate" && (
        <Textarea
          placeholder={`Paste your answers here...\nExample for correct Input format for answers:\nAns: 1. B; 2. A,C,E`}
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          className="min-h-[200px]"
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
              className="border p-2 flex justify-between items-center cursor-pointer"
              onClick={() => handleLoadInput(input)}
            >
              <div
                onDoubleClick={() => handleEditTitle(index)}
                className="flex-grow"
              >
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={newTitle} // Always provide a value to prevent controlled/uncontrolled warning
                    onChange={handleTitleChange}
                    onBlur={() => handleTitleSubmit(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTitleSubmit(index);
                    }}
                    className="border p-1 w-full"
                  />
                ) : (
                  <>
                    <p>{input.title || "Untitled"}</p> {/* Display title */}
                    <small className="text-gray-500">
                      {input.format} format - {input.timestamp}
                    </small>
                  </>
                )}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering handleLoadInput when deleting
                  handleDeleteInput(index);
                }}
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
