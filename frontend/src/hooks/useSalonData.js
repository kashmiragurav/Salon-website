import { useEffect, useRef, useState } from "react";
import { subscribeSalonSettings } from "../services/settingsService";

export function useSalonSettings() {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    const unsubscribe = subscribeSalonSettings(
      (data) => setState({ data, loading: false, error: null }),
      (error) => { console.error(error); setState({ data: null, loading: false, error }); },
    );
    return unsubscribe;
  }, []);
  return state;
}

export function usePublicCollection(loader) {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  const loaderRef = useRef(loader);

  useEffect(() => {
    let active = true;
    let unsubscribe = null;

    const handleData = (data) => { if (active) setState({ data, loading: false, error: null }); };
    const handleError = (error) => { console.error(error); if (active) setState({ data: [], loading: false, error }); };

    try {
      const result = loaderRef.current();

      if (typeof result === "function") {
        unsubscribe = result(handleData, handleError);
      } else if (result && typeof result.then === "function") {
        result.then(handleData).catch(handleError);
      } else if (Array.isArray(result)) {
        handleData(result);
      }
    } catch (error) {
      handleError(error);
    }

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  return state;
}
