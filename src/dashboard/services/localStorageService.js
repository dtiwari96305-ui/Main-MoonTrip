/**
 * Generic localStorage CRUD wrapper with namespaced keys.
 * All keys are prefixed with 'real_' to avoid collisions with demo data.
 */

const PREFIX = 'real_';

function getKey(collection) {
  return `${PREFIX}${collection}`;
}

export const localStorageService = {
  /**
   * Get all items in a collection.
   */
  getAll(collection) {
    try {
      const raw = localStorage.getItem(getKey(collection));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Get a single item by ID.
   */
  getById(collection, id) {
    const items = this.getAll(collection);
    return items.find(item => item.id === id) || null;
  },

  /**
   * Add a new item. Returns the added item.
   */
  add(collection, item) {
    const items = this.getAll(collection);
    items.push(item);
    localStorage.setItem(getKey(collection), JSON.stringify(items));
    return item;
  },

  /**
   * Update an item by ID. Returns the updated item.
   */
  update(collection, id, updates) {
    const items = this.getAll(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    localStorage.setItem(getKey(collection), JSON.stringify(items));
    return items[index];
  },

  /**
   * Delete an item by ID.
   */
  remove(collection, id) {
    const items = this.getAll(collection);
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(getKey(collection), JSON.stringify(filtered));
  },

  /**
   * Get a single object (not array) — for settings, profile data, etc.
   */
  getObject(key) {
    try {
      const raw = localStorage.getItem(getKey(key));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set a single object.
   */
  setObject(key, value) {
    localStorage.setItem(getKey(key), JSON.stringify(value));
    return value;
  },

  /**
   * Generate a sequential ID for a collection.
   * Format: PREFIX-NNNN (e.g., WL-C-0001, WL-Q-0001)
   */
  nextId(collection, prefix) {
    const items = this.getAll(collection);
    if (items.length === 0) return `${prefix}0001`;
    const nums = items.map(item => {
      const match = item.id.match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const max = Math.max(...nums);
    return `${prefix}${String(max + 1).padStart(4, '0')}`;
  },

  /**
   * Clear all data for a specific collection.
   */
  clear(collection) {
    localStorage.removeItem(getKey(collection));
  },

  /**
   * Clear ALL real dashboard data.
   */
  clearAll() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach(key => localStorage.removeItem(key));
  },
};
