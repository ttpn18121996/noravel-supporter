import Arr from './Arr';
import Collection from './Collection';
import Obj from './Obj';
import Str from './Str';
import StringHelper from './Support/StringHelper';
import Helper from './Support/Helper';

/**
 * Check if a certain value exists or not.
 */
export const isset = Helper.isset;

/**
 * Check if a certain value is empty or not.
 */
export const empty = Helper.empty;

/**
 * Returns an array of items from the given value.
 */
export const getArray = Helper.getArrayableItems;

/**
 * Check the exact data type of a certain value.
 */
export const typeOf = Helper.typeOf;

/**
 * Check if a string value is json.
 */
export const isJSON = Helper.isJSON;

/**
 * Convert a query string to an object.
 */
export const queryStringToObject = Helper.queryStringToObject;

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

/**
 * Create a collection instance from an array or object.
 * If the input is an array, it will be passed directly to the Collection constructor.
 * If the input is an object, Collection.wrap() will be called on it.
 * If the input is null or undefined, an empty collection will be created.
 * @param {T | T[] | null | undefined} items The items to create the collection from.
 * @return {Collection<T>}
 */
export const _col = <T>(items: T | T[] = []) => {
  if (Array.isArray(items)) {
    return new Collection<T>(items);
  }

  return Collection.wrap(items);
};

export { Arr, Collection, Obj, Str, StringHelper };
