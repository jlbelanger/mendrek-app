export default class Cache {
  /**
   * @description Retrieves data from the cache.
   * @param {string} key
   */
  static get(key) {
    const value = localStorage.getItem(key);
    if (value && (value[0] === '{' || value[0] === '[')) {
      try {
        return JSON.parse(value);
      } catch (err) {
        return value;
      }
    }
    return value;
  }

  /**
   * @description Saves data to the cache.
   * @param {string} key
   * @param {any} value
   */
  static set(key, value) {
    let cacheValue = value;
    if (typeof cacheValue === 'object') {
      cacheValue = JSON.stringify(cacheValue);
    }
    localStorage.setItem(key, cacheValue);
  }

  /**
   * @description Deletes all cached data.
   */
  static clear() {
    localStorage.clear();
  }
}
