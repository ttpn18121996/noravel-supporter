import { typeOf } from '.';

export default class Arr extends Array {
  constructor(...items: any[]) {
    super(...items);
  }

  static new(items: any) {
    if (!Array.isArray(items)) {
      items = [items];
    }

    const instance = new Arr();
    instance.push.apply(instance, items);

    return instance;
  }

  /**
   * Creates an array of numbers processing from "start" up to "end" (including "end").
   * @param {number} start The start of the range
   * @param {number|null} end The end of the range.
   * @param {number} step The value to increment or decrement by.
   * @returns {number[]}
   */
  static fillItems(start = 0, end: number | null = null, step = 1): number[] {
    const result = [];
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

    return result;
  }

  /**
   * Collapse the array into a single array.
   * @returns {Arr}
   */
  public collapse(): Arr {
    const items = this.reduce((result: any[], item) => {
      if (!Array.isArray(item)) {
        return result;
      }

      return [...result, ...item];
    }, []);

    return Arr.new(items);
  }

  /**
   * Chunk the array into chunks of the given size.
   * @param {number} size
   * @returns {Arr}
   */
  public chunk(size: number = 1): Arr {
    const items = this.reduce((result: any[], item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!result[chunkIndex]) {
        result[chunkIndex] = [];
      }
      result[chunkIndex].push(item);
      return result;
    }, []);

    return Arr.new(items);
  }

  /**
   * Returns the first element of the array.
   * @returns {unknown} The first element of the array.
   */
  public first(): unknown {
    for (const item of this) {
      return item;
    }
  }

  /**
   * Run a grouping map over the items. The callback should return an array with a single key/value pair.
   * @param {Function} callback Return an array with a single key/value pair.
   * @returns {Object} a new object with the key being the group name and the value being an array of grouped values.
   */
  public mapToGroups(callback: (value: any, key: number) => [key: string, value: any]): { [key: string]: any } {
    return this.reduce((pre, cur, index) => {
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
  public pluck(key: string): Arr {
    const items = this.map(item => (item instanceof Object ? item?.[key] : null)).filter(item => item);

    return Arr.new(items);
  }

  /**
   * Creates an array of numbers processing from "start" up to "end" (including "end").
   * @param {number} start The start of the range
   * @param {number|null} end The end of the range.
   * @param {number} step The value to increment or decrement by.
   * @returns {Arr}
   */
  public range(start = 0, end: number | null = null, step = 1): Arr {
    return Arr.new(Arr.fillItems(start, end, step));
  }

  /**
   * Add elements to ensure the length of the array.
   * @param {number} range Expected array length.
   * @param value The value of the element will be added.
   * @returns {Arr}
   */
  public supplement(range: number, value = null): Arr {
    while (this.length < range) {
      this.push(value);
    }

    return this;
  }

  /**
   * Filter out duplicate elements to ensure that array elements are unique.
   * @param {string} key The key is used to check for a unique value for an array element that is an object.
   * @returns {Arr}
   */
  public unique(key?: string): Arr {
    let items: unknown[];

    if (key) {
      items = [...new Map(this.map(item => [item[key], item])).values()];
    } else {
      items = this.filter((value, index, self) => self.indexOf(value) === index);
    }

    return Arr.new(items);
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
    for (let i = 0; i < this.length; i++) {
      if (typeOf(this[i]) === 'object') {
        result.push({
          [optionKey[0]]: this[i][keyValueEntries[0]],
          [optionKey[1]]: this[i][keyValueEntries[1]],
        });
      } else {
        result.push({
          [optionKey[0]]: i,
          [optionKey[1]]: this[i],
        });
      }
    }
    return result;
  }

  /**
   * Check for empty array.
   * @returns This array is empty.
   */
  public isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Print the array value of this object.
   * @returns {Arr}
   */
  public dump(): this {
    console.log(this);

    return this;
  }
}
