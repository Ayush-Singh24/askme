import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";

type ThemeType = "dark" | "light";

interface ThemeContextInterface {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeProviderContext = createContext<ThemeContextInterface | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const storedTheme = localStorage.getItem("askme-ui-theme") as ThemeType;
  const [theme, setTheme] = useState<ThemeType>(
    storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light",
  );

  console.log(theme);

  useEffect(() => {
    localStorage.setItem("askme-ui-theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context)
    throw new Error(
      "useTheme must be used within the boundary of ThemeProvider!",
    );
  return context;
};
