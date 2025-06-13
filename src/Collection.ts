import Obj from './Obj';
import Arr from './Arr';
import Helper from './Support/Helper';
import { Arrayable, Jsonable, Stringable } from './types';

export default class Collection<T = any> implements Arrayable<T>, Iterable<T>, Jsonable, Stringable {
  public items: Map<string, T> = new Map();
  public isAssociative = false;

  public constructor(items: T[] | Map<string, T> | Record<string, T> = []) {
    if (items instanceof Map) {
      this.items = items;
    } else if (Array.isArray(items)) {
      this.items = new Map(items.map((value, index) => [`${index}`, value]));
    } else {
      this.items = new Map(Object.entries(items)) as Map<string, T>;
    }
  }

  private isSequentialMap(): boolean {
    const keys = this.keys();

    if (!keys.every(key => /^\d+$/.test(key))) {
      return false;
    }

    const numericKeys = keys.map(Number).sort((a, b) => a - b);

    return numericKeys.every((key, index) => key === index);
  }

  /**
   * Retrieve all of the items in the collection.
   *
   * @returns {Map<TKey, TValue>} the underlying array
   */
  public all(): T[] | [string, T][] {
    return this.isSequentialMap() ? this.values() : this.entries();
  }

  /**
   * Chunk the underlying array into chunks of the given size.
   *
   * @param {number} [size=1] The size of each chunk
   * @returns {Collection | this} The chunked collection or the current collection if empty
   */
  public chunk(size: number = 1): Collection | this {
    if (!this.count()) {
      return this;
    }

    const items = this.values().reduce((result: any[], item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!result[chunkIndex]) {
        result[chunkIndex] = [];
      }
      result[chunkIndex].push(item);
      return result;
    }, []);

    return new Collection(items);
  }

  /**
   * Collapse the collection of arrays into a single, flat collection.
   *
   * @returns {Collection | this}
   * @chainable
   */
  public collapse(): Collection | this {
    if (!this.count()) {
      return this;
    }

    const items = this.values().reduce((result: unknown[], item: T) => {
      if (!Array.isArray(item)) {
        return result;
      }

      return [...result, ...item];
    }, []);

    return new Collection(items);
  }

  /**
   * Get a shallow copy of this collection.
   *
   * @returns {Collection}
   */
  public collect(): Collection {
    return new Collection(this.items);
  }

  /**
   * Concatenate the underlying array with the given array or collection and return a new collection.
   *
   * @param {Collection<T> | any[]} items The array to concatenate with
   * @returns {Collection<T>}
   * @chainable
   */
  public concat(items: Collection<T> | any[]): Collection<T> {
    if (Array.isArray(items)) {
      items = new Collection(items);
    }

    return new Collection(new Map([...this.items, ...items.entries()]));
  }

  /**
   * Determines whether the collection contains a particular value.
   *
   * @param {Function | unknown} callback A function that takes in a value, index and array and returns a boolean.
   * @returns {boolean}
   */
  public contains(callback: (value: T, index: string, array: Map<string, T>) => unknown | unknown): boolean {
    if (typeof callback !== 'function') {
      return this.items.has(callback);
    }

    let result = false;

    this.items.forEach((value: T, index: string) => {
      if (callback(value, index, this.items)) {
        result = true;
        return;
      }
    });

    return result;
  }

  /**
   * Returns the total number of items in the collection.
   *
   * @returns {number}
   */
  public count(): number {
    return this.items.size;
  }

  /**
   * Cross join the given arrays.
   *
   * @param {...any[]} args The arrays to cross join
   * @returns {Collection | this}
   * @chainable
   */
  public crossJoin(...args: any[]): Collection | this {
    if (!this.isSequentialMap()) {
      return this;
    }

    return new Collection(
      Arr.crossJoin(
        this.values(),
        ...args.map(arg => (arg instanceof Collection ? arg.all() : Collection.wrap(arg).all())),
      ),
    );
  }

  /**
   * Get the items in the collection that are not present in the given items.
   *
   * @param {Collection<T> | unknown[]} items The items to compare against
   * @returns {Collection<T>}
   * @chainable
   */
  public diff(items: Collection<T> | unknown[]): Collection<T> {
    if (items instanceof Collection) {
      items = items.all();
    }

    return this.filter(item => !items.includes(item));
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
  public each(callback: (value: T, index: string, array: Map<string, T>) => boolean | undefined): this {
    this.items.forEach((value: T, index: string) => {
      if (callback(value, index, this.items) === false) {
        return;
      }
    });

    return this;
  }

  /**
   * Returns an array of the collection's entries.
   *
   * @returns {Array} An array of the collection's entries.
   */
  public entries(): [string, T][] {
    return Array.from(this.items.entries());
  }

  /**
   * Determines whether all elements of the collection satisfy the provided testing function.
   *
   * @param {Function} callback A function that takes in a value, index and array and returns a boolean.
   * @returns {boolean}
   */
  public every(callback: (value: T, index: string, array: Map<string, T>) => unknown): boolean {
    let result = true;

    this.items.forEach((value: T, index: string) => {
      if (!callback(value, index, this.items)) {
        result = false;
        return;
      }
    });

    return result;
  }

  /**
   * Creates a new collection with all elements that pass the test implemented by the provided function.
   *
   * @param {Function} callback A function that takes in a value, index and array and returns a boolean.
   * @returns {Collection<T>}
   */
  public filter(callback: (value: T, index: string, array: Map<string, T>) => unknown): Collection<T> {
    const entries: [string, T][] = [];

    this.items.forEach((value: T, index: string) => {
      if (callback(value, index, this.items)) {
        entries.push([index, value]);
      }
    });

    return new Collection(new Map(entries));
  }

  /**
   * Get the first element in the collection.
   * If a callback is provided, the method will return the first element that passes the test.
   *
   * @param {Function} [callback] A function that takes in a value, index and array and returns a boolean.
   * @returns {unknown} The first element in the collection, or undefined if the collection is empty.
   */
  public first(callback?: (value: T, index: string, array: Map<string, T>) => unknown): T | null {
    let items = this.values();

    if (callback !== undefined) {
      items = this.filter(callback).values();
    }

    for (const item of items) {
      return item;
    }

    return null;
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

    return new Collection(this.values().slice(start, end));
  }

  public get(key: string, defaultValue?: any): any {
    return this.items.get(key) ?? defaultValue;
  }

  /**
   * Groups the items in the collection by a given key.
   *
   * @param {string} key The key to group by.
   * @returns {Record<string, T[]>} A record where the keys are the group names and the values are an array of grouped items.
   */
  public groupBy(key: string): Record<string, T[]> {
    return this.values().reduce<Record<string, T[]>>((pre, cur: T) => {
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
   * @param {Collection<T> | any[]} items The items to compare against
   * @returns {Collection<T>}
   */
  public intersect(items: Collection<T> | any[]): Collection<T> {
    if (Array.isArray(items)) {
      items = new Collection(items);
    }

    const result = new Collection<T>();

    // TODO: implement intersect

    return result;
  }

  /**
   * Check if the collection is empty.
   *
   * @returns {boolean} This collection is empty.
   */
  public isEmpty(): boolean {
    return this.count() === 0;
  }

  /**
   * Check if the collection is not empty.
   *
   * @returns {boolean} This collection is not empty.
   */
  public isNotEmpty(): boolean {
    return this.count() > 0;
  }

  public keys(): string[] {
    return Array.from(this.items.keys());
  }

  /**
   * Get the last element of the collection.
   *
   * @param {Function} [callback] A function that takes in a value, index and array and returns a boolean.
   * @returns {unknown} The last element of the collection.
   */
  public last(callback?: (value: T, index: string, array: Map<string, T>) => unknown): T | null {
    let items = this.items.values();

    if (callback !== undefined) {
      items = this.filter(callback).items.values();
    }

    let currentValue = items.next().value;
    let preValue = currentValue;

    while (currentValue) {
      currentValue = items.next().value;

      if (currentValue === undefined) {
        return preValue ?? null;
      } else {
        preValue = currentValue;
      }
    }

    return null;
  }

  /**
   * Creates a new collection with the results of applying the given callback to every item in this collection.
   *
   * @param {Function} callback A function that takes in a value, index and array and returns a new value.
   * @returns {Collection<unknown>} A new collection with the results of applying the given callback.
   */
  public map(callback: (value: T, index: string, array: Map<string, T>) => unknown): Collection<unknown> {
    const items: unknown[] = [];

    this.items.forEach((value: T, index: string) => {
      items.push(callback(value, index, this.items));
    });

    return new Collection(items);
  }

  /**
   * Run a grouping map over the items. The callback should return an array with a single key/value pair.
   *
   * @param {Function} callback Return an array with a single key/value pair.
   * @returns {Object} a new object with the key being the group name and the value being an array of grouped values.
   */
  public mapToGroups(callback: (value: any, key: number) => [key: string, value: any]): Collection<any> {
    const obj = this.values().reduce<Record<string, any>>((pre, cur, index) => {
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
    }, {}) as Record<string, any>;

    return new Collection(new Map(obj.entries()));
  }

  /**
   * Merges the given items into the collection.
   *
   * @param {Collection<T>|unknown[]} items The items to merge into the collection.
   * @returns {this}
   * @chainable
   */
  public merge(items: Collection<T> | unknown[]): this {
    if (this.isSequentialMap()) {
      if (items instanceof Collection) {
        items = items.values();
      }

      this.items = new Map(
        Arr.new([...this.values(), ...items])
          .unique()
          .map((value, key) => [`${key}`, value]),
      );
    } else {
      if (Array.isArray(items)) {
        items = new Collection(items) as Collection<T>;
      }

      items.entries().forEach(([key, value]) => {
        if (!this.items.has(key)) {
          this.items.set(key, value);
        }
      });
    }

    return this;
  }

  /**
   * Pad the collection with the given value until the given length is reached.
   * If the length is negative, will pad the collection with the given value to the left until the given length is reached.
   *
   * @param {number} length The length to pad the collection to.
   * @param {string} [char=''] The value to pad with.
   * @returns {Collection} A new collection with the padded items.
   */
  public pad(length: number, char: string = ''): Collection {
    if (!this.isSequentialMap()) {
      return this;
    }

    let result: string[] | T[] = [];

    if (length < 0) {
      result = Arr.fillItems(0, Math.abs(this.count() + length) - 1)
        .map(_ => char)
        .concat(<[]>this.values());
    } else {
      result = [...this.values()];

      while (result.length < length) {
        result.push(char as T);
      }
    }

    return new Collection<any>(result);
  }

  /**
   * Pluck an array of values from the collection.
   *
   * @param {string} key The key name needs to be taken from another array.
   * @returns {Collection<any>} A new collection with the values plucked from the original array.
   */
  public pluck(key: string): Collection<any> {
    const entries = [...this.items.entries()];

    return new Collection(
      entries
        .map((item: [string, any]) => (typeof item[1] === 'object' && item[1] !== null ? Obj.get(item[1], key) : null))
        .filter(item => item),
    );
  }

  /**
   * Pop an item from the end of the collection.
   *
   * @param {number} [count=1] The number of items to pop.
   * @returns {(T|T[]|undefined)} The popped item or items.
   */
  public pop(count: number = 1): T | T[] | null {
    let entries = [...this.items.entries()];

    if (count === 1) {
      const result = entries.pop();

      if (result === undefined) {
        return null;
      }

      this.items = new Map(entries);

      return result[1];
    }

    const result: T[] = [];

    for (let i = 0; i < count; i++) {
      const tmp = entries.pop();
      tmp && result.push(tmp[1]);
    }

    this.items = new Map(entries);

    return result;
  }

  /**
   * Prepends the given values to the collection.
   *
   * @param {TValue} value The values to prepend.
   * @param {TKey | null} [key=null] The key to prepend.
   * @returns {Collection}
   * @chainable
   */
  public prepend(value: T, key: string | null = null): Collection<T> {
    if (!this.isSequentialMap() && key !== null) {
      return new Collection(new Map([[key, value], ...this.items.entries()]));
    }

    return new Collection([value].concat(this.values()));
  }

  /**
   * Appends the given item to the end of the collection.
   *
   * @param {TValue} item The item to append.
   * @returns {this}
   * @chainable
   */
  public push(item: T): this {
    let newKey = this.count();

    while (this.items.has(`${newKey}`)) {
      newKey++;
    }

    this.items.set(`${newKey}`, item);

    return this;
  }

  /**
   * Puts a value into the collection at the specified key.
   *
   * @param {string} key The key to put the value at.
   * @param {TValue} value The value to put into the collection.
   * @returns {this}
   * @chainable
   */
  public put(key: string, value: T): this {
    this.items.set(key, value);

    return this;
  }

  /**
   * Returns a random item from the collection.
   *
   * @returns {T}
   */
  public random(): T {
    return this.values()[Math.floor(Math.random() * this.count())];
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
    if (this.isSequentialMap()) {
      return new Collection([...this.values()].reverse());
    }

    return new Collection(new Map([...this.items.entries()].reverse()));
  }

  /**
   * Removes and returns the first element of the collection.
   *
   * @returns {T|undefined} The first element of the collection, or undefined if the collection is empty.
   */
  public shift(): T | undefined {
    if (this.count() === 0) {
      return;
    }

    const [key, value] = this.items.entries().next().value as [string, T];
    this.items.delete(key);

    return value;
  }

  /**
   * Shuffles the items of the collection.
   *
   * @returns {this}
   * @chainable
   */
  public shuffle() {
    const keys = [...this.items.keys()];
    for (let i = this.count() - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = this.items.get(keys[i]) as T;
      this.items.set(keys[i], this.items.get(keys[j]) as T);
      this.items.set(keys[j], tmp);
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
    if (this.isSequentialMap()) {
      return new Collection([...this.values()].slice(start, end));
    }

    return new Collection(new Map([...this.items.entries()].slice(start, end)));
  }

  /**
   * Sorts the items of the collection.
   *
   * @param {((a: T, b: T) => -1 | 0 | 1) | undefined} [callback] The compare function.
   * @returns {Collection<T>}
   */
  public sort(callback?: (a: T | [string, T], b: T | [string, T]) => -1 | 0 | 1) {
    if (this.isSequentialMap()) {
      return new Collection([...this.values()].sort(callback));
    }

    return new Collection(new Map([...this.items.entries()].sort(callback)));
  }

  /**
   * Splices a portion of the collection.
   *
   * @param {number} offset The index at which to start changing the array.
   * @param {number} deleteCount The number of elements to remove from the array.
   * @param {...*} replacement The elements to insert into the array at the start index.
   * @returns {this}
   * @chainable
   */
  public splice(offset: number, deleteCount?: number, replacement: any[] = []): any[] {
    const isSequential = this.isSequentialMap();
    const keys = this.keys();
    const entries = this.entries();

    if (offset < 0) {
      offset = entries.length + offset;
    }

    const offsetEnd = offset + (deleteCount ?? 0);
    const deleted = entries.slice(offset, offsetEnd);

    for (let i = offset; i < offsetEnd && i < entries.length; i++) {
      const keyToDelete = keys[i];
      this.items.delete(keyToDelete);
    }

    if (replacement.length > 0) {
      if (isSequential) {
        // Nếu là Map tuần tự: chèn lại theo index
        const before = entries.slice(0, offset);
        const after = entries.slice(offsetEnd);
        const newItems = [
          ...before.map(([, v]) => v),
          ...replacement,
          ...after.map(([, v]) => v),
        ];
        this.items = new Map(newItems.map((item, index) => [`${index}`, item]));
      } else {
        // Nếu không phải tuần tự: gán replacement với key mới (theo index)
        const result = new Map();
        let i = 0;
        for (let [k, v] of entries.slice(0, offset)) {
          result.set(k, v);
        }
        replacement.forEach((item, index) => {
          result.set(`${index}`, item);
        });
        for (let [k, v] of entries.slice(offsetEnd)) {
          result.set(k, v);
        }
        this.items = result;
      }
    } else if (isSequential) {
      // Sau khi xóa, cần đánh lại index nếu là Map tuần tự
      const updated = Array.from(this.items.values());
      this.items = new Map(updated.map((item, index) => [`${index}`, item]));
    }

    return isSequential ? deleted.map(([, v]) => v) : deleted;
  }

  /**
   * Splits the items of the collection into a specified number of groups.
   *
   * @param {number} numberOfGroups The number of groups to split the items into.
   * @returns {Collection<T[]>} A new collection with the items split into a specified number of groups.
   */
  // public split(numberOfGroups: number) {
  //   const groupSize = Math.floor(this.count() / numberOfGroups);
  //   const items = this.items;
  //   const result = [];
  //   const remain = this.count() % numberOfGroups;
  //   let start = 0;

  //   for (let i = 0; i < numberOfGroups; i++) {
  //     let size = groupSize;

  //     if (i < remain) {
  //       size++;
  //     }

  //     const end = i === numberOfGroups - 1 ? this.count() : start + size;
  //     result.push(items.slice(start, end));
  //     start += size;
  //   }

  //   return new Collection(result);
  // }

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
    return this.values().reduce<number>((total, item) => {
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
    if (this.isAssociative) {
      const result: Record<string | number, unknown> = {};

      this.items.forEach((value, key) => {
        if (typeof key === 'string' || typeof key === 'number') {
          result[key] = value;
        }
      });

      return JSON.stringify(result);
    }

    return JSON.stringify([...this.items.values()]);
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
    if (this.isAssociative) {
      return this.collect();
    }

    return new Collection(Arr.new(this.values()).unique(key));
  }

  public values(): T[] {
    return Array.from(this.items.values());
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
    item = typeof item === 'object' ? item : Helper.getArrayableItems(item);

    return new Collection(item);
  }

  [Symbol.iterator](): Iterator<T> {
    return this.items.values();
  }
}
