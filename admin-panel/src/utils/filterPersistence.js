const STORAGE_PREFIX = 'admin.filter.';

const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage;
  }

  return null;
};

const isPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

export const getStoredFilters = (pageKey, defaults = {}) => {
  const storage = getStorage();
  if (!storage) {
    return defaults;
  }

  const raw = storage.getItem(`${STORAGE_PREFIX}${pageKey}`);
  if (!raw) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) {
      return defaults;
    }

    return {
      ...defaults,
      ...parsed,
    };
  } catch {
    return defaults;
  }
};

export const persistFilters = (pageKey, rawState, defaults = {}) => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const nextState = { ...defaults, ...rawState };
  const hasAnyValue = Object.values(nextState).some((value) => value !== '' && value !== null && value !== undefined && value !== 'all');
  const storageKey = `${STORAGE_PREFIX}${pageKey}`;

  if (!hasAnyValue) {
    storage.removeItem(storageKey);
    return;
  }

  storage.setItem(storageKey, JSON.stringify(nextState));
};
