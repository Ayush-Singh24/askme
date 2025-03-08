import { QuizQuestion } from "../lib/types";

type QuestionCardProps = {
  question: QuizQuestion;
  questionIndex: number;
  onAnswer: (selectedOption: string) => void;
  userSelection: string | null;
  answered: boolean;
};

export default function QuestionCard({
  question,
  answered,
  onAnswer,
  userSelection,
  questionIndex,
}: QuestionCardProps) {
  const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

  const getOptionStyle = (option: string) => {
    if (!answered) return "bg-gray-50"; // Not answered yet

    if (option === question.answer) {
      return "bg-green-100 border-green-300"; // Correct answer
    }

    if (option === userSelection && userSelection !== question.answer) {
      return "bg-red-100 border-red-300"; // User's wrong selection
    }

    return "bg-gray-50"; // Other options
  };
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <p className="font-semibold mb-2">
        {questionIndex + 1}. {question.question}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        {question.options.map((option, oIndex) => (
          <div
            key={oIndex}
            className={`p-2 rounded border ${getOptionStyle(option)} 
              ${!answered ? "cursor-pointer hover:bg-gray-100" : ""}`}
            onClick={() => !answered && onAnswer(option)}
          >
            {getOptionLetter(oIndex)}) {option}
            {answered && option === question.answer && (
              <span className="ml-2 text-green-600 text-sm font-medium">
                ✓ Correct
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
