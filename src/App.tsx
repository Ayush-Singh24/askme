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
    <main className="flex flex-col h-screen justify-center items-center gap-10">
      <div className="flex items-center gap-1">
        <h1 className="text-8xl font-aftersmile">Ask</h1>
        <span className="text-8xl font-aftersmile logo-background text-transparent">
          Me?
        </span>
      </div>

      <div className="w-3/4 flex flex-col gap-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full"
          placeholder="Enter a topic or generate from context!"
        />

        <Button
          onClick={handleGenerate}
          className="self-center"
          disabled={loading}
        >
          {loading ? "Generating..." : "Ask"}
        </Button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>

      {/* Display generated quiz */}
      {quiz.length > 0 && (
        <div className="w-3/4 mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Quiz</h2>

          <div className="space-y-6">
            {quiz.map((question, qIndex) => (
              <div key={qIndex} className="p-4 border rounded-lg shadow-sm">
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
        </div>
      )}
    </main>
  );
}

export default App;
