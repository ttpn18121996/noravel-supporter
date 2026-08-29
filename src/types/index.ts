export interface Arrayable<T> {
  toArray(): T[];
}

export interface Jsonable {
  toJson(): string;
}

export interface Stringable {
  toString(): string;
}

export type TypeOfData = 'array' | 'boolean' | 'function' | 'null' | 'number' | 'object' | 'string' | 'undefined';
