import { useState } from "react";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { generateQuiz } from "./lib/services";
import type { QuizQuestion } from "./lib/types";

function App() {
  const [input, setInput] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

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
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
      console.error("Quiz generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get the letter (A, B, C, D) for an option index
  const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

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
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 border rounded-lg shadow-sm bg-white"
                  >
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="p-2 border rounded">
                          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              quiz.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    Quiz Generated!
                  </h2>
                  {quiz.map((question, qIndex) => (
                    <div
                      key={qIndex}
                      className="p-4 border rounded-lg shadow-sm bg-white"
                    >
                      <p className="font-semibold mb-2">
                        {qIndex + 1}. {question.question}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {question.options.map((option, oIndex) => (
                          <div
                            key={oIndex}
                            className={`p-2 rounded border ${
                              option === question.answer
                                ? "bg-green-100 border-green-300"
                                : "bg-gray-50"
                            }`}
                          >
                            {getOptionLetter(oIndex)}) {option}
                            {option === question.answer && (
                              <span className="ml-2 text-green-600 text-sm font-medium">
                                ✓ Correct
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
