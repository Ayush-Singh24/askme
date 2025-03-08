import Groq from "groq-sdk";
import { QuizQuestion } from "./types";
import { schema } from "./schema";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateQuiz(topic: string): Promise<QuizQuestion[]> {
  const jsonSchema = JSON.stringify(schema, null, 4);

  const chat_completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a quiz generator that creates multiple-choice questions.
Generate exactly 10 quiz questions based on the user's topic or content.
For each question, provide 4 options with only one correct answer.
Make sure the questions cover different aspects of the topic and vary in difficulty.
The output must be a JSON array that follows this schema: ${jsonSchema}`,
      },
      {
        role: "user",
        content: `Create a quiz from the given content: ${topic}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2, // Slight randomness for variety
    stream: false,
    response_format: { type: "json_object" },
  });

  if (!chat_completion.choices[0].message.content) {
    throw new Error("Error while generating");
  }

  return JSON.parse(chat_completion.choices[0].message.content)
    .items as QuizQuestion[];
}
