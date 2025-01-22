export default class Collection<T> {
  private items: T[] = [];

  public constructor(items: T[] = []) {
    this.items = [...items];
  }

  /**
   * Add an item to the collection.
   *
   * @param {T} item The item to add
   * @returns {this} The collection instance
   * @chainable
   */
  public add(item: T): this {
    this.items.push(item);

    return this;
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
   * @returns {this}
   * @chainable
   */
  public chunk(size: number = 1) {
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
   * Collapse the collection into a single, flat collection that contains all
   * of the items from the nested collections.
   *
   * @returns {this}
   * @chainable
   */
  public collapse() {
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
  public collect() {
    return new Collection([...this.items]);
  }

  /**
   * Concatenate the underlying array with the given array.
   *
   * @param {Collection<T>|unknown[]} items The array to concatenate with
   * @returns {this}
   * @chainable
   */
  public concat(items: Collection<T> | unknown[]) {
    return new Collection([...this.items, ...(<[]>items)]);
  }

  /**
   * Determines whether the collection contains a particular value.
   *
   * @param {Function} callback A function that takes in a value, index and array and returns a boolean.
   * @returns {boolean}
   */
  public contains(callback: (value: T, index: number, array: T[]) => unknown): boolean {
    return this.items.some(callback);
  }

  /**
   * Returns the total number of items in the collection.
   */
  public count(): number {
    return this.items.length;
  }

  public diff(items: Collection<T> | unknown[]) {}
}
