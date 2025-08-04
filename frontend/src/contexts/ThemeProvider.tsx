import { createContext, useState, type ReactNode } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType|null>(null);

export default function ThemeProvider({children}:{children : ReactNode}) {
  const [theme,setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  return (
    <ThemeContext.Provider value={{theme, setTheme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}