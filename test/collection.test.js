const { _col } = require('../dist');

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

test('it can concatenate two collections', () => {
  const collection1 = _col().range(1, 3);
  const collection2 = _col().range(4, 6);
  const actual = collection1.concat(collection2);
  expect(actual.all()).toEqual([1, 2, 3, 4, 5, 6]);
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

test('it can get items different from another collection', () => {
  const collection = _col().range(1, 5);
  const actual = collection.diff(_col().range(3, 5));
  expect(actual.all()).toEqual([1, 2]);
});

test('it can paginate a collection', () => {
  const collection = _col().range(1, 5);
  const actual = collection.forPage(2, 2);
  expect(actual.all()).toEqual([3, 4]);
});
