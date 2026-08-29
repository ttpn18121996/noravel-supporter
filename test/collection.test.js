const path = require('path');
const { _arr, _col } = require(path.resolve(__dirname, '../dist'));

describe('it can be constructed', () => {
  test('with a non-arrayable object', () => {
    const TestClass = class {
      constructor() {
        this.a = 1;
      }
    };
    const collection = _col(new TestClass());
    expect(collection.all()).toEqual([['a', 1]]);
  });

  test('with a string', () => {
    const collection = _col('hello');
    expect(collection.all()).toEqual(['hello']);
  });
});

describe('it can get all items', () => {
  test('from a sequential collection', () => {
    const collection = _col([1, 2, 3]);
    expect(collection.all()).toEqual([1, 2, 3]);
  });

  test('from a non-sequential collection', () => {
    const collection = _col({ a: 1, b: 2 });
    expect(collection.all()).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });
});

describe('it can chunk a collection', () => {
  test('with an empty collection', () => {
    const collection = _col();
    const actual = collection.chunk(2);
    expect(actual.all()).toEqual([]);
  });

  test('with a collection of numbers', () => {
    const collection = _col().range(1, 5);
    const actual = collection.chunk(2);
    expect(actual.all()).toEqual([[1, 2], [3, 4], [5]]);
  });
});

describe('it can collapse a collection', () => {
  test('with an empty collection', () => {
    const collection = _col();
    const actual = collection.collapse();
    expect(actual.all()).toEqual([]);
  });

  test('with a collection of numbers', () => {
    const collection = _col([[1, 2], [3, 4], 5]);
    const actual = collection.collapse();
    expect(actual.all()).toEqual([1, 2, 3, 4]);
  });
});

test('it can replicate a collection', () => {
  const collection = _col().range(1, 5);
  const actual = collection.collect();
  expect(actual.all()).toEqual([1, 2, 3, 4, 5]);
});

describe('it can concatenate', () => {
  test('with a collection', () => {
    const collection1 = _col().range(1, 3);
    const collection2 = _col().range(4, 6);
    const actual = collection1.concat(collection2);
    expect(actual.all()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('with an array', () => {
    const collection = _col().range(1, 3);
    const actual = collection.concat([4, 5, 6]);
    expect(actual.all()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('with two unsequence collections', () => {
    const collection1 = _col({ id: 1 });
    const collection2 = _col({ name: 'John Doe' });
    const actual = collection1.concat(collection2);
    expect(actual.all()).toEqual([
      ['id', 1],
      ['name', 'John Doe'],
    ]);
  });
});

describe('it can check whether a collection contains an item', () => {
  test('with a param that is not a function', () => {
    const collection = _col().range(1, 5);
    const actual = collection.contains(3);
    expect(actual).toBeTruthy();
  });

  test('with a param that is a function', () => {
    const collection = _col().range(1, 5);
    const actual = collection.contains(value => value === 3);
    expect(actual).toBeTruthy();
  });
});

test('it can count the number of items in a collection', () => {
  const collection = _col().range(1, 5);
  const actual = collection.count();
  expect(actual).toEqual(5);
});

describe('it can cross join multiple collections', () => {
  test('with sequential collections', () => {
    const collection1 = _col([1, 2]);
    const collection2 = _col(['a', 'b']);
    const collection3 = ['I', 'II'];
    const actual = collection1.crossJoin(collection2, collection3);
    expect(actual.all()).toEqual([
      [1, 'a', 'I'],
      [1, 'a', 'II'],
      [1, 'b', 'I'],
      [1, 'b', 'II'],
      [2, 'a', 'I'],
      [2, 'a', 'II'],
      [2, 'b', 'I'],
      [2, 'b', 'II'],
    ]);
  });

  test('with a non-sequential collection', () => {
    const collection = _col({ a: 1, b: 2 });
    const actual = collection.crossJoin([3, 4]);
    expect(actual.all()).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });
});

test('it can get items different from another collection', () => {
  const collection = _col().range(1, 5);
  const actual = collection.diff(_col().range(3, 5));
  expect(actual.all()).toEqual([1, 2]);
});

test('it can iterate items in the collection and call the given callback for each item', () => {
  const collection = _col().range(1, 5);
  const actual = [];
  collection.each(value => {
    actual.push(value * 2);
  });
  expect(actual).toEqual([2, 4, 6, 8, 10]);
});

test('it can stop iterating when callback returns false', () => {
  const collection = _col().range(1, 5);
  const actual = [];
  collection.each(value => {
    if (value > 3) {
      return false;
    }

    actual.push(value * 2);
  });
  expect(actual).toEqual([2, 4, 6]);
});

describe('it can determine whether all elements in the collection satisfy a condition', () => {
  test('with an empty collection', () => {
    const collection = _col();
    const actual = collection.every(value => value < 6);
    expect(actual).toBeTruthy();
  });

  test('with a collection', () => {
    const collection = _col().range(1, 5);
    const actual = collection.every(value => value < 6);
    expect(actual).toBeTruthy();
  });

  test('with a collection that does not satisfy the condition', () => {
    const collection = _col().range(1, 5);
    const actual = collection.every(value => value < 4);
    expect(actual).toBeFalsy();
  });
});

describe('it can filter a collection', () => {
  test('without a param', () => {
    const collection = _col([
      0,
      1,
      2,
      3,
      null,
      false,
      '',
      undefined,
      [],
      {},
      { isEmpty: () => true },
      { count: () => 0 },
    ]);
    const actual = collection.filter().values();
    expect(actual.all()).toEqual([1, 2, 3]);
  });

  test('with a param that is a function', () => {
    const collection = _col().range(1, 5);
    const actual = collection.filter(value => value < 4);
    expect(actual.all()).toEqual([1, 2, 3]);
  });
});

describe('it can get the first item in the collection', () => {
  test('without a param', () => {
    const collection = _col().range(1, 5);
    const actual = collection.first();
    expect(actual).toEqual(1);
  });

  test('with a param that is a function', () => {
    const collection = _col().range(1, 5);
    const actual = collection.first(value => value > 3);
    expect(actual).toEqual(4);
  });

  test('with an empty collection', () => {
    const collection = _col();
    const actual = collection.first();
    expect(actual).toBeUndefined();
  });
});

test('it can paginate a collection', () => {
  const collection = _col().range(1, 5);
  const actual = collection.forPage(2, 2);
  expect(actual.all()).toEqual([3, 4]);
});

describe('it can get an item from the collection', () => {
  const collection = _col({ a: 1, b: 2 });

  test('with an existing key', () => {
    const actual = collection.get('a');
    expect(actual).toEqual(1);
  });

  test('with a non-existing key and no default value', () => {
    const actual = collection.get('c');
    expect(actual).toBeUndefined();
  });

  test('with a non-existing key and a default value', () => {
    const actual = collection.get('c', 3);
    expect(actual).toEqual(3);
  });
});

test('it can group a collection by a given key', () => {
  const collection = _col([
    { name: 'John Doe', department: 'IT' },
    { name: 'Jane Doe', department: 'IT' },
    { name: 'Jame Doe', department: 'Sales' },
  ]);
  const actual = collection.groupBy('department');
  expect(actual).toEqual({
    IT: [
      { name: 'John Doe', department: 'IT' },
      { name: 'Jane Doe', department: 'IT' },
    ],
    Sales: [{ name: 'Jame Doe', department: 'Sales' }],
  });
});

describe('it can get an intersection of two collections', () => {
  test('with a param is an array', () => {
    const collection1 = _col().range(1, 5);
    const collection2 = _col().range(3, 5);
    const actual = collection1.intersect(collection2.all());
    expect(actual.all()).toEqual([3, 4, 5]);
  });

  test('with a param is a collection', () => {
    const collection1 = _col().range(1, 5);
    const collection2 = _col().range(3, 5);
    const actual = collection1.intersect(collection2);
    expect(actual.all()).toEqual([3, 4, 5]);
  });
});

describe('it can determine the collection', () => {
  test('is empty', () => {
    const collection = _col();
    const actual = collection.isEmpty();
    expect(actual).toBeTruthy();
  });

  test('is not empty', () => {
    const collection = _col().range(1, 5);
    const actual = collection.isNotEmpty();
    expect(actual).toBeTruthy();
  });
});

describe('it can get the last item in the collection', () => {
  test('with an empty collection', () => {
    const collection = _col();
    const actual = collection.last();
    expect(actual).toBeUndefined();
  });

  test('with an empty collection and a callback', () => {
    const collection = _col();
    const actual = collection.last(i => i > 2);
    expect(actual).toBeUndefined();
  });

  test('without a param', () => {
    const collection = _col().range(1, 5);
    const actual = collection.last();
    expect(actual).toEqual(5);
  });

  test('with a param that is a function', () => {
    const collection = _col().range(1, 5);
    const actual = collection.last(value => value < 4);
    expect(actual).toEqual(3);
  });
});

test('it can create a new collection with the results of applying a function to each item', () => {
  const collection = _col().range(1, 5);
  const actual = collection.map(value => value * 2);
  expect(actual.all()).toEqual([2, 4, 6, 8, 10]);
});

describe('it can run a grouping map over the items', () => {
  test('with a valid result', () => {
    const collection = _col([
      { name: 'John Doe', department: 'IT' },
      { name: 'Jane Doe', department: 'IT' },
      { name: 'Jame Doe', department: 'Sales' },
    ]);
    const actual = collection.mapToGroups(user => [user.department, user.name]);
    expect(actual.all()).toEqual([
      ['IT', ['John Doe', 'Jane Doe']],
      ['Sales', ['Jame Doe']],
    ]);
  });

  test('with an invalid result', () => {
    const collection = _col([
      { name: 'John Doe', department: 'IT' },
      { name: 'Jane Doe', department: 'IT' },
      { name: 'Jame Doe', department: 'Sales' },
    ]);
    const actual = function () {
      collection.mapToGroups(user => [user.department]);
    };
    expect(actual).toThrow(new RangeError('The callback should return an array with a single key/value pair.'));
  });
});

describe('it can merges the given items', () => {
  test('with a number collection', () => {
    const collection = _col().range(1, 5);
    const actual = _col().range(5, 10);
    actual.merge(collection);
    expect(actual.all()).toEqual([5, 6, 7, 8, 9, 10, 1, 2, 3, 4]);
  });

  test('with a string collection', () => {
    const collection = _col(['John', 'Jane', 'Jame']);
    const actual = _col(['John', 'Bob']);
    actual.merge(collection);
    expect(actual.all()).toEqual(['John', 'Bob', 'Jane', 'Jame']);
  });

  test('with an object collection', () => {
    const collection = _col([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Jame' },
    ]);
    const actual = _col([
      { id: 2, name: 'Jane' },
      { id: 4, name: 'Bob' },
    ]);
    actual.merge(collection);
    expect(actual.all()).toEqual([
      { id: 2, name: 'Jane' },
      { id: 4, name: 'Bob' },
      { id: 1, name: 'John' },
      { id: 3, name: 'Jame' },
    ]);
  });

  test('with a non-sequential object collection', () => {
    const collection = _col({ a: 1, b: 2 });
    const actual = _col({ c: 3, d: 4 });
    actual.merge(collection);
    expect(actual.all()).toEqual([
      ['c', 3],
      ['d', 4],
      ['a', 1],
      ['b', 2],
    ]);
  });

  test('with an array', () => {
    const actual = _col({ c: 3, d: 4 });
    actual.merge([1, 2]);
    expect(actual.all()).toEqual([
      ['c', 3],
      ['d', 4],
      ['0', 1],
      ['1', 2],
    ]);
  });
});

describe('it can pad the collection with the given value', () => {
  test('with the given value to the left', () => {
    const collection = _col().range(1, 5);
    const actual = collection.pad(-10, 0);
    expect(actual.all()).toEqual([0, 0, 0, 0, 0, 1, 2, 3, 4, 5]);
  });

  test('with the given value to the right', () => {
    const collection = _col().range(1, 5);
    const actual = collection.pad(10, 0);
    expect(actual.all()).toEqual([1, 2, 3, 4, 5, 0, 0, 0, 0, 0]);
  });

  test('with a non-sequential collection', () => {
    const collection = _col({ a: 1, b: 2 });
    const actual = collection.pad(5, 0);
    expect(actual.all()).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });
});

describe('it can pluck an array of values', () => {
  test('with a single key', () => {
    const collection = _col([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Jame Doe' },
    ]);
    const actual = collection.pluck('id');
    expect(actual.all()).toEqual([1, 2, 3]);
  });

  test('with specify how to get the value', () => {
    const collection = _col([
      { id: 1, department: { name: 'IT' } },
      { id: 2, department: { name: 'Sales' } },
      { id: 3, department: { name: 'Marketing' } },
    ]);
    const actual = collection.pluck('department.name');
    expect(actual.all()).toEqual(['IT', 'Sales', 'Marketing']);
  });
});

describe('it can pop an item from the collection', () => {
  test('with 1 item', () => {
    const collection = _col().range(1, 5);
    const actual = collection.pop();
    expect(actual).toEqual(5);
  });

  test('with multiple items', () => {
    const collection = _col().range(1, 5);
    const actual = collection.pop(2);
    expect(actual).toEqual([5, 4]);
  });

  test('from an empty collection', () => {
    const collection = _col();
    const actual = collection.pop();
    expect(actual).toBeUndefined();
  });
});

describe('it can prepend items to the collection', () => {
  test('to a sequential collection', () => {
    const collection = _col().range(1, 5);
    const actual = collection.prepend(-1);
    expect(actual.all()).toEqual([-1, 1, 2, 3, 4, 5]);
  });

  test('to a non-sequential collection', () => {
    const collection = _col({ b: 2, c: 3 });
    const actual = collection.prepend(1, 'a');
    expect(actual.all()).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });
});

describe('it can push an item to the collection', () => {
  test('to a sequential collection', () => {
    const collection = _col().range(1, 5);
    const actual = collection.push(6);
    expect(actual.all()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('to a non-sequential collection', () => {
    const collection = _col({ 0: 2, 2: 3 });
    const actual = collection.push('a');
    expect(actual.all()).toEqual([
      ['0', 2],
      ['2', 3],
      ['3', 'a'],
    ]);
  });
});

test('it can put an item in the collection', () => {
  const collection = _col({ a: '1', b: '2' });
  const actual = collection.put('b', '3');
  expect(actual.all()).toEqual([
    ['a', '1'],
    ['b', '3'],
  ]);
});

test('it can get an random item from the collection', () => {
  const collection = _col().range(1, 5);
  const actual = collection.random();
  expect(collection.contains(actual)).toBeTruthy();
});

describe('it can create a collection of numbers', () => {
  test('with the specified length', () => {
    const collection = _col().range(5);
    expect(collection.all()).toEqual([1, 2, 3, 4, 5]);
  });

  test('with a negative length', () => {
    const collection = _col().range(-3);
    expect(collection.all()).toEqual([-3, -2, -1]);
  });

  test('with increasing values', () => {
    const collection = _col().range(1, 5);
    expect(collection.all()).toEqual([1, 2, 3, 4, 5]);
  });

  test('with decreasing values', () => {
    const collection = _col().range(5, 1);
    expect(collection.all()).toEqual([5, 4, 3, 2, 1]);
  });

  test('with step value', () => {
    const collection = _col().range(1, 5, 2);
    expect(collection.all()).toEqual([1, 3, 5]);
  });

  test('with start value equal end value', () => {
    const collection = _col().range(1, 1);
    expect(collection.all()).toEqual([1]);
  });
});

test('it can reverse the collection', () => {
  const collection = _col().range(1, 5);
  const actual = collection.reverse();
  expect(actual.all()).toEqual([5, 4, 3, 2, 1]);
});

test('it can reverse a non-sequential collection', () => {
  const collection = _col({ a: 1, b: 2, c: 3 });
  const actual = collection.reverse();
  expect(actual.all()).toEqual([
    ['c', 3],
    ['b', 2],
    ['a', 1],
  ]);
});

describe('it can shift an item from the collection', () => {
  test('from a sequential collection', () => {
    const collection = _col().range(1, 5);
    const actual = collection.shift();
    expect(actual).toEqual(1);
    expect(collection.all()).toEqual([2, 3, 4, 5]);
  });

  test('from a non-sequential collection', () => {
    const collection = _col({ a: 1, b: 2 });
    const actual = collection.shift();
    expect(actual).toEqual(1);
    expect(collection.all()).toEqual([['b', 2]]);
  });

  test('from an empty collection', () => {
    const collection = _col();
    const actual = collection.shift();
    expect(actual).toBeUndefined();
  });
});

test('it can shuffle the collection', () => {
  const collection = _col().range(1, 5);
  const actual = collection.shuffle();
  expect(actual.all()).not.toEqual([1, 2, 3, 4, 5]);
});

test('it can slice the collection', () => {
  const collection = _col().range(1, 5);
  const actual = collection.slice(1, 3);
  expect(actual.all()).toEqual([2, 3]);
});

test('it can slice a non-sequential collection', () => {
  const collection = _col({ a: 1, b: 2, c: 3 });
  const actual = collection.slice(1, 2);
  expect(actual.all()).toEqual([['b', 2]]);
});

describe('it can sort the collection', () => {
  test('with a number collection', () => {
    const collection = _col().range(5, 1);
    const actual = collection.sort();
    expect(actual.all()).toEqual([1, 2, 3, 4, 5]);
  });

  test('with an object collection', () => {
    const collection = _col([
      { id: 3, name: 'Jame Doe' },
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 4, name: 'John Smith' },
    ]);
    const actual = collection.sort((a, b) => {
      return a.id - b.id;
    });
    expect(actual.all()).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Jame Doe' },
      { id: 4, name: 'John Smith' },
    ]);
  });

  test('with a non-sequential collection', () => {
    const collection = _col({ c: 3, a: 1, b: 2 });
    const actual = collection.sort((a, b) => {
      if (a[1] < b[1]) return -1;
      if (a[1] > b[1]) return 1;
      return 0;
    });
    expect(actual.all()).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });
});

describe('it can splice items from the collection', () => {
  test('with one argument', () => {
    const collection = _col().range(1, 5);
    const chunk = collection.splice(1);
    expect(chunk).toEqual([2]);
    expect(collection.all()).toEqual([1, 3, 4, 5]);
  });

  test('with two arguments', () => {
    const collection = _col().range(1, 5);
    const chunk = collection.splice(1, 2);
    expect(chunk).toEqual([2, 3]);
    expect(collection.all()).toEqual([1, 4, 5]);
  });

  test('with negative arguments', () => {
    const collection = _col().range(1, 5);
    collection.splice(-2, 2);
    expect(collection.all()).toEqual([1, 2, 3]);
  });

  test('with remove and replace', () => {
    const collection = _col(['Jan', 'Apr', 'May', 'Jun']);
    collection.splice(1, 2, ['Feb', 'Mar']);
    expect(collection.all()).toEqual(['Jan', 'Feb', 'Mar', 'Jun']);
  });

  test('with a non-sequential collection', () => {
    const collection = _col({ a: 1, d: 4 });
    const chunk = collection.splice(1, 0, [
      ['b', 2],
      ['c', 3],
    ]);
    expect(chunk).toEqual([]);
    expect(collection.all()).toEqual([
      ['a', 1],
      ['0', ['b', 2]],
      ['1', ['c', 3]],
      ['d', 4],
    ]);
  });
});

test('it can sum items in a collection with mixed object types', () => {
  const collection = _col([
    { id: 1, salary: 1000 },
    { id: 2, salary: 2000 },
    { id: 3, other: 3000 },
  ]);
  const actual = collection.sum('salary');
  expect(actual).toEqual(3001);
});

test('it can split the items of the collection into a specified number of groups', () => {
  const collection = _col().range(1, 5);
  const actual = collection.split(2);
  expect(actual.all()).toEqual([
    [1, 2, 3],
    [4, 5],
  ]);
});

describe('it can sum the values of the collection', () => {
  test('with a number collection', () => {
    const collection = _col().range(1, 5);
    const actual = collection.sum();
    expect(actual).toEqual(15);
  });

  test('with an object collection', () => {
    const collection = _col([
      { id: 1, salary: 1000 },
      { id: 2, salary: 2000 },
      { id: 3, salary: 3000 },
    ]);
    const actual = collection.sum('salary');
    expect(actual).toEqual(6000);
  });

  test('with an item in the collection that is an array', () => {
    const collection = _col([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    const actual = collection.sum();
    expect(actual).toEqual(9);
  });

  test('with an item in the collection that is a string', () => {
    const collection = _col(['John', 'Jane', 'Jame', 'John']);
    const actual = collection.sum();
    expect(actual).toEqual(4);
  });
});

test('it can pass the collection to the given callback and return the collection', () => {
  const collection = _col().range(1, 5);
  const actual = collection.tap(value => {
    expect(value.all()).toEqual([1, 2, 3, 4, 5]);
  });
  expect(actual.all()).toEqual([1, 2, 3, 4, 5]);
});

test('it can cast a collection to an array', () => {
  const collection = _col([_col().range(1, 5), _col().range(6, 10)]);
  const actual = collection.toArray();
  expect(actual).toEqual([
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
  ]);
});

describe('it can cast a collection to a json', () => {
  test('with a non-sequential collection', () => {
    const collection = _col({ a: 1, b: 2, 3: 'c' });
    const actual = collection.toJson();
    expect(actual).toEqual('{"3":"c","a":1,"b":2}');
  });

  test('with a sequential collection', () => {
    const collection = _col(['a', 'b', 'c']);
    const actual = collection.toJson();
    expect(actual).toEqual('["a","b","c"]');
  });
});

describe('it can cast a collection to a string', () => {
  test('with a sequential collection of primitives', () => {
    const collection = _col().range(1, 5);
    expect(collection.toString()).toEqual('1,2,3,4,5');
  });

  test('with a sequential collection of objects with a toJson method', () => {
    const obj1 = { toJson: () => '{"name":"John"}' };
    const obj2 = { toJson: () => '{"name":"Jane"}' };
    const collection = _col([obj1, obj2]);
    expect(collection.toString()).toEqual('{"name":"John"},{"name":"Jane"}');
  });

  test('with a non-sequential collection', () => {
    const collection = _col({ a: 1, b: 2 });
    expect(collection.toString()).toEqual(JSON.stringify({ a: 1, b: 2 }));
  });

  test('with a sequential collection of mixed items', () => {
    const objWithToJson = { toJson: () => '{"name":"John"}' };
    const objWithoutToJson = { name: 'Doe' };
    const collection = _col([1, 'hello', objWithToJson, objWithoutToJson, null, undefined]);
    expect(collection.toString()).toEqual('1,hello,{"name":"John"},[object Object],null,undefined');
  });
});

describe('it can filter out duplicates', () => {
  test('with a given key on a sequential collection', () => {
    const collection = _col([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 1, name: 'John Doe' },
    ]);
    const actual = collection.unique('id');
    expect(actual.all()).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ]);
  });

  test('without a given key on a sequential collection', () => {
    const collection = _col([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'John Doe' },
      { id: 1, name: 'John Doe' },
    ]);
    const actual = collection.unique();
    expect(actual.all()).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'John Doe' },
    ]);
  });

  test('with a number collection', () => {
    const collection = _col([1, 2, 3, 4, 1]);
    const actual = collection.unique();
    expect(actual.all()).toEqual([1, 2, 3, 4]);
  });

  test('with a string collection', () => {
    const collection = _col(['a', 'b', 'c', 'a']);
    const actual = collection.unique();
    expect(actual.all()).toEqual(['a', 'b', 'c']);
  });

  test('with a non-sequential collection', () => {
    const collection = _col({ a: 1, b: 2, c: 1 });
    const actual = collection.unique();
    expect(actual.all()).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 1],
    ]);
  });
});

describe('it can execute a callback when a condition is truthy', () => {
  test('with a param that satisfies the condition', () => {
    const collection = _col().range(1, 5);
    const user = { id: 1, name: 'John Doe' };
    const actual = collection.when(user, (col, user) => col.filter(value => value === user.id));
    expect(actual.all()).toEqual([1]);
  });

  test('with a function that satisfies the condition', () => {
    const collection = _col().range(1, 5);
    const actual = collection.when(
      col => col.count() > 3,
      col => col.filter(value => value > 3).values(),
    );
    expect(actual.all()).toEqual([4, 5]);
  });

  test('with a param that does not satisfy the condition and the default value is undefined', () => {
    const collection = _col().range(1, 5);
    const actual = collection.when(undefined, (col, user) => col.filter(value => value === user.id));
    expect(actual.all()).toEqual([1, 2, 3, 4, 5]);
  });

  test('with a param that does not satisfy the condition', () => {
    const collection = _col().range(1, 5);
    const actual = collection.when(
      undefined,
      (col, user) => col.filter(value => value === user.id).values(),
      col => col.filter(value => value > 3).values(),
    );
    expect(actual.all()).toEqual([4, 5]);
  });
});

describe('it can create a new collection with the param is not an array', () => {
  test('with a number', () => {
    const collection = _col(1);
    const actual = collection.all();
    expect(actual).toEqual([1]);
  });

  test('with a string', () => {
    const collection = _col('1');
    const actual = collection.all();
    expect(actual).toEqual(['1']);
  });

  test('with a non-arrayable object', () => {
    const TestClass = class {
      constructor() {
        this.a = 1;
      }
    };
    const collection = _col(new TestClass());
    expect(collection.all()).toEqual([['a', 1]]);
  });
});

test('it is an iterator', () => {
  const collection = _col().range(1, 5);
  for (const item of collection) {
    expect(collection.contains(item)).toBeTruthy();
  }
});

test('it can dump data', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  _col(_arr().range(3))
    .dump()
    .map(i => i + 1)
    .dump();

  const expected1 = new Map();
  expected1.set('0', 1);
  expected1.set('1', 2);
  expected1.set('2', 3);

  const expected2 = new Map();
  expected2.set('0', 2);
  expected2.set('1', 3);
  expected2.set('2', 4);

  expect(consoleLogSpy).toHaveBeenNthCalledWith(1, expected1);
  expect(consoleLogSpy).toHaveBeenNthCalledWith(2, expected2);
});
