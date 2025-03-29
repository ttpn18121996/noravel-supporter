import Collection from '../Collection';

export default class Helper {
  /**
   * Check if a certain value is empty or not.
   *
   * @param {any} value The value to check.
   * @returns {boolean} Whether the value is empty or not.
   */
  static empty(value: any): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else if (Helper.typeOf(value) === 'object') {
      if (typeof value?.count === 'function') {
        return value.count() === 0;
      } else if (typeof value?.isEmpty === 'function') {
        return value.isEmpty();
      } else {
        return Object.keys(value).length === 0;
      }
    }

    return value === undefined || value === null || value === false || value === '' || value === 0;
  }

  /**
   * Returns an array of items from the given value.
   *
   * @param {any} items The value to convert to an array.
   * @returns {unknown[]} An array of items.
   */
  static getArrayableItems(items: any): unknown[] {
    if (Array.isArray(items)) {
      return items;
    } else if (items instanceof Collection) {
      return items.all();
    } else if (
      Helper.typeOf(items) === 'object' &&
      typeof (items as { toArray: () => unknown[] })?.toArray === 'function'
    ) {
      return (items as { toArray: () => unknown[] }).toArray();
    } else if (Helper.typeOf(items) === 'string' && Helper.isJSON(items as string)) {
      return JSON.parse(items as string);
    }

    return [items];
  }

  /**
   * Check if a string value is valid JSON.
   *
   * @param {string} value The string to check.
   * @returns {boolean} True if the string is valid JSON, false otherwise.
   */
  static isJSON(value: string): boolean {
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Determine if a variable is declared and is different than null.
   * @param {*} value The value to check.
   * @returns {boolean} True if the value is set, false otherwise.
   */
  static isset(value: any): boolean {
    return value !== undefined && value !== null;
  }

  /**
   * Converts a query string into an object.
   *
   * @param {string} value The query string to convert.
   * @returns {Record<string, unknown>} The query string as an object.
   */
  static queryStringToObject(value: string): Record<string, unknown> {
    const urlSearchParams = new URLSearchParams(value);
    const entries = urlSearchParams.entries();
    const result: Record<string, unknown> = {};
    for (const [key, value] of entries) {
      result[key] = value;
    }
    return result;
  }

  /**
   * Gets the type of the given value.
   *
   * @param {*} value The value to get the type of.
   * @returns {string} The type of the value.
   *
   * @example
   * Helper.typeOf(''); // 'string'
   * Helper.typeOf(1); // 'number'
   * Helper.typeOf(true); // 'boolean'
   * Helper.typeOf([]); // 'array'
   * Helper.typeOf({}); // 'object'
   * Helper.typeOf(() => {}); // 'function'
   * Helper.typeOf(class {}); // 'constructor'
   */
  static typeOf(value: any): string {
    const result = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

    if (result === 'function' && /^class/i.test(value.toString())) {
      return 'constructor';
    }

    return result;
  }
}
