const { _col, isset, empty, typeOf, isJSON, queryStringToObject, getArray, isConstructor } = require('../dist');

describe('it is set', () => {
  test('with value is not undefined', () => {
    let a;
    expect(isset(a)).toBeFalsy();
  });

  test('with value is not null', () => {
    const a = null;
    expect(isset(a)).toBeFalsy();
  });
});

describe('it is empty', () => {
  test('with value is undefined', () => {
    let a;
    expect(empty(a)).toBeTruthy();
  });

  test('with value is null', () => {
    const a = null;
    expect(empty(a)).toBeTruthy();
  });

  test('with value is an empty string', () => {
    const a = '';
    expect(empty(a)).toBeTruthy();
  });

  test('with value is an empty array', () => {
    const a = [];
    expect(empty(a)).toBeTruthy();
  });

  test('with value is 0', () => {
    const a = 0;
    expect(empty(a)).toBeTruthy();
  });

  test('with value is false', () => {
    const a = false;
    expect(empty(a)).toBeTruthy();
  });

  test('with value is an empty object', () => {
    const a = { count: () => 0 };
    const b = { isEmpty: () => true };
    const c = {};
    expect(empty(a)).toBeTruthy();
    expect(empty(b)).toBeTruthy();
    expect(empty(c)).toBeTruthy();
  });
});

describe('it can be convert to array', () => {
  test('with a string', () => {
    expect(getArray('Nam')).toEqual(['Nam']);
  });

  test('with a number', () => {
    expect(getArray(1)).toEqual([1]);
  });

  test('with a collection', () => {
    const collection = _col([1, 2, 3]);

    expect(getArray(collection)).toEqual([1, 2, 3]);
  });

  test('with an array', () => {
    expect(getArray([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('with an arrayable', () => {
    const arrayable = { toArray: () => [1, 2, 3] };
    expect(getArray(arrayable)).toEqual([1, 2, 3]);
  });

  test('with a json', () => {
    expect(getArray('[1,2,3]')).toEqual([1, 2, 3]);
  });
});

describe('it can be get type of', () => {
  test('a string', () => {
    expect(typeOf('')).toEqual('string');
  });

  test('a number', () => {
    expect(typeOf(1)).toEqual('number');
  });

  test('a boolean', () => {
    expect(typeOf(true)).toEqual('boolean');
  });

  test('an array', () => {
    expect(typeOf([])).toEqual('array');
  });

  test('an object', () => {
    expect(typeOf({})).toEqual('object');
  });

  test('a function', () => {
    expect(typeOf(() => {})).toEqual('function');
  });
});

describe('it can be check a constructor', () => {
  test('with a class', () => {
    class A {}
    expect(isConstructor(A)).toBeTruthy();
  });
  test('with a function', () => {
    expect(isConstructor(function () {})).toBeTruthy();
  });
  test('with an arrow function', () => {
    expect(isConstructor(() => {})).toBeFalsy();
  });
  test('with an object', () => {
    expect(isConstructor({})).toBeFalsy();
  });
});

describe('it can verify', () => {
  test('a JSON string', () => {
    expect(isJSON('{}')).toBeTruthy();
  });

  test('an invalid JSON', () => {
    expect(isJSON('')).toBeFalsy();
  });
});

test('it can convert a query string to an object', () => {
  const queryString = '?name=Nam';
  const actual = queryStringToObject(queryString);
  expect(actual).toEqual({ name: 'Nam' });
});
