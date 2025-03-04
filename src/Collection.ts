import Obj from './Obj';
import Arr from './Arr';
import Helper from './Support/Helper';
import { Arrayable, Jsonable, Stringable } from './types';

export default class Collection<T> implements Arrayable<T>, Jsonable, Stringable {
  private items: T[] = [];

  public constructor(items: T[] = []) {
    this.items = [...items];
  }

  /**
   * Retrieve all of the items in the collection.
   *
   * @returns {T[]} the underlying array
   */
  public all(): T[] {
    return this.items;
  }

  /**
   * Chunk the underlying array into chunks of the given size.
   *
   * @param {number} [size=1] The size of each chunk
   * @returns {Collection<unknown> | this} The chunked collection or the current collection if empty
   */
  public chunk(size: number = 1): Collection<unknown> | this {
    if (!this.count()) {
      return this;
    }

    const items = this.items.reduce((result: any[], item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!result[chunkIndex]) {
        result[chunkIndex] = [];
      }
      result[chunkIndex].push(item);
      return result;
    }, []);

    return new Collection<(typeof items)[0]>(items);
  }

  /**
   * Collapse the collection of arrays into a single, flat collection.
   *
   * @returns {Collection<unknown> | this}
   * @chainable
   */
  public collapse(): Collection<unknown> | this {
    if (!this.count()) {
      return this;
    }

    const items = this.items.reduce((result: unknown[], item: T) => {
      if (!Array.isArray(item)) {
        return result;
      }

      return [...result, ...item];
    }, []);

    return new Collection<(typeof items)[0]>(items);
  }

  /**
   * Get a shallow copy of this collection.
   *
   * @returns {Collection<T>}
   */
  public collect(): Collection<T> {
    return new Collection<T>([...this.items]);
  }

  /**
   * Concatenate the underlying array with the given array or collection and return a new collection.
   *
   * @param {Collection<T>|unknown[]} items The array to concatenate with
   * @returns {Collection<T>}
   * @chainable
   */
  public concat(items: Collection<T> | unknown[]): Collection<T> {
    if (items instanceof Collection) {
      items = items.all();
    }

    return new Collection([...this.items, ...(<[]>items)]);
  }

  /**
   * Determines whether the collection contains a particular value.
   *
   * @param {Function | unknown} callback A function that takes in a value, index and array and returns a boolean.
   * @returns {boolean}
   */
  public contains(callback: (value: T, index: number, array: T[]) => unknown | unknown): boolean {
    if (typeof callback !== 'function') {
      return this.items.some((value: T) => value === callback);
    }

    return this.items.some(callback);
  }

  /**
   * Returns the total number of items in the collection.
   *
   * @returns {number}
   */
  public count(): number {
    return this.items.length;
  }

  /**
   * Cross join the given arrays.
   *
   * @param {...any[]} args The arrays to cross join
   * @returns {Collection<unknown>}
   * @chainable
   */
  public crossJoin(...args: any[]): Collection<unknown> {
    return new Collection(
      Arr.crossJoin(
        this.items,
        ...args.map(arg => (arg instanceof Collection ? arg.all() : Collection.wrap(arg).all())),
      ),
    );
  }

  /**
   * Get the items in the collection that are not present in the given items.
   *
   * @param {Collection<T>|unknown[]} items The items to compare against
   * @returns {Collection<T>}
   * @chainable
   */
  public diff(items: Collection<T> | unknown[]): Collection<T> {
    if (items instanceof Collection) {
      items = items.all();
    }

    return new Collection(this.items.filter(item => !items.includes(item)));
  }

  /**
   * Logs the items in the collection to the console.
   */
  public dump(): void {
    console.log(this.items);
  }

  /**
   * Iterates over the items in the collection and calls the provided callback for each item.
   * If the callback returns a boolean false, iteration will be stopped.
   *
   * @param {Function} callback A function that takes in a value, index and array and returns a boolean (or undefined).
   * @returns {this}
   * @chainable
   */
  public each(callback: (value: T, index: number, array: T[]) => boolean | undefined): this {
    for (let i = 0; i < this.items.length; i++) {
      if (callback(this.items[i], i, this.items) === false) {
        break;
      }
    }

    return this;
  }

  /**
   * Determines whether all elements of the collection satisfy the provided testing function.
   *
   * @param {Function} callback A function that takes in a value, index and array and returns a boolean.
   * @returns {boolean}
   */
  public every(callback: (value: T, index: number, array: T[]) => unknown): boolean {
    return this.items.every(callback);
  }

  /**
   * Creates a new collection with all elements that pass the test implemented by the provided function.
   *
   * @param {Function} callback A function that takes in a value, index and array and returns a boolean.
   * @returns {Collection<T>}
   */
  public filter(callback: (value: T, index: number, array: T[]) => unknown): Collection<T> {
    if (callback !== undefined) {
      return new Collection(this.items.filter(callback));
    }

    return new Collection(this.items.filter(item => !Helper.empty(item)));
  }

  /**
   * Get the first element in the collection.
   * If a callback is provided, the method will return the first element that passes the test.
   *
   * @param {Function} [callback] A function that takes in a value, index and array and returns a boolean.
   * @returns {unknown} The first element in the collection, or undefined if the collection is empty.
   */
  public first(callback?: (value: T, index: number, array: T[]) => unknown): unknown {
    let items = this.items;

    if (callback !== undefined) {
      items = this.items.filter(callback);
    }

    for (const item of items) {
      return item;
    }

    return undefined;
  }

  /**
   * "Paginate" the collection by slicing it into a smaller collection.
   *
   * @param {number} page The page number.
   * @param {number} [perPage=10] The number of items per page.
   * @returns {Collection<T>}
   */
  public forPage(page: number, perPage: number = 10): Collection<T> {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return new Collection<T>(this.items.slice(start, end));
  }

  /**
   * Groups the items in the collection by a given key.
   *
   * @param {string} key The key to group by.
   * @returns {Record<string, T[]>} A record where the keys are the group names and the values are an array of grouped items.
   */
  public groupBy(key: string): Record<string, T[]> {
    return this.items.reduce<Record<string, T[]>>((pre, cur: T) => {
      const groupName = typeof cur === 'object' && cur !== null ? (cur[key as keyof T] as string) : (cur as string);

      if (pre[groupName] === undefined) {
        pre[groupName] = [];
      }

      pre[groupName].push(cur);

      return pre;
    }, {});
  }

  /**
   * Returns a new collection that contains only the items that are present in both the current collection and the given items.
   *
   * @param {Collection<T>|unknown[]} items The items to compare against
   * @returns {Collection<T>}
   */
  public intersect(items: Collection<T> | unknown[]): Collection<T> {
    if (items instanceof Collection) {
      items = items.all();
    }

    return new Collection<T>(this.items.filter(item => items.includes(item)));
  }

  /**
   * Check if the collection is empty.
   *
   * @returns {boolean} This collection is empty.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Check if the collection is not empty.
   *
   * @returns {boolean} This collection is not empty.
   */
  public isNotEmpty(): boolean {
    return this.items.length > 0;
  }

  /**
   * Get the last element of the collection.
   *
   * @param {Function} [callback] A function that takes in a value, index and array and returns a boolean.
   * @returns {unknown} The last element of the collection.
   */
  public last(callback?: (value: T, index: number, array: T[]) => unknown): unknown {
    let items = this.items;

    if (callback !== undefined) {
      items = items.filter(callback);
    }

    return items[items.length - 1];
  }

  /**
   * Creates a new collection with the results of applying the given callback to every item in this collection.
   *
   * @param {Function} callback A function that takes in a value, index and array and returns a new value.
   * @returns {Collection<unknown>} A new collection with the results of applying the given callback.
   */
  public map(callback: (value: T, index: number, array: T[]) => unknown): Collection<unknown> {
    return new Collection(this.items.map(callback));
  }

  /**
   * Run a grouping map over the items. The callback should return an array with a single key/value pair.
   *
   * @param {Function} callback Return an array with a single key/value pair.
   * @returns {Object} a new object with the key being the group name and the value being an array of grouped values.
   */
  public mapToGroups(callback: (value: any, key: number) => [key: string, value: any]): { [key: string]: any } {
    return this.items.reduce<Record<string, Record<string, any>>>((pre, cur, index) => {
      const pair = callback(cur, index);

      if (!Array.isArray(pair) || pair.length < 2) {
        throw new RangeError('The callback should return an array with a single key/value pair.');
      }

      const [key, value] = pair;

      if (pre[key] === undefined) {
        pre[key] = [];
      }

      pre[key].push(value);

      return pre;
    }, {});
  }

  /**
   * Merges the given items into the collection.
   *
   * @param {Collection<T>|unknown[]} items The items to merge into the collection.
   * @returns {this}
   * @chainable
   */
  public merge(items: Collection<T> | unknown[]): this {
    if (items instanceof Collection) {
      items = items.all();
    }

    this.items = Arr.new(this.items.concat(<[]>items)).unique();

    return this;
  }

  /**
   * Pad the collection with the given value until the given length is reached.
   * If the length is negative, will pad the collection with the given value to the left until the given length is reached.
   *
   * @param {number} length The length to pad the collection to.
   * @param {string} [char=''] The value to pad with.
   * @returns {Collection<unknown>} A new collection with the padded items.
   */
  public pad(length: number, char: string = ''): Collection<unknown> {
    let result = [];

    if (length < 0) {
      result = Arr.fillItems(0, Math.abs(this.items.length + length) - 1)
        .map(_ => char)
        .concat(<[]>this.items);
    } else {
      result = [...this.items];

      while (result.length < length) {
        result.push(char as T);
      }
    }

    return new Collection<unknown>(result);
  }

  /**
   * Pluck an array of values from the collection.
   *
   * @param {string} key The key name needs to be taken from another array.
   * @returns {Collection<unknown>} A new collection with the values plucked from the original array.
   */
  public pluck(key: string): Collection<unknown> {
    return new Collection(
      this.items
        .map((item: T) => (typeof item === 'object' && item !== null ? Obj.get(item, key) : null))
        .filter(item => item),
    );
  }

  /**
   * Pop an item from the end of the collection.
   *
   * @param {number} [count=1] The number of items to pop.
   * @returns {(T|T[]|undefined)} The popped item or items.
   */
  public pop(count: number = 1): T | T[] | undefined {
    if (count === 1) return this.items.pop();

    const result: T[] = [];

    for (let i = 0; i < count; i++) {
      const tmp = this.items.pop();
      tmp && result.push(tmp);
    }

    return result;
  }

  /**
   * Prepends the given values to the collection.
   *
   * @param {T[]} values The values to prepend.
   * @returns {this}
   * @chainable
   */
  public prepend(...values: T[]): Collection<T> {
    this.items.unshift(...values);

    return this;
  }

  /**
   * Appends the given item to the end of the collection.
   *
   * @param {T} item The item to append.
   * @returns {this}
   * @chainable
   */
  public push(item: T): this {
    this.items.push(item);

    return this;
  }

  /**
   * Returns a random item from the collection.
   *
   * @returns {T}
   */
  public random(): T {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  /**
   * Creates a new collection with the given range of numbers.
   *
   * @param {number} [start=0] The start of the range.
   * @param {number | null} [end=null] The end of the range.
   * @param {number} [step=1] The step value.
   * @returns {Collection<number>}
   */
  public range(start = 0, end: number | null = null, step = 1): Collection<number> {
    return new Collection<number>(Arr.fillItems(start, end, step));
  }

  /**
   * Returns a new collection with the items in reverse order.
   *
   * @returns {Collection<T>}
   */
  public reverse(): Collection<T> {
    return new Collection(this.items.reverse());
  }

  /**
   * Removes and returns the first element of the collection.
   *
   * @returns {T|undefined} The first element of the collection, or undefined if the collection is empty.
   */
  public shift(): T | undefined {
    return this.items.shift();
  }

  /**
   * Shuffles the items of the collection.
   *
   * @returns {this}
   * @chainable
   */
  public shuffle() {
    for (let i = this.items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = this.items[i];
      this.items[i] = this.items[j];
      this.items[j] = tmp;
    }

    return this;
  }

  /**
   * Creates a new collection with the items of the given range.
   *
   * @param {number} [start] The start of the range.
   * @param {number} [end] The end of the range.
   * @returns {Collection<T>}
   */
  public slice(start?: number, end?: number): Collection<T> {
    return new Collection<T>(this.items.slice(start, end));
  }

  /**
   * Sorts the items of the collection.
   *
   * @param {((a: T, b: T) => -1 | 0 | 1) | undefined} [callback] The compare function.
   * @returns {Collection<T>}
   */
  public sort(callback?: (a: T, b: T) => -1 | 0 | 1) {
    return new Collection<T>(this.items.sort(callback));
  }

  /**
   * Splices a portion of the collection.
   *
   * @param {number} start The index at which to start changing the array.
   * @param {...*} args The elements to insert into the array at the start index.
   * @returns {this}
   * @chainable
   */
  public splice(start: number, ...args: any[]): this {
    this.items.splice(start, ...args);

    return this;
  }

  /**
   * Splits the items of the collection into a specified number of groups.
   *
   * @param {number} numberOfGroups The number of groups to split the items into.
   * @returns {Collection<T[]>} A new collection with the items split into a specified number of groups.
   */
  public split(numberOfGroups: number) {
    const groupSize = Math.floor(this.items.length / numberOfGroups);
    const items = this.items;
    const result = [];
    const remain = this.items.length % numberOfGroups;
    let start = 0;

    for (let i = 0; i < numberOfGroups; i++) {
      let size = groupSize;

      if (i < remain) {
        size++;
      }

      const end = i === numberOfGroups - 1 ? this.items.length : start + size;
      result.push(items.slice(start, end));
      start += size;
    }

    return new Collection(result);
  }

  /**
   * Calculates the sum of a collection of items.
   *
   * If the collection contains primitive numbers, the sum of the numbers is returned.
   * If the collection contains arrays, the sum of the length of the arrays is returned.
   * If the collection contains objects, the sum of the value of the given key is returned.
   * If the collection contains a mix of the above, the sum of all the values is returned.
   *
   * @param {string} [key] The key to use to calculate the sum of the objects.
   * @returns {number} The sum of the collection.
   */
  public sum(key?: string) {
    return this.items.reduce<number>((total, item) => {
      if (Array.isArray(item)) {
        return total + item.length;
      } else if (typeof item === 'object' && typeof item?.[key as keyof T] === 'number') {
        return total + (item[key as keyof T] as number);
      } else if (typeof item === 'number') {
        return total + item;
      }

      return total + 1;
    }, 0);
  }

  /**
   * Pass the collection to the given callback and return the collection.
   *
   * This method is useful for tapping into a collection chain to perform any
   * debugging or logging related tasks.
   *
   * @param {Function} callback
   * @returns {this}
   */
  public tap(callback: (collection: Collection<T>) => void): this {
    callback(this);

    return this;
  }

  /**
   * Return an array representation of the collection.
   *
   * @returns {any[]}
   */
  public toArray(): any[] {
    return this.map((item: any) => {
      if (typeof item === 'object' && item !== null && typeof item?.toArray === 'function') {
        return item.toArray();
      }

      return item;
    }).all();
  }

  /**
   * Return a JSON representation of the collection.
   *
   * @returns {string}
   */
  public toJson(): string {
    return JSON.stringify(this.items);
  }

  /**
   * An alias of toJson method.
   *
   * @returns {string}
   */
  public toString(): string {
    return this.toJson();
  }

  /**
   * Filter out duplicate elements to ensure that array elements are unique.
   *
   * @param {string} [key] The key is used to check for a unique value for an array element that is an object.
   * @returns {Collection<T>}
   */
  public unique(key?: string): Collection<T> {
    return new Collection(Arr.new(this.items).unique(key));
  }

  /**
   * Execute a callback when a condition is truthy.
   *
   * @param {any} condition A value or a function that takes the collection and returns a value.
   * @param {(collection: Collection<T>, value: unknown) => unknown} callback A function that takes the collection and the condition value.
   * @param {(collection: Collection<T>, value: unknown) => unknown} [defaultValue] An optional function that takes the collection and the condition value and returns a value.
   * @returns {unknown} The return value of the callback or the default value if the condition is falsy.
   */
  public when(
    condition: any,
    callback: (collection: Collection<T>, value: unknown) => unknown,
    defaultValue?: (collection: Collection<T>, value: unknown) => unknown,
  ) {
    const value = typeof condition === 'function' ? condition(this) : condition;

    if (value) {
      return callback(this, value) ?? this;
    } else if (defaultValue) {
      return defaultValue(this, value) ?? this;
    }

    return this;
  }

  /**
   * Create a new collection with the given item.
   * If the given item is not an array, it will be converted to an array.
   *
   * @param {any} item
   * @returns {Collection<unknown>}
   */
  static wrap(item: any): Collection<unknown> {
    if (!Array.isArray(item)) {
      item = [item];
    }

    return new Collection(item);
  }
}
