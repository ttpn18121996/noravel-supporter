import { empty, isset, typeOf } from '.';
import Str from './Str';

class Obj {
  /**
   * Combine a key list and a value list into one object.
   * @param {string[]} keys List of keys to combine.
   * @param {any[]} values List of values to combine.
   * @returns {Object} A new object with specified properties derived from another object.
   */
  static combine(keys: string[], values: any[]): Object {
    if (keys.length < values.length) {
      for (let i = 0; i < values.length - keys.length; i++) {
        keys.push(`key_${i}`);
      }
    }
    return keys.reduce(
      (pre, cur, curIndex) => ({
        ...pre,
        [cur]: values?.[curIndex] ? values[curIndex] : null,
      }),
      {},
    );
  }

  /**
   * Compare two objects to determine if they are equal.
   * @param {Record<string, any>} obj1 The first object to compare.
   * @param {Record<string, any>} obj2 The second object to compare.
   * @returns {boolean} True if the objects are equal, false if they are not.
   */
  static equals(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   * Get all of the given object except for a specified object of keys.
   * @param {Record<string, any> | null} obj The object to get the item from
   * @param {string | string[]} list List of keys to ignore
   * @returns {Record<string, any>}
   */
  static except(obj: Record<string, any> | null, list: string | string[]): Record<string, any> {
    if (!obj) return {};

    return Object.keys(obj).reduce((pre, cur) => {
      if ((typeOf(list) === 'string' && cur !== list) || (Array.isArray(list) && !list.includes(cur))) {
        return { ...pre, [cur]: obj[cur] };
      }

      return { ...pre };
    }, {});
  }

  /**
   * Get an item from an array using "dot" notation.
   * @param {Record<string, any>} obj The object to get the item from.
   * @param {string} keys String containing the path to the item, separated by a "dot".
   * @param {any} defaultValue Default value returned if not found.
   * @returns {any} The value of the specified property.
   */
  static get(obj: Record<string, any>, keys: string, defaultValue: any = null): any {
    let result = obj;
    keys.split('.').forEach(key => {
      if (!empty(key)) {
        result = result?.[key];
      }
    });

    if (!isset(result)) {
      if (typeOf(defaultValue) === 'function') return defaultValue();
      return defaultValue !== undefined ? defaultValue : null;
    }
    return result;
  }

  /**
   * Deeply check whether the properties exist or not.
   * @param {Record<string, any>} obj The object to get the item from
   * @param {string} list List of keys to ignore
   * @returns {boolean}
   */
  static has(obj: Record<string, any>, keys: string): boolean {
    let result = obj;
    for (const key of keys.split('.')) {
      if (!empty(key)) {
        result = result?.[key];

        if (typeOf(result) === 'undefined') {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Get a subset of the items from the given object.
   * @param {Record<string, any> | null} obj The object to get the item from
   * @param {string|string[]} list List of keys to get
   * @returns {Record<string, any>}
   */
  static only(obj: Record<string, any> | null, list: string | string[]): Record<string, any> {
    if (!obj) return {};

    return Object.keys(obj).reduce((pre, cur: string) => {
      if ((typeOf(list) === 'string' && cur === list) || (Array.isArray(list) && list.includes(cur))) {
        return { ...pre, [cur]: obj[cur] };
      }

      return { ...pre };
    }, {});
  }

  /**
   * Run a map over each of the properties in the object.
   * @param {Record<string, any> | null} obj The object to loop each property
   * @param {Function} callback
   * @returns {any[]}
   */
  static map(obj: Record<string, any> | null, callback: (value: any, key: string) => {}): any[] {
    const result = [];

    if (!obj) return [];

    for (const [key, value] of Object.entries(obj)) {
      result.push(callback(value, key));
    }

    return result;
  }

  /**
   * Clone the object into a new, non-existing instance.
   * @param {Record<string, any>} obj
   * @returns {Record<string, any>}
   */
  static replicate(obj: Record<string, any>): Record<string, any> {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  }

  /**
   * Set an object item to a given value using "dot" notation.
   * @param {Record<string, any>} obj The object to set the item from
   * @param {string} keys String containing the path to the item, separated by a "dot"
   * @param {any} value Value to set
   */
  static set(obj: Record<string, any>, keys: string, value: any) {
    const keyList = keys.split('.');
    let currentObj = obj;
    for (let i = 0; i < keyList.length - 1; i++) {
      const key = keyList[i];
      if (!currentObj[key] || typeof currentObj[key] !== 'object') {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[keyList[keyList.length - 1]] = value;
  }

  /**
   * Convert an object to a query string with each property.
   * @param {Record<string, any> | null} obj
   * @returns {string}
   */
  static toQueryString(obj: Record<string, any> | null): string {
    const urlSearchParams = new URLSearchParams();
    for (const key in obj) {
      if (!isset(obj[key])) {
        continue;
      }

      if (typeOf(obj[key]) === 'object' || typeOf(obj[key]) === 'array') {
        const entries = Object.entries<string>(obj[key]);

        for (const [field, value] of entries) {
          if (!isset(value) || value === '') {
            continue;
          }
          urlSearchParams.append(`${key}[${field}]`, value);
        }
      } else {
        urlSearchParams.append(key, new Str(obj[key]).toString());
      }
    }

    const result = urlSearchParams.toString();

    return empty(result) ? '' : `?${result}`;
  }
}

export default Obj;
