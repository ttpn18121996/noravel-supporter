import StringHelper, { RandomOptions } from './Support/StringHelper';
import { Stringable } from './types';

export default class Str implements Stringable {
  public value: String;

  public constructor(value: any) {
    this.value = new String(value);
  }

  /**
   * Return the remainder of a string after the first occurrence of a given value.
   * @param {string} search
   * @returns {this}
   */
  public after(search: string): this {
    this.value = StringHelper.after(this.toString(), search);

    return this;
  }

  /**
   * Return the remainder of a string after the last occurrence of a given value.
   * @param {string} search
   * @returns {this}
   */
  public afterLast(search: string): this {
    this.value = StringHelper.afterLast(this.toString(), search);

    return this;
  }

  /**
   * Append the given values to the string.
   * @param {string[]} values
   * @returns {this}
   */
  public append(...values: string[]): this {
    this.value = StringHelper.append(this.toString(), ...values);

    return this;
  }

  /**
   * Get the portion of a string before the first occurrence of a given value.
   * @param {string} search
   * @returns {this}
   */
  public before(search: string): this {
    this.value = StringHelper.before(this.toString(), search);

    return this;
  }

  /**
   * Get the portion of a string before the last occurrence of a given value.
   * @param {string} search
   * @returns {this}
   */
  public beforeLast(search: string): this {
    this.value = StringHelper.beforeLast(this.toString(), search);

    return this;
  }

  /**
   * Get the portion of a string between two given values.
   * @param {string} from
   * @param {string} to
   * @returns {this}
   */
  public between(from: string, to: string): this {
    this.value = StringHelper.between(this.toString(), from, to);

    return this;
  }

  /**
   * Get the smallest possible portion of a string between two given values.
   * @param {string} from
   * @param {string} to
   * @returns {this}
   */
  public betweenFirst(from: string, to: string): this {
    this.value = StringHelper.betweenFirst(this.toString(), from, to);

    return this;
  }

  /**
   * Binds the values ​​to the given string.
   * @param {any[]} args
   * @returns {this}
   */
  public bind(...args: any[]): this {
    this.value = StringHelper.bindParams(this.toString(), ...args);

    return this;
  }

  /**
   * Convert a value to camel case.
   * @returns {this}
   */
  public camel(): this {
    this.value = StringHelper.camel(this.toString());

    return this;
  }

  /**
   * Escape HTML character.
   * @returns {this}
   */
  public escapeHtml(): this {
    this.value = StringHelper.escapeHtml(this.toString());

    return this;
  }

  /**
   * Get the raw string value.
   *
   * @param {number} start
   * @param {number} end
   * @returns {string}
   */
  public get(start: number = 0, end: number = 0): string {
    return end > 0 ? this.value.substring(start, end) : this.toString();
  }

  /**
   * Convert a string to kebab case.
   * @returns {this}
   */
  public kebab(): this {
    this.value = StringHelper.kebab(this.toString());

    return this;
  }

  /**
   * Limit the number of characters in a string.
   * @param {number} length
   * @returns {this}
   */
  public limit(length: number = 100): this {
    this.value = StringHelper.limit(this.toString(), length);

    return this;
  }

  /**
   * Convert the given string to lower-case.
   * @returns {this}
   */
  public lower(): this {
    this.value = this.value.toLowerCase();

    return this;
  }

  /**
   * Remove Vietnamese unicode characters from the string.
   * @returns {this}
   */
  public nonUnicode(): this {
    this.value = StringHelper.nonUnicode(this.value.toString());

    return this;
  }

  /**
   * Pads a given value behind a given string until the given length is reached.
   * @param {number} length
   * @param {string} char
   * @returns {this}
   */
  public padEnd(length: number, char: string): this {
    this.value = this.value.padEnd(length, char);

    return this;
  }

  /**
   * Pads a given value in front of a given string until the given length is reached.
   * @param {number} length
   * @param {string} char
   * @returns {this}
   */
  public padStart(length: number, char: string): this {
    this.value = this.value.padStart(length, char);

    return this;
  }

  /**
   * Prepend the given values to the string.
   * @param {string[]} values
   * @returns {this}
   */
  public prepend(...values: string[]): this {
    this.value = StringHelper.prepend(this.toString(), ...values);

    return this;
  }

  /**
   * Generate a more truly "random" string.
   * @param {number} length
   * @param {RandomOptions} options
   * @returns {this}
   */
  public random(length: number = 16, options: RandomOptions = {}): this {
    this.value = StringHelper.random(length, options);

    return this;
  }

  /**
   * Replace the given value in the given string.
   * @param {string | RegExp} regexp
   * @param {string} replacer
   * @returns {this}
   */
  public replace(regexp: string | RegExp, replacer: string): this {
    this.value = this.value.replace(regexp, replacer);

    return this;
  }

  /**
   * Replace the given value in the given string from a specific position.
   * @param {number} index
   * @param {string} replacement
   * @returns {this}
   */
  public replaceAt(index: number, replacement: string): this {
    this.value = StringHelper.replaceAt(this.toString(), index, replacement);

    return this;
  }

  /**
   * Randomly shuffles a string.
   * @returns {this}
   */
  public shuffle(): this {
    this.value = StringHelper.shuffle(this.toString());

    return this;
  }

  /**
   * Extracts a section of this string and returns it as a new string.
   * @param {number} start
   * @param {number|undefined} end
   * @returns {this}
   */
  public slice(start?: number, end?: number): this {
    this.value = this.value.slice(start, end);

    return this;
  }

  /**
   * Convert a string to snake case.
   * @param {string} delimiter
   * @returns {this}
   */
  public snake(delimiter: string = '_'): this {
    this.value = StringHelper.snake(this.toString(), delimiter);

    return this;
  }

  /**
   * Split a string from a specific position and then insert the splice into the slice.
   * @param {number} start
   * @param {number} deleteCount
   * @param {string} subStr
   * @returns {this}
   */
  public splice(start: number, deleteCount: number, subStr: string): this {
    this.value = StringHelper.splice(this.toString(), start, deleteCount, subStr);

    return this;
  }

  /**
   * Convert a value to studly caps case.
   * @returns {this}
   */
  public studly(): this {
    this.value = StringHelper.studly(this.toString());

    return this;
  }

  /**
   * Convert the given string to proper case.
   * @returns {this}
   */
  public title(): this {
    this.value = StringHelper.title(this.toString());

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
   * Convert the given string to upper-case.
   * @returns {this}
   */
  public upper(): this {
    this.value = this.value.toUpperCase();

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

  /**
   * Get the length of the string.
   * @returns {number}
   */
  get length(): number {
    return this.value.length;
  }
}
