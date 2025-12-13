const { _arr, Arr } = require('../dist');

test('it can collapse an array', () => {
  const arr = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];
  const arr1 = [[1, 2, 3], [4, 5], 6];
  expect(_arr(arr).collapse()).toEqual([1, 2, 3, 4, 5, 6]);
  expect(_arr(arr1).collapse()).toEqual([1, 2, 3, 4, 5]);
});

test('it can chunk items of an array', () => {
  const arr = [1, 2, 3, 4, 5, 6];
  expect(_arr(arr).chunk()).toEqual([[1], [2], [3], [4], [5], [6]]);
  expect(_arr(arr).chunk(2)).toEqual([
    [1, 2],
    [3, 4],
    [5, 6],
  ]);
});

describe('it can get a first item', () => {
  test('from a non-empty array', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const chunk = _arr(arr).first();
    expect(chunk).toEqual(1);
  });

  test('from an empty array', () => {
    const arr = [];
    const chunk = _arr(arr).first();
    expect(chunk).toBeNull();
  });
});

describe('it can get a last item', () => {
  test('from a non-empty array', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const chunk = _arr(arr).last();
    expect(chunk).toEqual(6);
  });

  test('from an empty array', () => {
    const arr = [];
    const chunk = _arr(arr).last();
    expect(chunk).toBeNull();
  });
});

test('it can run a map over each of the items in the array', () => {
  const arr = [1, 2, 3, 4, 5, 6];
  const result = _arr(arr).map(i => i + 1);
  expect(result).toEqual([2, 3, 4, 5, 6, 7]);
});

test('it can run a grouping map over the items', () => {
  const users = [
    {
      name: 'John Doe',
      department: 'Sales',
    },
    {
      name: 'Jane Doe',
      department: 'Sales',
    },
    {
      name: 'Johnny Doe',
      department: 'Marketing',
    },
  ];
  const result = _arr(users).mapToGroups(user => [user.department, user.name]);
  expect(result).toEqual({ Sales: ['John Doe', 'Jane Doe'], Marketing: ['Johnny Doe'] });
});

test('it cannot run a grouping map over the items with the returns of the callback is not an array with 2 elements', () => {
  const users = [{}];
  expect(() => {
    _arr(users).mapToGroups(user => []);
  }).toThrow(new RangeError('The callback should return an array with a single key/value pair.'));
});

test('it can pluck an array of values from an array', () => {
  const users = [
    {
      name: 'John Doe',
      department: 'Sales',
    },
    {
      name: 'Jane Doe',
      department: 'Sales',
    },
    {
      name: 'Johnny Doe',
      department: 'Marketing',
    },
  ];
  const result = _arr(users).pluck('name');
  expect(result).toEqual(['John Doe', 'Jane Doe', 'Johnny Doe']);
  expect(_arr([1, 2, 3]).pluck('name')).toEqual([]);
});

describe('it can creates an array of numbers', () => {
  test('with the specified length', () => {
    expect(_arr().range()).toEqual([]);
    expect(_arr().range(3)).toEqual([1, 2, 3]);
  });

  test('with length specified with negative value', () => {
    expect(_arr().range(-3)).toEqual([-3, -2, -1]);
  });

  test('with increasing values', () => {
    expect(_arr().range(1, 3)).toEqual([1, 2, 3]);
  });

  test('with decreasing values', () => {
    expect(_arr().range(3, 1)).toEqual([3, 2, 1]);
  });

  test('with step value', () => {
    expect(_arr().range(1, 3, 2)).toEqual([1, 3]);
  });

  test('with start value equal end value', () => {
    expect(_arr().range(3, 3)).toEqual([3]);
  });
});

test('it can add elements to ensure the length of the array', () => {
  expect(_arr([1, 2, 3]).supplement(4)).toEqual([1, 2, 3, null]);
});

describe('it can filter out duplicate elements to ensure that array elements are unique', () => {
  test('with the item is primitive type', () => {
    expect(_arr([1, 2, 3, 1]).unique()).toEqual([1, 2, 3]);
  });

  test('with the item is an object', () => {
    expect(_arr([{ id: 1 }, { id: 2 }, { id: 1 }]).unique('id')).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test('with the item is an object without a key', () => {
    expect(_arr([{ id: 1 }, { id: 2 }, { id: 1 }]).unique()).toEqual([{ id: 1 }, { id: 2 }]);
  });
});

describe('it can convert the array to options of a selection', () => {
  test('with the item is primitive type', () => {
    expect(_arr(['Nam', 'John Doe']).toSelectOptions()).toEqual([
      { value: 0, label: 'Nam' },
      { value: 1, label: 'John Doe' },
    ]);
  });

  test('with the item is an object', () => {
    const users = [
      { id: 1, name: 'Nam' },
      { id: 2, name: 'John Doe' },
    ];
    expect(_arr(users).toSelectOptions(['id', 'name'])).toEqual([
      { value: 1, label: 'Nam' },
      { value: 2, label: 'John Doe' },
    ]);
  });
});

test('it can check for emptiness', () => {
  expect(_arr([]).isEmpty()).toBeTruthy();
  expect(_arr([1]).isEmpty()).toBeFalsy();
});

test('it can get a raw array value', () => {
  expect(_arr({ id: 1 })).toEqual([{ id: 1 }]);
});

test('it can cross join arrays', () => {
  expect(Arr.crossJoin([1, 2], ['a', 'b'])).toEqual([
    [1, 'a'],
    [1, 'b'],
    [2, 'a'],
    [2, 'b'],
  ]);
});

test('it can create a new array from an iterable', () => {
  const set = new Set([1, 2, 3]);
  expect(_arr(set)).toEqual([1, 2, 3]);
});

test('it can register a custom macro', () => {
  Arr.macro(123, () => 'should not be registered');
  Arr.macro('custom', function () {
    return this.concat(['custom']);
  });

  const actual = _arr(['hello']).custom();
  expect(actual).toEqual(['hello', 'custom']);
});
