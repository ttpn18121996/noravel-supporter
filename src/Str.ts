import StringHelper, { RandomOptions } from './Support/StringHelper';

export default class Str {
  public value: String;

  public constructor(value: any) {
    this.value = new String(value);
  }

  /**
   * Return the remainder of a string after the first occurrence of a given value.
   * @param {string} search
   * @returns {Str}
   */
  public after(search: string): Str {
    this.value = StringHelper.after(this.toString(), search);

    return this;
  }

  /**
   * Return the remainder of a string after the last occurrence of a given value.
   * @param {string} search
   * @returns {Str}
   */
  public afterLast(search: string): Str {
    this.value = StringHelper.afterLast(this.toString(), search);

    return this;
  }

  /**
   * Get the portion of a string before the first occurrence of a given value.
   * @param {string} search
   * @returns {Str}
   */
  public before(search: string): Str {
    this.value = StringHelper.before(this.toString(), search);

    return this;
  }

  /**
   * Get the portion of a string before the last occurrence of a given value.
   * @param {string} search
   * @returns {Str}
   */
  public beforeLast(search: string): Str {
    this.value = StringHelper.beforeLast(this.toString(), search);

    return this;
  }

  /**
   * Get the portion of a string between two given values.
   * @param {string} from
   * @param {string} to
   * @returns {Str}
   */
  public between(from: string, to: string): Str {
    this.value = StringHelper.between(this.toString(), from, to);

    return this;
  }

  /**
   * Get the smallest possible portion of a string between two given values.
   * @param {string} from
   * @param {string} to
   * @returns {Str}
   */
  public betweenFirst(from: string, to: string): Str {
    this.value = StringHelper.betweenFirst(this.toString(), from, to);

    return this;
  }

  /**
   * Binds the values ​​to the given string.
   * @param {any[]} args
   * @returns {Str}
   */
  public bind(...args: any[]): Str {
    this.value = StringHelper.bindParams(this.toString(), ...args);

    return this;
  }

  /**
   * Get the raw string value.
   * @returns {string}
   */
  public toString(): string {
    return this.value.toString();
  }

  /**
   * Get the raw string value.
   * @returns {string}
   */
  public get(start = 0, end = 0): string {
    return end > 0 ? this.value.substring(start, end) : this.toString();
  }

  /**
   * Append the given values to the string.
   * @param {string[]} values
   * @returns {Str}
   */
  public append(...values: string[]): Str {
    this.value = StringHelper.append(this.toString(), ...values);

    return this;
  }

  /**
   * Prepend the given values to the string.
   * @param {string[]} values
   * @returns {Str}
   */
  public prepend(...values: string[]): Str {
    this.value = StringHelper.prepend(this.toString(), ...values);

    return this;
  }

  /**
   * Convert the given string to proper case.
   * @returns {Str}
   */
  public title(): Str {
    this.value = StringHelper.title(this.toString());

    return this;
  }

  /**
   * Convert a value to studly caps case.
   * @returns {Str}
   */
  public studly(): Str {
    this.value = StringHelper.studly(this.toString());

    return this;
  }

  /**
   * Convert a value to camel case.
   * @returns {Str}
   */
  public camel(): Str {
    this.value = StringHelper.camel(this.toString());

    return this;
  }

  /**
   * Convert the given string to lower-case.
   * @returns {Str}
   */
  public lower(): this {
    this.value = this.value.toLowerCase();

    return this;
  }

  /**
   * Convert the given string to upper-case.
   * @returns {Str}
   */
  public upper(): this {
    this.value = this.value.toUpperCase();

    return this;
  }

  /**
   * Remove Vietnamese unicode characters from the string.
   * @returns {Str}
   */
  public nonUnicode(value: string): Str {
    this.value = StringHelper.nonUnicode(value);

    return this;
  }

  /**
   * Convert a string to snake case.
   * @param {string} delimiter
   * @returns {Str}
   */
  public snake(delimiter = '_'): Str {
    this.value = StringHelper.snake(this.toString(), delimiter);

    return this;
  }

  /**
   * Convert a string to kebab case.
   * @returns {Str}
   */
  public kebab(): Str {
    return this.snake('-');
  }

  /**
   * Escape HTML character.
   * @returns {Str}
   */
  public escapeHtml(): Str {
    this.value = StringHelper.escapeHtml(this.toString());

    return this;
  }

  /**
   * Limit the number of characters in a string.
   * @param {number} length
   * @returns {Str}
   */
  public limit(length = 100): Str {
    this.value = StringHelper.limit(this.toString(), length);

    return this;
  }

  /**
   * Generate a more truly "random" string.
   * @param {number} length
   * @param {RandomOptions} options
   * @returns {Str}
   */
  public random(length = 16, options: RandomOptions = {}): Str {
    this.value = StringHelper.random(length, options);

    return this;
  }

  /**
   * Randomly shuffles a string.
   * @returns {Str}
   */
  public shuffle(): Str {
    this.value = StringHelper.shuffle(this.toString());

    return this;
  }

  /**
   * Replace the given value in the given string.
   * @param {RegExp} regexp
   * @param {string} replacer
   * @returns {Str}
   */
  public replace(regexp: RegExp, replacer: string): this {
    this.value = this.value.replace(regexp, replacer);

    return this;
  }

  /**
   * Replace the given value in the given string from a specific position.
   * @param {number} index
   * @param {string} replacement
   * @returns {Str}
   */
  public replaceAt(index: number, replacement: string): Str {
    this.value = StringHelper.replaceAt(this.toString(), index, replacement);

    return this;
  }

  /**
   * Split a string from a specific position and then insert the splice into the slice.
   * @param {number} start
   * @param {number} deleteCount
   * @param {string} subStr
   * @returns {Str}
   */
  public splice(start: number, deleteCount: number, subStr: string): Str {
    this.value = StringHelper.splice(this.toString(), start, deleteCount, subStr);

    return this;
  }

  /**
   * Extracts a section of this string and returns it as a new string.
   * @param {number} start
   * @param {number|undefined} end
   * @returns {Str}
   */
  public slice(start?: number, end?: number): Str {
    this.value = this.value.slice(start, end);

    return this;
  }

  /**
   * Pads a given value in front of a given string until the given length is reached.
   * @param {number} length
   * @param {string} char
   * @returns {Str}
   */
  public padStart(length: number, char: string): Str {
    this.value = this.value.padStart(length, char);

    return this;
  }

  /**
   * Pads a given value behind a given string until the given length is reached.
   * @param {number} length
   * @param {string} char
   * @returns {Str}
   */
  public padEnd(length: number, char: string): Str {
    this.value = this.value.padEnd(length, char);

    return this;
  }

  /**
   * Register a macro.
   * @param {string} name
   * @param {Function} callback
   * @returns {void}
   */
  static macro(name: string, callback: () => any): void {
    (Str.prototype as any)[name] = callback;
  }

  get length(): number {
    return this.value.length;
  }
}
