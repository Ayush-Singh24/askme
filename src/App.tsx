import { useTheme } from "./providers/theme-provider";

function App() {
  const { setTheme } = useTheme();
  return <div onClick={() => setTheme("dark")}>hello</div>;
}

export default App;
