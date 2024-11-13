import { typeOf } from '.';

export type RandomOptions = {
  includeUppercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
};

export default class Str {
  private value: string;

  constructor(value: string) {
    this.value = this.caseString(value);
  }

  /**
   * Get the length of the string.
   * @returns {number}
   */
  public length(): number {
    return this.value.length;
  }

  /**
   * Return the remainder of a string after the first occurrence of a given value.
   * @param {string} search
   * @returns {Str}
   */
  public after(search: string): this {
    if (this.value !== '') {
      this.value = this.value
        .split(search)
        .filter((_: string, position: number) => {
          return position > 0;
        })
        .join(search);
    }

    return this;
  }

  /**
   * Return the remainder of a string after the last occurrence of a given value.
   * @param {string} search
   * @returns {Str}
   */
  public afterLast(search: string): this {
    if (this.value !== '') {
      this.value = this.value.split(search).reverse()[0];
    }

    return this;
  }

  /**
   * Get the portion of a string before the first occurrence of a given value.
   * @param {string} search
   * @returns {Str}
   */
  public before(search: string): this {
    if (this.value !== '') {
      this.value = this.value.split(search, 1).join('');
    }

    return this;
  }

  /**
   * Get the portion of a string before the last occurrence of a given value.
   * @param {string} search
   * @returns {Str}
   */
  public beforeLast(search: string): this {
    if (this.value !== '') {
      const splitValue = this.value.split(search);

      this.value = splitValue
        .filter((_, position: number) => {
          return position < splitValue.length - 1;
        })
        .join(search);
    }

    return this;
  }

  /**
   * Get the portion of a string between two given values.
   * @param {string} from
   * @param {string} to
   * @returns {Str}
   */
  public between(from: string, to: string): this {
    if (from !== '' && to !== '') {
      this.beforeLast(to).after(from);
    }

    return this;
  }

  /**
   * Get the smallest possible portion of a string between two given values.
   * @param {string} from
   * @param {string} to
   * @returns {Str}
   */
  public betweenFirst(from: string, to: string): this {
    if (from !== '' && to !== '') {
      this.before(to).after(from);
    }

    return this;
  }

  /**
   * Binds the values ​​to the given string.
   * @param {any[]} args
   * @returns {Str}
   */
  public bind(...args: any[]): this {
    let valueBound: string = this.value;

    if (Array.isArray(args?.[0])) {
      for (let i = 0; i < args[0].length; i++) {
        valueBound = valueBound.replace(/\{(\d+)\}/, args[0][i]);
      }
    } else if (typeOf(args[0]) === 'object') {
      const params = args[0];
      const matches = valueBound.match(/\{[a-zA-Z0-9_\-]+\}/g)?.map(m => m.replace(/^\{/, '').replace(/\}$/, ''));
      if (matches) {
        for (const match of matches) {
          const regex = RegExp('{' + match + '}');
          const param = params?.[match];
          if (!param) {
            continue;
          }
          valueBound = valueBound.replace(regex, params?.[match] ?? '');
        }
      }
    } else {
      valueBound = valueBound.replace(/{(\d+)}/g, (match, number) =>
        typeof args[number] != 'undefined' ? args[number] : match,
      );
    }

    this.value = valueBound;

    return this;
  }

  /**
   * Get the raw string value.
   * @returns {string}
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Get the raw string value.
   * @returns {string}
   */
  public get(start = 0, end = 0): string {
    if (end > 0) {
      return this.toString().substring(start, end);
    }

    return this.toString();
  }

  /**
   * Append the given values to the string.
   * @param {string[]} values
   * @returns {Str}
   */
  public append(...values: string[]): this {
    this.value += values.join('');
    return this;
  }

  /**
   * Prepend the given values to the string.
   * @param {string[]} values
   * @returns {Str}
   */
  public prepend(...values: string[]): this {
    this.value = values.join('') + this.value;
    return this;
  }

  /**
   * Convert the given string to proper case.
   * @returns {Str}
   */
  public title(): this {
    this.value = this.value
      .replace(/[\s\-_\.]+/g, ' ')
      .replace(/[a-zA-Z0-9]+[\S\-_]*/g, match => match.charAt(0).toUpperCase() + match.substring(1).toLowerCase());

    return this;
  }

  /**
   * Convert a value to studly caps case.
   * @returns {Str}
   */
  public studly(): this {
    this.value = this.title().get().replace(/\s/g, '');

    return this;
  }

  /**
   * Convert a value to camel case.
   * @returns {Str}
   */
  public camel(): this {
    this.value = this.studly()
      .get()
      .replace(/^(.)/, (match, p1) => p1.toLowerCase());

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
  public nonUnicode(): this {
    this.value = this.value
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a')
      .replace(/Á|À|Ả|Ạ|Ã|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ/g, 'A')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e')
      .replace(/E|É|È|Ẻ|Ẽ|Ê|Ế|Ề|Ể|Ễ|Ệ/g, 'E')
      .replace(/i|í|ì|ỉ|ĩ|ị/g, 'i')
      .replace(/I|Í|Ì|Ỉ|Ĩ|Ị/g, 'I')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o')
      .replace(/Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ/g, 'O')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, 'u')
      .replace(/Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự/g, 'U')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/g, 'y')
      .replace(/Ý|Ỳ|Ỷ|Ỹ|Ỵ/g, 'Y');

    return this;
  }

  /**
   * Convert a string to snake case.
   * @param {string} delimiter
   * @returns {Str}
   */
  public snake(delimiter = '_'): this {
    this.value = this.nonUnicode()
      .get()
      .replace(/[A-Z]/g, match => delimiter + match.toLocaleLowerCase())
      .replace(new RegExp('[\\s\\' + delimiter + ']+', 'g'), delimiter)
      .replace(new RegExp('^' + delimiter), '');

    return this;
  }

  /**
   * Convert a string to kebab case.
   * @returns {Str}
   */
  public kebab(): this {
    this.snake('-');

    return this;
  }

  /**
   * Escape HTML character.
   * @returns {Str}
   */
  public escapeHtml(): this {
    this.value = this.value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    return this;
  }

  /**
   * Limit the number of characters in a string.
   * @param {number} length
   * @returns {Str}
   */
  public limit(length = 100): this {
    if (this.value.length <= length) {
      return this;
    }
    let result: string = '';
    for (const word of this.value.split(' ')) {
      const tmp =
        result +
        word
          .trim()
          .replace(/\r?\n|\r| /g, ' ')
          .replace(/\s\s+/g, ' ') +
        ' ';
      if (tmp.length <= length - 4) {
        result = tmp;
      }
    }

    this.value = result + '...';

    return this;
  }

  private arrayFromLowToHigh(low: number, high: number) {
    let result: number[] = [];
    for (let i = low; i <= high; i++) {
      result.push(i);
    }

    return result;
  }

  /**
   * Generate a more truly "random" string.
   * @param {number} length
   * @param {RandomOptions} options
   * @returns {string}
   */
  public random(length = 16, options: RandomOptions = {}): string {
    const UPPERCASE_CHAR_CODES = this.arrayFromLowToHigh(65, 90);
    const LOWCASE_CHAR_CODES = this.arrayFromLowToHigh(97, 122);
    const NUMBER_CHAR_CODES = this.arrayFromLowToHigh(48, 57);
    const SYMBOL_CHAR_CODES = this.arrayFromLowToHigh(33, 47).concat(
      this.arrayFromLowToHigh(58, 64).concat(this.arrayFromLowToHigh(91, 96).concat(this.arrayFromLowToHigh(123, 126))),
    );
    let charCodes = LOWCASE_CHAR_CODES;
    if (options.includeUppercase) charCodes = charCodes.concat(UPPERCASE_CHAR_CODES);
    if (options.includeNumbers) charCodes = charCodes.concat(NUMBER_CHAR_CODES);
    if (options.includeSymbols) charCodes = charCodes.concat(SYMBOL_CHAR_CODES);
    const result = [];
    for (let i = 0; i < length; i++) {
      const character = charCodes[Math.floor(Math.random() * charCodes.length)];
      result.push(String.fromCharCode(character));
    }

    return result.join('');
  }

  /**
   * Randomly shuffles a string.
   * @returns {Str}
   */
  public shuffle(): this {
    const result = this.value.split('');

    for (let i = this.length() - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = result[i];
      result[i] = result[j];
      result[j] = tmp;
    }

    this.value = result.join('');

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
  public replaceAt(index: number, replacement: string): this {
    this.value = this.value.substring(0, index) + replacement + this.value.substring(index + replacement.length);

    return this;
  }

  /**
   * Split a string from a specific position and then insert the splice into the slice.
   * @param {number} start
   * @param {number} deleteCount
   * @param {string} subStr
   * @returns {Str}
   */
  public splice(start: number, deleteCount: number, subStr: string): this {
    this.value = this.value.slice(0, start) + subStr + this.value.slice(start + Math.abs(deleteCount));

    return this;
  }

  /**
   * Extracts a section of this string and returns it as a new string.
   * @param {number} start
   * @param {number|undefined} end
   * @returns {Str}
   */
  public slice(start?: number, end?: number): this {
    this.value = this.value.slice(start, end);

    return this;
  }

  /**
   * Pads a given value in front of a given string until the given length is reached.
   * @param {number} length
   * @param {string} char
   * @returns {Str}
   */
  public padStart(length: number, char: string): this {
    this.value = this.value.padStart(length, char);

    return this;
  }

  /**
   * Pads a given value behind a given string until the given length is reached.
   * @param {number} length
   * @param {string} char
   * @returns {Str}
   */
  public padEnd(length: number, char: string): this {
    this.value = this.value.padEnd(length, char);

    return this;
  }

  /**
   * Casts a value to a string type.
   * @param value
   * @returns {string}
   */
  public caseString(value: any): string {
    return typeof value === 'object' &&
      (value?.hasOwnProperty('toString') || value.toString === Object.prototype.toString)
      ? value.toString()
      : `${value}`;
  }
}
