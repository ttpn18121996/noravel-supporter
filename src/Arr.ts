import { typeOf } from '.';

export default class Arr {
  private value: any[];

  constructor(value?: any[] | null) {
    this.value = value ?? [];
  }

  /**
   * Chunk the array into chunks of the given size.
   * @param {number} size
   * @returns {Arr}
   */
  public chunk(size: number = 1): this {
    let temp = [...this.value];
    this.value = temp.reduce((result: any[], item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!result[chunkIndex]) {
        result[chunkIndex] = [];
      }
      result[chunkIndex].push(item);
      return result;
    }, []);

    return this;
  }

  /**
   * Returns the first element of the array.
   * @returns {any} The first element of the array.
   */
  public first(): any {
    for (const item of this.value) {
      return item;
    }
  }

  /**
   * Run a map over each of the items in the array.
   * @param {Function} callback Function execute for each element in the array.
   * @returns {any[]} A new array populated with the results of calling
   * a provided function on every element in the calling array.
   */
  public map(callback: (value: any, key: number) => {}): any[] {
    const result = [];

    for (let i = 0; i < this.value.length; i++) {
      result.push(callback(this.value[i], i));
    }

    return result;
  }

  /**
   * Run a grouping map over the items. The callback should return an array with a single key/value pair.
   * @param {Function} callback Return an array with a single key/value pair.
   * @returns {Object} a new object with the key being the group name and the value being an array of grouped values.
   */
  public mapToGroups(callback: (value: any, key: number) => [key: string, value: any]): { [key: string]: any } {
    return this.value.reduce((pre, cur, index) => {
      const pair = callback(cur, index);

      if (!Array.isArray(pair) || pair.length < 2) {
        throw new RangeError('The callback should return an array with a single key/value pair.');
      }

      const [key, value] = pair;

      if (pre[key] === undefined) {
        pre[key] = [value];
      } else {
        pre[key].push(value);
      }

      return pre;
    }, {});
  }

  /**
   * Pluck an array of values from an array.
   * @param {string} key The key name needs to be taken from another array.
   * @returns {Arr}
   */
  public pluck(key: string): this {
    this.value = this.value.map(item => (item instanceof Object ? item?.[key] : null)).filter(item => item);

    return this;
  }

  /**
   * Creates an array of numbers processing from "start" up to "end" (including "end").
   * @param {number} start The start of the range
   * @param {number|null} end The end of the range.
   * @param {number} step The value to increment or decrement by.
   * @returns {Arr}
   */
  public range(start = 0, end: number | null = null, step = 1): this {
    let result = [];
    if (end === null) {
      if (start > 0) {
        for (let i = 0; i < start; i++) {
          result.push(i + 1);
        }
      } else if (start < 0) {
        for (let i = start; i < 0; i++) {
          result.push(i);
        }
      }
    } else if (end !== null) {
      if (end > start) {
        for (let i = start; i <= end; i += step) {
          result.push(i);
        }
      } else if (end < start) {
        for (let i = start; i >= end; i -= step) {
          result.push(i);
        }
      } else {
        result.push(start);
      }
    }

    this.value = result;

    return this;
  }

  /**
   * Add elements to ensure the length of the array.
   * @param {number} range Expected array length.
   * @param value The value of the element will be added.
   * @returns {Arr}
   */
  public supplement(range: number, value = null): this {
    while (this.value.length < range) {
      this.value.push(value);
    }

    return this;
  }

  /**
   * Filter out duplicate elements to ensure that array elements are unique.
   * @param {string} key The key is used to check for a unique value for an array element that is an object.
   * @returns {Arr}
   */
  public unique(key?: string): this {
    if (key) {
      this.value = [...new Map(this.value.map(item => [item[key], item])).values()];
    } else {
      this.value = this.value.filter((value, index, self) => self.indexOf(value) === index);
    }

    return this;
  }

  /**
   * Convert the array to options of a selection.
   * @param {string[]} keyValueEntries
   * @param {string[]} optionKey
   * @returns List of options.
   */
  public toSelectOptions(
    keyValueEntries: string[] = ['key', 'value'],
    optionKey: string[] = ['value', 'label'],
  ): { [key: string]: string }[] {
    const result = [];
    for (let i = 0; i < this.value.length; i++) {
      if (typeOf(this.value[i]) === 'object') {
        result.push({
          [optionKey[0]]: this.value[i][keyValueEntries[0]],
          [optionKey[1]]: this.value[i][keyValueEntries[1]],
        });
      } else {
        result.push({
          [optionKey[0]]: i,
          [optionKey[1]]: this.value[i],
        });
      }
    }
    return result;
  }

  /**
   * Count the element of this array.
   * @returns Total element.
   */
  public count(): number {
    return this.value.length;
  }

  /**
   * Check for empty array.
   * @returns This array is empty.
   */
  public isEmpty(): boolean {
    return this.count() === 0;
  }

  /**
   * Gets the array value of this object.
   * @returns An array value of this object.
   */
  public toArray(): any[] {
    return Array.isArray(this.value) ? this.value : Object.values(this.value);
  }

  /**
   * The alias of the toArray method.
   * @returns An array value of this object.
   */
  public get(): any[] {
    return this.toArray();
  }
}
