import Arr from './Arr';
import Obj from './Obj';
import Str from './Str';
import StringHelper from './Support/StringHelper';

/**
 * Check if a certain value exists or not.
 */
export const isset = (value: any): boolean => {
  return value !== undefined && value !== null;
};

/**
 * Check if a certain value is empty or not.
 */
export const empty = (value: any): boolean => {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else if (typeOf(value) === 'object') {
    if (value.hasOwnProperty('count') || typeof value.count === 'function') {
      return value.count() === 0;
    } else if (value.hasOwnProperty('isEmpty') || typeof value.isEmpty === 'function') {
      return value.isEmpty();
    } else {
      return Object.keys(value).length === 0;
    }
  }

  return value === undefined || value === null || value === false || value === '' || value === 0;
};

/**
 * Check the exact data type of a certain value.
 */
export const typeOf = function (value: any): string {
  const result = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

  if (result === 'function' && /^class/i.test(value.toString())) {
    return 'constructor';
  }

  return result;
};

/**
 * Check if a string value is json.
 */
export const isJSON = (value: string): boolean => {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Convert a query string to an object.
 */
export const queryStringToObject = (value: string): Object => {
  const urlSearchParams = new URLSearchParams(value);
  const entries = urlSearchParams.entries();
  const result: Record<string, string> = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
};

/**
 * String supporter.
 */
export const _str = (value: string = ''): Str => new Str(value);

/**
 * Array supporter.
 */
export const _arr = (value: any[] | null | undefined = []): Arr => Arr.new(value || []);

/**
 * Object supporter.
 */
export const _obj = Obj;

export { Arr, Obj, Str, StringHelper };
