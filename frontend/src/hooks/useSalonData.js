import { useEffect, useState } from "react";
import { getSalonSettings } from "../services/settingsService";

export function useSalonSettings() {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => { getSalonSettings().then((data) => setState({ data, loading: false, error: null })).catch((error) => { console.error(error); setState({ data: null, loading: false, error }); }); }, []);
  return state;
}

export function usePublicCollection(loader) {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  useEffect(() => { let active = true; loader().then((data) => active && setState({ data, loading: false, error: null })).catch((error) => { console.error(error); active && setState({ data: [], loading: false, error }); }); return () => { active = false; }; }, [loader]);
  return state;
}
