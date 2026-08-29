const { _obj } = require('../dist');

describe('it can combine a key list and a value list into one object', () => {
  test('with equal length keys and length values', () => {
    const keys = ['id', 'name'];
    const values = [1, 'Nam'];
    expect(_obj.combine(keys, values)).toEqual({ id: 1, name: 'Nam' });
  });

  test('with the length of the keys being greater than the length of the values', () => {
    const keys = ['id', 'name', 'email'];
    const values = [1, 'Nam'];
    expect(_obj.combine(keys, values)).toEqual({ id: 1, name: 'Nam', email: null });
  });

  test('with the length of the keys being less than the length of the values', () => {
    const keys = ['id', 'name'];
    const values = [1, 'Nam', 'nam@example.com'];
    expect(_obj.combine(keys, values)).toEqual({ id: 1, name: 'Nam', key_0: 'nam@example.com' });
  });
});

describe('it can get an item from an array using "dot" notation', () => {
  test('with an object that have the properties to get', () => {
    const user = { id: 1, address: { district: 3 } };
    expect(_obj.get(user, 'address.district')).toEqual(3);
  });

  test('with an object that does not have the properties to get', () => {
    const user = { id: 1 };
    expect(_obj.get(user, 'address.district', 'default value')).toEqual('default value');
  });

  test('with the default value being the callback function', () => {
    const user = { id: 1 };
    expect(_obj.get(user, 'address.district', () => 'default value')).toEqual('default value');
  });

  test('without the default value', () => {
    const user = { id: 1 };
    expect(_obj.get(user, 'address.district')).toBeNull();
  });
});

test('it can set an object item to a given value using "dot" notation', () => {
  const user = { id: 1 };
  _obj.set(user, 'address.district', 3);
  expect(user).toEqual({ id: 1, address: { district: 3 } });
});

test('it can get a subset of the items from the given object', () => {
  const user = { id: 1, name: 'Nam' };
  expect(_obj.only(user, ['id'])).toEqual({ id: 1 });
  expect(_obj.only()).toEqual({});
});

test('it can get all of the given object except for a specified object of keys', () => {
  const user = { id: 1, name: 'Nam', email: 'nam@example.com' };
  expect(_obj.except(user, ['id'])).toEqual({ name: 'Nam', email: 'nam@example.com' });
  expect(_obj.except()).toEqual({});
});

test('it can deeply check whether the properties exist or not', () => {
  const user = { id: 1, address: { district: 3 } };
  expect(_obj.has(user, 'address.district')).toBeTruthy();
  expect(_obj.has(user, 'name')).toBeFalsy();
});

test('it can run a map over each of the properties in the object', () => {
  const routes = {
    home: {
      controller: 'HomeController',
      url: '/',
    },
    about: {
      controller: 'HomeController',
      url: '/about',
    },
  };
  const links = _obj.map(routes, item => `https://domain.example${item.url}`);
  const actions = _obj.map(routes, (item, key) => `${item.controller}@${key}`);
  expect(links).toEqual(['https://domain.example/', 'https://domain.example/about']);
  expect(actions).toEqual(['HomeController@home', 'HomeController@about']);
  expect(_obj.map(undefined, item => item)).toEqual([]);
});

test('it can convert an object to a query string with each property', () => {
  const filters = {
    search: { name: 'Nam' },
    sort_field: 'id',
    sort_direction: 'desc',
    name: null,
    filter: { name: null },
  };
  expect(_obj.toQueryString(filters)).toEqual('?search%5Bname%5D=Nam&sort_field=id&sort_direction=desc');
});

test('it can replicate an object', () => {
  class User {
    constructor(name) {
      this.name = name;
    }
  }
  const user1 = new User('Nam');
  const user2 = _obj.replicate(user1);

  expect(user1).toEqual(user2);
});
