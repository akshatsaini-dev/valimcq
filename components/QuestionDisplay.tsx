import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Question {
  text: string;
  options: string[];
  correctAnswers: string[];
}

interface QuestionDisplayProps {
  questions: Question[];
}

export function QuestionDisplay({ questions }: QuestionDisplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: Set<string>;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  const handleOptionClick = (questionIndex: number, option: string) => {
    setSelectedAnswers((prev) => {
      const newAnswers = new Set(prev[questionIndex] || []);
      newAnswers.has(option)
        ? newAnswers.delete(option)
        : newAnswers.add(option);
      return { ...prev, [questionIndex]: newAnswers };
    });
  };

  const isCorrect = (questionIndex: number, option: string) =>
    showResults &&
    questions[questionIndex].correctAnswers.includes(option.split(".")[0]);

  const isSelected = (questionIndex: number, option: string) =>
    selectedAnswers[questionIndex]?.has(option) || false;

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      const selectedOptions = Array.from(selectedAnswers[index] || []).map(
        (option) => option.split(".")[0]
      );
      const correctOptions = question.correctAnswers;
      if (
        selectedOptions.length === correctOptions.length &&
        selectedOptions.every((option) => correctOptions.includes(option))
      ) {
        correctCount++;
      }
    });
    setScore({ correct: correctCount, total: questions.length });
  };

  useEffect(() => {
    if (showResults) calculateScore();
  }, [showResults]);

  // Reset function for retest
  const handleRetest = () => {
    setSelectedAnswers({});
    setScore({ correct: 0, total: 0 });
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <Card key={index} className="p-2 sm:p-4">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl whitespace-normal">
              Question {index + 1}: {question.text}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {question.options.map((option, optionIndex) => (
                <Button
                  key={optionIndex}
                  onClick={() => handleOptionClick(index, option)}
                  variant={isSelected(index, option) ? "default" : "outline"}
                  className={`justify-start break-words whitespace-normal min-h-[3rem] h-auto ${
                    showResults && isCorrect(index, option)
                      ? "bg-green-500 hover:bg-green-600"
                      : showResults && isSelected(index, option)
                      ? "bg-red-500 hover:bg-red-600"
                      : ""
                  }`}
                  aria-pressed={isSelected(index, option)}
                  aria-label={`Option ${option.split(".")[0]}: ${option
                    .split(".")[1]
                    .trim()}`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={() => setShowResults(true)} className="w-full pppangaia">
        Check Answers
      </Button>
      {showResults && (
        <Button onClick={handleRetest} className="w-full pppangaia">
          Retest
        </Button>
      )}
      {showResults && (
        <div className="text-center text-xl font-bold">
          Score: {score.correct}/{score.total}
        </div>
      )}
    </div>
  );
}
