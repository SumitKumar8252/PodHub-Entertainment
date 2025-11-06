import { useContext } from "react";
import ThemeContext from "./themeContextBase";

export default function useTheme() {
  return useContext(ThemeContext);
}
