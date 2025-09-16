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
  title?: string; // Optional user-defined title for saved entries
}

// QuestionInput: captures questions/answers in multiple formats, supports DOCX import, and manages saved sessions
export function QuestionInput({ onQuestionsSubmit }: QuestionInputProps) {
  const [questions, setQuestions] = useState("");
  const [answers, setAnswers] = useState("");
  const [format, setFormat] = useState<"inline" | "separate" | "markdown" | "docx">("markdown");
  const [savedInputs, setSavedInputs] = useState<SavedInput[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>(""); // Title input for saved entry
  const [mounted, setMounted] = useState(false); // Avoid SSR hydration mismatch

  // Load saved inputs from localStorage when the component mounts
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("savedInputs") || "[]");
    setSavedInputs(savedData);
    setMounted(true);
  }, []);

  // Handle form submission: save entry (deduped) and forward to parent for parsing/render
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInput: SavedInput = {
      questions,
      answers,
      format,
      timestamp: new Date().toLocaleString(),
      title: newTitle,
    };

    const isDuplicate = savedInputs.some(
      (input) =>
        input.questions === questions &&
        input.answers === answers &&
        input.format === format
    );

    if (!isDuplicate) {
      const updatedInputs = [newInput, ...savedInputs];
      setSavedInputs(updatedInputs);
      localStorage.setItem("savedInputs", JSON.stringify(updatedInputs));
    }

    onQuestionsSubmit(questions, answers, format);
    setQuestions("");
    setAnswers("");
    setNewTitle("");
  };

  // Load a previously saved input back into the form
  const handleLoadInput = (input: SavedInput) => {
    setQuestions(input.questions);
    setAnswers(input.answers);
    setFormat(input.format);
    setNewTitle(input.title || "");
  };

  // Handle .docx upload, extract raw text, and submit as docx flow
  const handleDocxUpload = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      const formattedContent = parseDocxContent(value);
      setQuestions(formattedContent);
      onQuestionsSubmit(formattedContent, "", "docx");
    } catch (error) {
      console.error("Error reading .docx file:", error);
      alert("Failed to read the .docx file. Please try again.");
    }
  };

  // Parse DOCX text (here: pass-through since '!' marks are already included)
  const parseDocxContent = (content: string): string => {
    return content;
  };

  // Delete a saved input by index and persist the change
  const handleDeleteInput = (index: number) => {
    const updatedInputs = savedInputs.filter((_, i) => i !== index);
    setSavedInputs(updatedInputs);
    localStorage.setItem("savedInputs", JSON.stringify(updatedInputs));
  };

  // Begin editing a saved input's title
  const handleEditTitle = (index: number) => {
    setEditingIndex(index);
    setNewTitle(savedInputs[index].title || "");
  };

  // Track in-progress title edits
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  // Save the edited title for a specific saved input
  const handleTitleSubmit = (index: number) => {
    const updatedInputs = savedInputs.map((input, i) =>
      i === index ? { ...input, title: newTitle } : input
    );
    setSavedInputs(updatedInputs);
    localStorage.setItem("savedInputs", JSON.stringify(updatedInputs));
    setEditingIndex(null);
    setNewTitle("");
  };

  // Provide example placeholders tailored to the selected input format
  const getPlaceholder = () => {
    switch (format) {
      case "inline":
        return `Paste your MCQ questions with answers here...
Example for correct Input format:
 
1. Which term refers to application menus and modules which you may want to access quickly and often?
A. Breadcrumb
B. Favorite
C. Tag
D. Bookmark
Ans: B

2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)
A. Most recent update
B. Popularity
C. Relevancy
D. Manager assignment
E. Number of views
Ans: A,C,E`;
      case "separate":
        return `Paste your MCQ questions here...
Example for correct Input format for question:
 
1. Which term refers to application menus and modules which you may want to access quickly and often?
A. Breadcrumb
B. Favorite
C. Tag
D. Bookmark

2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)
A. Most recent update
B. Popularity
C. Relevancy
D. Manager assignment
E. Number of views`;
      case "markdown":
        return `Paste your MCQ questions...
use symbol ! for marking correct options,
 
Example for correct Input format:
1. Which term refers to application menus and modules which you may want to access quickly and often?
A. Breadcrumb
!B. Favorite
C. Tag
D. Bookmark

2. Knowledge Base Search results can be sorted by which of the following? (Choose three.)
!A. Most recent update
B. Popularity
!C. Relevancy
D. Manager assignment
!E. Number of views`;
      case "docx":
        return `Upload your DOCX file with questions...`;
      default:
        return "";
    }
  };

  // Avoid rendering on server to prevent hydration mismatch with localStorage usage
  if (!mounted) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input flow selector */}
      <div>
        <Label
          htmlFor="format"
          className="font-medium text-xl"
          style={{ fontFamily: "PPPangaia" }}
        >
          Select Input Flow -
        </Label>
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

      {/* Questions input or DOCX uploader, based on selected flow */}
      {format === "docx" ? (
        <div className="mt-4">
          <Label>
            Upload .docx file with same format as "! Symbol Marked" input flow
          </Label>
          <input
            type="file"
            accept=".docx"
            onChange={(e) =>
              e.target.files && handleDocxUpload(e.target.files[0])
            }
            className="block w-full mt-2 border p-2"
          />
        </div>
      ) : (
        <Textarea
          placeholder={getPlaceholder()}
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
          className="min-h:[400px] min-h-[400px]"
        />
      )}

      {/* Separate answers textarea when using "separate" format */}
      {format === "separate" && (
        <Textarea
          placeholder={`Paste your answers here...
Example for correct Input format for answers:
Ans: 1. B; 2. A,C,E`}
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          className="min-h-[200px]"
        />
      )}

      {/* Title and submit controls */}
      <div className="flex flex-col items-end w-full">
        <div className="mt-4 w-full">
          <Label>Save Title (Optional)</Label>
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            placeholder="Enter the title (optional)"
            className="w-full px-4 py-2 mt-2 border rounded-md bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>

        <Button type="submit" className="mt-4 self-end">
          Save & Submit
        </Button>
      </div>

      {/* Saved inputs list with load/delete/edit title actions */}
      <div className="mt-4">
        <h3
          className="text-xl font-medium mt-6 mb-6 text-red-500"
          style={{ fontFamily: "PPPangaia" }}
        >
          Saved Inputs:
        </h3>

        <ul>
          {savedInputs.map((input, index) => (
            <li key={index} className="mb-2">
              <strong>{input.title || `Untitled - ${index + 1}`}</strong>{" "}
              (Added: {input.timestamp})
              <div>
                <Button variant="link" onClick={() => handleLoadInput(input)}>
                  Load
                </Button>
                <Button variant="link" onClick={() => handleDeleteInput(index)}>
                  Delete
                </Button>
                <Button variant="link" onClick={() => handleEditTitle(index)}>
                  Edit Title
                </Button>
              </div>

              {editingIndex === index && (
                <div>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={handleTitleChange}
                    placeholder="Enter new title"
                    className="mt-2 border rounded-md p-2"
                  />
                  <Button
                    onClick={() => handleTitleSubmit(index)}
                    className="mt-2"
                  >
                    Save Title
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
