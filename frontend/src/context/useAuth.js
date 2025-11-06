import { useContext } from "react";
import AuthContext from "./authContextBase";

export default function useAuth() {
  return useContext(AuthContext);
}
