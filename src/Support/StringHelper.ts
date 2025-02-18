import { typeOf } from '..';

export type RandomOptions = {
  includeUppercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
};

function arrayFromLowToHigh(low: number, high: number) {
  let result: number[] = [];
  for (let i = low; i <= high; i++) {
    result.push(i);
  }
  return result;
}

export default class StringHelper {
  /**
   * Return the remainder of a string after the first occurrence of a given value.
   * @param {string} value
   * @param {string} search
   * @returns {string}
   */
  static after(value: string, search: string): string {
    if (value === '' || search === '') {
      return value;
    }

    return value
      .split(search)
      .filter((_: string, position: number) => {
        return position > 0;
      })
      .join(search);
  }

  /**
   * Return the remainder of a string after the last occurrence of a given value.
   * @param {string} search
   * @returns {string}
   */
  static afterLast(value: string, search: string): string {
    if (value === '' || search === '') {
      return value;
    }

    return value.split(search).pop() ?? '';
  }

  /**
   * Get the portion of a string before the first occurrence of a given value.
   * @param {string} search
   * @returns {string}
   */
  static before(value: string, search: string): string {
    if (value === '' || search === '') {
      return value;
    }

    return value.split(search, 1).join('');
  }

  /**
   * Get the portion of a string before the last occurrence of a given value.
   * @param {string} search
   * @returns {string}
   */
  static beforeLast(value: string, search: string): string {
    if (value === '' || search === '') {
      return value;
    }

    const splitValue = value.split(search);

    return splitValue.filter((_, position: number) => position < splitValue.length - 1).join(search);
  }

  /**
   * Get the portion of a string between two given values.
   * @param {string} from
   * @param {string} to
   * @returns {string}
   */
  static between(value: string, from: string, to: string): string {
    if (from !== '' && to !== '') {
      return StringHelper.beforeLast(StringHelper.after(value, from), to);
    }

    return value;
  }

  /**
   * Get the smallest possible portion of a string between two given values.
   * @param {string} value
   * @param {string} from
   * @param {string} to
   * @returns {Str}
   */
  static betweenFirst(value: string, from: string, to: string): string {
    if (from !== '' && to !== '') {
      return StringHelper.before(StringHelper.after(value, from), to);
    }

    return value;
  }

  static bindParams(value: string, ...args: any[]): string {
    let valueBound: string = value;

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

    return valueBound;
  }

  /**
   * Append the given values to the string.
   * @param {string[]} values
   * @returns {string}
   */
  static append(...values: string[]): string {
    return values.join('');
  }

  /**
   * Prepend the given values to the string.
   * @param {string[]} values
   * @returns {string}
   */
  static prepend(...values: string[]): string {
    const first = values.shift();

    return values.join('') + first;
  }

  /**
   * Convert the given string to proper case.
   * @param {string} value
   * @returns {string}
   */
  static title(value: string): string {
    return value
      .replace(/[\s\-_\.]+/g, ' ')
      .replace(/[a-zA-Z0-9]+[\S\-_]*/g, match => match.charAt(0).toUpperCase() + match.substring(1).toLowerCase());
  }

  /**
   * Convert a value to studly caps case.
   * @param {string} value
   * @returns {string}
   */
  static studly(value: string): string {
    return StringHelper.title(value).replace(/\s/g, '');
  }

  /**
   * Convert a value to camel case.
   * @param {string} value
   * @returns {string}
   */
  static camel(value: string): string {
    return StringHelper.studly(value).replace(/^(.)/, (_, p1) => p1.toLowerCase());
  }

  /**
   * Convert a string to snake case.
   * @param {string} value
   * @param {string} delimiter
   * @returns {string}
   */
  static snake(value: string, delimiter = '_'): string {
    return StringHelper.nonUnicode(value)
      .replace(/[A-Z]/g, match => delimiter + match.toLocaleLowerCase())
      .replace(new RegExp('[\\s\\' + delimiter + ']+', 'g'), delimiter)
      .replace(new RegExp('^' + delimiter), '');
  }

  /**
   * Convert a string to kebab case.
   * @param {string} value
   * @returns {string}
   */
  static kebab(value: string): string {
    return StringHelper.snake(value, '-');
  }

  /**
   * Limit the number of characters in a string.
   * @param {string} value
   * @param {number} length
   * @returns {string}
   */
  static limit(value: string, length: number = 100): string {
    if (value.length <= length) {
      return value;
    }

    let result: string = '';
    for (const word of value.split(' ')) {
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

    return result + '...';
  }

  /**
   * Generate a more truly "random" string.
   * @param {number} length
   * @param {RandomOptions} options
   * @returns {string}
   */
  static random(length = 16, options: RandomOptions = {}): string {
    const UPPERCASE_CHAR_CODES = arrayFromLowToHigh(65, 90);
    const LOWCASE_CHAR_CODES = arrayFromLowToHigh(97, 122);
    const NUMBER_CHAR_CODES = arrayFromLowToHigh(48, 57);
    const SYMBOL_CHAR_CODES = arrayFromLowToHigh(33, 47).concat(
      arrayFromLowToHigh(58, 64).concat(arrayFromLowToHigh(91, 96).concat(arrayFromLowToHigh(123, 126))),
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
   * @param {string} value
   * @returns {string}
   */
  static shuffle(value: string): string {
    const result = value.split('');

    for (let i = value.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = result[i];
      result[i] = result[j];
      result[j] = tmp;
    }

    return result.join('');
  }

  /**
   * Replace the given value in the given string from a specific position.
   * @param {number} index
   * @param {string} replacement
   * @returns {string}
   */
  static replaceAt(value: string, index: number, replacement: string): string {
    return value.substring(0, index) + replacement + value.substring(index + replacement.length);
  }

  /**
   * Split a string from a specific position and then insert the splice into the slice.
   * @param {string} value
   * @param {number} start
   * @param {number} deleteCount
   * @param {string} subStr
   * @returns {string}
   */
  static splice(value: string, start: number, deleteCount: number, subStr: string): string {
    return value.slice(0, start) + subStr + value.slice(start + Math.abs(deleteCount));
  }

  /**
   * Escape HTML character.
   * @param {string} value
   * @returns {string}
   */
  static escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Remove Vietnamese unicode characters from the string.
   * @returns {string}
   */
  static nonUnicode(value: string): string {
    return value
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
  }
}
