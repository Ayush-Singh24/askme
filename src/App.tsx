import { useState } from "react";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { generateQuiz } from "./lib/services";
import type { QuizQuestion } from "./lib/types";
import QuestionCard from "./components/QuesetionCard";
import SkeletonLoading from "./components/SkeletonLoading";
import Spinner from "./components/ui/spinner";

function App() {
  const [input, setInput] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

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
      setQuiz(questions);
      setInput("");
      setHasGenerated(true);

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

  const handleAnswer = (questionIndex: number, selectedOption: string) => {
    if (answeredQuestions[questionIndex]) return;

    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIndex] = selectedOption;
    setUserAnswers(newUserAnswers);

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[questionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (selectedOption === quiz[questionIndex].answer) {
      setScore((prevScore) => prevScore + 1);
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
              <div className="space-y-8">
                <div className="bg-white p-3 rounded-lg shadow-sm border flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
                {[...Array(5)].map((_, j) => (
                  <SkeletonLoading key={j} />
                ))}
              </div>
            ) : (
              quiz.length > 0 && (
                <div className="space-y-6">
                  <div className="sticky top-0 z-20 pb-2">
                    <div className="bg-white p-3 rounded-lg shadow-sm border flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {quiz.length} Questions
                      </div>
                      <div className="font-medium">
                        Score: {score}/
                        {answeredQuestions.filter(Boolean).length} answered
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {quiz.map((question, index) => (
                      <div
                        key={index}
                        className="scroll-mt-4"
                        id={`question-${index}`}
                      >
                        <div className="text-sm text-gray-600 mb-2 px-1">
                          Question {index + 1}
                        </div>
                        <QuestionCard
                          question={question}
                          questionIndex={index}
                          onAnswer={(selectedOption) =>
                            handleAnswer(index, selectedOption)
                          }
                          userSelection={userAnswers[index]}
                          answered={answeredQuestions[index]}
                        />
                      </div>
                    ))}
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
              className="self-end w-16"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Ask"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
