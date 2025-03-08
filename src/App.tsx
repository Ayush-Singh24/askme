import { useState } from "react";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { generateQuiz } from "./lib/services";
import type { QuizQuestion } from "./lib/types";
import QuestionCard from "./components/QuesetionCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

function App() {
  const [input, setInput] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please enter a topic or content to generate questions");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const questions = await generateQuiz(input);
      console.log(questions);
      setQuiz(questions);
      setInput("");
      setHasGenerated(true);

      setCurrentQuestionIndex(0);
      setUserAnswers(new Array(questions.length).fill(null));
      setAnsweredQuestions(new Array(questions.length).fill(false));
      setScore(0);
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
      console.error("Quiz generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selectedOption: string) => {
    if (answeredQuestions[currentQuestionIndex]) return;

    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(newUserAnswers);

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (selectedOption === quiz[currentQuestionIndex].answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        {!hasGenerated && !loading ? (
          <div className="h-full flex flex-col justify-center items-center">
            <div className="flex items-center gap-1 mb-6">
              <h1 className="text-8xl font-aftersmile">Ask</h1>
              <span className="text-8xl font-aftersmile logo-background text-transparent">
                Me?
              </span>
            </div>
            <p className="text-gray-500 text-center">
              Enter a topic below to generate quiz questions
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-6">
            {loading ? (
              <div className="space-y-6">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-4 animate-pulse mx-auto"></div>
                <div className="p-4 border rounded-lg shadow-sm bg-white">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="p-2 border rounded">
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              quiz.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border">
                    <div className="text-sm text-gray-600">
                      Question {currentQuestionIndex + 1} of {quiz.length}
                    </div>
                    <div className="font-medium">
                      Score: {score}/{quiz.length}
                    </div>
                  </div>
                  <QuestionCard
                    question={quiz[currentQuestionIndex]}
                    questionIndex={currentQuestionIndex}
                    onAnswer={handleAnswer}
                    userSelection={userAnswers[currentQuestionIndex]}
                    answered={answeredQuestions[currentQuestionIndex]}
                  />
                  <div className="flex justify-between pt-2">
                    <Button
                      onClick={goToPrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft size={16} /> Previous
                    </Button>
                    <Button
                      onClick={goToNextQuestion}
                      disabled={currentQuestionIndex === quiz.length - 1}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Next <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
      <div className="border-t bg-white p-4">
        <div className="max-w-3xl mx-auto">
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 resize-none"
              placeholder="Enter a topic to generate quiz questions..."
              rows={2}
            />
            <Button
              onClick={handleGenerate}
              className="self-end"
              disabled={loading}
            >
              {loading ? "Generating..." : "Ask"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
