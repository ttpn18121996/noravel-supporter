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
   * @param {Object} obj1 The first object to compare.
   * @param {Object} obj2 The second object to compare.
   * @returns {boolean} True if the objects are equal, false if they are not.
   */
  static equals(obj1: { [key: string]: any }, obj2: { [key: string]: any }): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   * Get all of the given object except for a specified object of keys.
   * @param {Object} obj The object to get the item from
   * @param {string|string[]} list List of keys to ignore
   * @returns {Object}
   */
  static except(obj: { [key: string]: any } | null, list: string | string[]): Object {
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
   * @param {Object} obj The object to get the item from.
   * @param {string} keys String containing the path to the item, separated by a "dot".
   * @param {any} defaultValue Default value returned if not found.
   * @returns {any} The value of the specified property.
   */
  static get(obj: { [key: string]: any }, keys: string, defaultValue: any = null): any {
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
   * @param {Object} obj The object to get the item from
   * @param {string} list List of keys to ignore
   * @returns {boolean}
   */
  static has(obj: { [key: string]: any }, keys: string): boolean {
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
   * @param {Object} obj The object to get the item from
   * @param {string|string[]} list List of keys to get
   * @returns {Object}
   */
  static only(obj: { [key: string]: any } | null, list: string | string[]): Object {
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
   * @param {Object} obj The object to loop each property
   * @param {Function} callback
   * @returns {any[]}
   */
  static map(obj: { [key: string]: any } | null, callback: (value: any, key: string) => {}): any[] {
    const result = [];

    if (!obj) return [];

    for (const [key, value] of Object.entries(obj)) {
      result.push(callback(value, key));
    }

    return result;
  }

  /**
   * Clone the object into a new, non-existing instance.
   * @param {Object} obj
   * @returns {Object}
   */
  static replicate(obj: Object): Object {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  }

  /**
   * Set an object item to a given value using "dot" notation.
   * @param {Object} obj The object to set the item from
   * @param {string} keys String containing the path to the item, separated by a "dot"
   * @param {any} value Value to set
   */
  static set(obj: { [key: string]: any }, keys: string, value: any) {
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
   * @param {Object} obj
   * @returns {string}
   */
  static toQueryString(obj: { [key: string]: any } | null): string {
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
