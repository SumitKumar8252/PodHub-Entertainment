import { useEffect, useState } from "react";
import ThemeContext from "./themeContextBase";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("podhub_theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("podhub_theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-900", "text-gray-100");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-gray-900", "text-gray-100");
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
