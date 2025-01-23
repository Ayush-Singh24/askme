import { useEffect, useState } from "react";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { ChevronRight } from "lucide-react";

function App() {
  const [input, setInput] = useState("");

  return (
    <main className="flex flex-col h-screen justify-center items-center gap-10">
      <div className="flex items-center gap-1">
        <h1 className="text-8xl font-aftersmile">Ask</h1>
        <span className="text-8xl font-aftersmile logo-background text-transparent">
          Me?
        </span>
      </div>
      <div className="w-3/4 flex flex-col gap-8">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full"
          placeholder="Enter a topic or generate from context!"
        />
        <Button className="self-center rounded-full">
          <ChevronRight size={80} />
        </Button>
      </div>
    </main>
  );
}

export default App;
