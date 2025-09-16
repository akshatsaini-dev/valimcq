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

// QuestionDisplay: renders MCQs with Test/Revision modes, selection, scoring, and per-question reveal
export function QuestionDisplay({ questions }: QuestionDisplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: Set<string> }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [shownAnswers, setShownAnswers] = useState<{ [key: number]: boolean }>({});
  const [mode, setMode] = useState<"test" | "revision">("test");

  // Toggles selection of an option for a given question (supports multi-select)
  const handleOptionClick = (questionIndex: number, option: string) => {
    setSelectedAnswers((prev) => {
      const newAnswers = new Set(prev[questionIndex] || []);
      newAnswers.has(option) ? newAnswers.delete(option) : newAnswers.add(option);
      return { ...prev, [questionIndex]: newAnswers };
    });
  };

  // Returns true if the option is correct and results are being shown
  const isCorrect = (questionIndex: number, option: string) =>
    showResults && questions[questionIndex].correctAnswers.includes(option.split(".")[0]);

  // Returns true if the option is currently selected
  const isSelected = (questionIndex: number, option: string) =>
    selectedAnswers[questionIndex]?.has(option) || false;

  // Computes total score by exact set equality between selected and correct answers
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

  // Recalculate score when toggling results visibility
  useEffect(() => {
    if (showResults) calculateScore();
  }, [showResults]);

  // Resets selections, results, and per-question reveals for a fresh attempt
  const handleRetest = () => {
    setSelectedAnswers({});
    setScore({ correct: 0, total: 0 });
    setShowResults(false);
    setShownAnswers({});
  };

  // Toggles correct-answer highlighting for a specific question (Revision mode)
  const toggleShowAnswers = (index: number) => {
    setShownAnswers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Mode selection toggle */}
      <div className="flex justify-center mb-8 mt-8">
        <Button
          variant={mode === "test" ? "default" : "outline"}
          onClick={() => setMode("test")}
        >
          Test Mode
        </Button>
        <Button
          variant={mode === "revision" ? "default" : "outline"}
          onClick={() => setMode("revision")}
          className="ml-2"
        >
          Revision Mode
        </Button>
      </div>

      {questions.map((question, index) => (
        <Card key={index} className="p-2 sm:p-4">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl whitespace-normal">
              Question {index + 1}: {question.text}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {question.options.map((option, optionIndex) => {
                const isOptionCorrect = question.correctAnswers.includes(
                  option.split(".")[0]
                );
                const showHighlight = shownAnswers[index] && isOptionCorrect;

                return (
                  <Button
                    key={optionIndex}
                    onClick={() => handleOptionClick(index, option)}
                    variant={isSelected(index, option) ? "default" : "outline"}
                    className={`justify-start break-words whitespace-normal min-h-[3rem] h-auto ${
                      showResults && isCorrect(index, option)
                        ? "bg-green-500 hover:bg-green-600"
                        : showResults && isSelected(index, option)
                        ? "bg-red-500 hover:bg-red-600"
                        : showHighlight
                        ? "bg-yellow-500"
                        : ""
                    }`}
                    aria-pressed={isSelected(index, option)}
                    aria-label={`Option ${option.split(".")[0]}: ${option
                      .split(".")[1]
                      .trim()}`}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>

            {/* Show Answers toggle (Revision Mode only) */}
            {mode === "revision" && (
              <div className="mt-4">
                <Button
                  onClick={() => toggleShowAnswers(index)}
                  variant="outline"
                  size="sm"
                >
                  {shownAnswers[index] ? "Hide Answers" : "Show Answers"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Check Answers (Test Mode only) */}
      {mode === "test" && !showResults && (
        <Button onClick={() => setShowResults(true)} className="w-full pppangaia">
          Check Answers
        </Button>
      )}

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
