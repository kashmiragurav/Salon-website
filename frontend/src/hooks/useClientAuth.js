import { useContext } from "react";
import { ClientAuthContext } from "../context/clientAuth";

export function useClientAuth() {
  return useContext(ClientAuthContext);
}