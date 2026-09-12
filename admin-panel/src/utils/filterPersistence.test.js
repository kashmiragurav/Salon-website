import test from 'node:test';
import assert from 'node:assert/strict';

import { getStoredFilters, persistFilters } from './filterPersistence.js';

const makeStorage = () => {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    clear() {
      values.clear();
    },
  };
};

const originalLocalStorage = globalThis.localStorage;

test('persistFilters stores page-specific filter state and removes it when cleared', () => {
  const storage = makeStorage();
  globalThis.localStorage = storage;

  const defaults = { search: '', statusFilter: '', dateFilter: '' };

  persistFilters('appointments', { search: 'alex', statusFilter: 'Confirmed', dateFilter: '2026-09-12' }, defaults);
  assert.deepEqual(getStoredFilters('appointments', defaults), {
    search: 'alex',
    statusFilter: 'Confirmed',
    dateFilter: '2026-09-12',
  });

  persistFilters('appointments', { search: '', statusFilter: '', dateFilter: '' }, defaults);
  assert.deepEqual(getStoredFilters('appointments', defaults), defaults);

  globalThis.localStorage = originalLocalStorage;
});
