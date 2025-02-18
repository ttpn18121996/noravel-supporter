# Noravel supporter

This is a support library for Nam's projects.

# Content

- [Object](#object)
- [Array](#array)
- [String](#string)
- [Collection](#collection)
- [Helper](#helper)

## Object

```js
const { _obj } = require('@noravel/supporter');

// OR

import { _obj } from '@noravel/supporter';
```

### \_obj.combine()

Create a new object with each key associated with each corresponding value.

```js
const keys = ['id', 'name'];
const values = [1, 'Trinh Tran Phuong Nam'];

console.log(_obj.combine(keys, values));
/*
{
  id: 1,
  name: 'Trinh Tran Phuong Nam'
}
*/
```

In case the key length is greater than the value length.

```js
const keys = ['id', 'name', 'email'];
const values = [1, 'Trinh Tran Phuong Nam'];

console.log(_obj.combine(keys, values));
/*
{
  id: 1,
  name: 'Trinh Tran Phuong Nam',
  email: null
}
*/
```

In case the price length is greater than the key length.

```js
const keys = ['id', 'name'];
const values = [1, 'Trinh Tran Phuong Nam', 'namttp@example.com', 'bla bla'];

console.log(_obj.combine(keys, values));
/*
{
  id: 1,
  name: 'Trinh Tran Phuong Nam',
  key_0: 'namttp@example.com',
  key_1: 'bla bla'
}
*/
```

### \_obj.get()

Get an item from an array using "dot" notation.

```js
const data = {
  user: {
    id: 1,
    name: 'Trinh Tran Phuong Nam',
  },
};

console.log(_obj.get(data, 'user.name')); // 'Trinh Tran Phuong Nam'
console.log(_obj.get(data, 'user.email')); // null
console.log(_obj.get(data, 'user.email', 'namttp@example.com')); // 'namttp@example.com'
console.log(_obj.get(data, 'user.email', () => 'We can pass the callback here.')); // 'We can pass the callback here.'
```

### \_obj.set()

Set an object item to a given value using "dot" notation.

```js
const data = {
  user: {
    id: 1,
    name: 'Trinh Tran Phuong Nam',
  },
};

console.log(_obj.get(data, 'user.email')); // null

_obj.set(data, 'user.email', 'namttp@example.com');

console.log(_obj.get(data, 'user.email')); // 'namttp@example.com'
```

### \_obj.only()

Get a subset of the items from the given object.

```js
const user = {
  id: 1,
  name: 'Trinh Tran Phuong Nam',
  email: 'namttp@example.com',
  address: 'Everywhere',
};

console.log(_obj.only(user, 'id')); // { id: 1 }
console.log(_obj.only(user, ['id', 'name'])); // { id: 1, name: 'Trinh Tran Phuong Nam' }
```

### \_obj.except()

Get all of the given object except for a specified object of keys.

```js
const user = {
  id: 1,
  name: 'Trinh Tran Phuong Nam',
  email: 'namttp@example.com',
};

console.log(_obj.except(user, 'email')); // { id: 1, name: 'Trinh Tran Phuong Nam' }
console.log(_obj.except(user, ['name', 'email'])); // { id: 1 }
```

### \_obj.has()

Deeply check whether the properties exist or not.

```js
const user = {
  id: 1,
  address: {
    city: 'Sample city',
  },
};

console.log(_obj.has(user, 'address.city')); // true
console.log(_obj.has(user, 'address.district')); // false
```

### \_obj.map()

Run a map over each of the properties in the object.

```js
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

console.log(links); // ['https://domain.example/', 'https://domain.example/about']
console.log(actions); // ['HomeController@home', 'HomeController@about']
```

### \_obj.toQueryString()

Convert an object to a query string with each property.

```js
const filters = { search: { name: 'Nam' }, sort_field: 'id', sort_direction: 'desc' };

console.log(_obj.toQueryString(filters)); // '?search[name]=Nam&sort_field=id&sort_direction=desc'
```

### \_obj.replicate()

Clone the object into a new, non-existing instance.

```js
const user = new User();
const clone = _obj.replicate(user);

JSON.stringify(user) === JSON.stringify(clone); // true
```

## Array

```js
const { _arr } = require('@noravel/supporter');

// OR

import { _arr } from '@noravel/supporter';
```

### \_arr().chunk()

Chunk the array into chunks of the given size.

```js
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(_arr(data).chunk(2)); // [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]
```

### \_arr().collapse()

Collapse the array into a single array.

```js
const data = [[1, 2, 3], [4, 5, 6, 7], [8, 9], [10]];

console.log(_arr(data).collapse()); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

### \_arr().first()

Returns the first element of the array.

```js
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(_arr(data).first()); // 1
```

### \_arr().mapToGroups()

Run a grouping map over the items. The callback should return an array with a single key/value pair.

```js
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

console.log(_arr(users).mapToGroups(user => [user.department, user.name]));
/*
{
  Sales: ['John Doe', 'Jane Doe'],
  Marketing: ['Johnny Doe'],
}
*/
```

### \_arr().pluck()

Pluck an array of values from an array.

```js
const users = [
  {
    id: 1,
    name: 'Trinh Tran Phuong Nam',
  },
  {
    id: 2,
    name: 'John Doe',
  },
];

console.log(_arr(users).pluck('id')); // [1, 2]
```

### \_arr().range()

Creates an array of numbers processing from "start" up to "end" (including "end").

```js
console.log(_arr().range(10)); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(_arr().range(-10)); // [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1]
console.log(_arr().range(0, 10)); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(_arr().range(1, 10, 2)); // [1, 3, 5, 7, 9]
console.log(_arr().range(10, 1)); // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
console.log(_arr().range(10, 1, 2)); // [10, 8, 6, 4, 2]
```

### \_arr().supplement()

Add elements to ensure the length of the array.

```js
const data = ['a', 'b', 'c'];

console.log(_arr(data).supplement(5)); // ['a', 'b', 'c', null, null]
console.log(_arr(data).supplement(5, 'additional item')); // ['a', 'b', 'c', 'additional item', 'additional item']
```

### \_arr().unique()

Filter out duplicate elements to ensure that array elements are unique.

```js
const data = ['a', 'b', 1, 2, 'a', '1'];
console.log(_arr(data).unique()); // ['a', 'b', 1, 2, '1']
```

Check for a unique value for an array element that is an object by key.

```js
const users = [
  {
    id: 1,
    name: 'Trinh Tran Phuong Nam',
  },
  {
    id: 2,
    name: 'John Doe',
  },
  {
    id: 1,
    name: 'Trinh Tran Phuong Nam',
  },
];

console.log(_arr(users).unique('id'));
/*
[
  {
    id: 1,
    name: 'Trinh Tran Phuong Nam',
  },
  {
    id: 2,
    name: 'John Doe',
  },
]
*/
```

### \_arr().toSelectOptions()

The first parameter is an array with 2 elements,
the first element is the name of the key that will be taken as the value of the option
and the second element is the name of the key that will be taken as the label.

The second parameter is an array with 2 elements,
the first element is the name of the key that stores the value of the element retrieved by the key
in the first parameter and the second element is the name of the key that stores the value of the element
is obtained by the second key in the first parameter.

```js
const users = [
  {
    id: 1,
    name: 'Trinh Tran Phuong Nam',
    email: 'namttp@example.com',
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john_doe@example.com',
  }
];

const options = _arr(users).toSelectOptions(['id', 'name'], ['value', 'label']);
console.log(options);
/*
[
  {
    value: 1,
    label: 'Trinh Tran Phuong Nam',
  },
  {
    value: 2,
    label: 'John Doe',
  },
]
*/

// Example for react component
<select>
  {options.map(option => (
      <option value={option.value} key={option.value}>
        {option.label}
      </option>
    )
  )}
</select>

<Select options={options} />
```

In case the array elements are not an object.
The element's index will be the value of the option, the element's value will be the label.

```js
const status = ['new', 'in process', 'done'];
console.log(_arr(status).toSelectOptions());
/*
[
  {
    value: 0,
    label: 'new',
  },
  {
    value: 1,
    label: 'in process',
  },
  {
    value: 2,
    label: 'done',
  },
]
*/
```

### \_arr().isEmpty()

Check for empty array.

```js
console.log(_arr([]).isEmpty()); // true
console.log(_arr([]).supplement(10).isEmpty()); // false
```

### \_arr().dump()

You can log the results of each processing segment for easy debugging.

```js
_arr()
  .range(3)
  .dump()
  .map(i => i + 1)
  .dump();

// [0, 1, 2]
// [1, 2, 3]
```

## String

```js
const { _str } = require('@noravel/supporter');

// OR

import { _str } from '@noravel/supporter';
```

### \_str().get()

Get the raw string value.

```js
console.log(_str('Lorem ipsum').get()); // 'Lorem ipsum'

// OR

console.log(_str('Lorem ipsum').toString()); // 'Lorem ipsum'
```

You can also get a substring from the start position to the end position.

```js
console.log(_str('Lorem ipsum').get(6, 11)); // 'ipsum'
```

### \_str().length()

Get the length of the string.

```js
console.log(_str('Nam').length()); // 3
```

### \_str().after()

Return the remainder of a string after the first occurrence of a given value.

```js
console.log(_str('This is my name').after(' ').get()); // 'is my name'
```

### \_str().afterLast()

Return the remainder of a string after the last occurrence of a given value.

```js
console.log(_str('/path/to/filename.extension').afterLast('/').get()); // 'filename.extension'
```

### \_str().before()

Get the portion of a string before the first occurrence of a given value.

```js
console.log(_str('This is my name').before(' ').get()); // 'This'
```

### \_str().beforeLast()

Get the portion of a string before the last occurrence of a given value.

```js
console.log(_str('This is my name').beforeLast(' ').get()); // 'This is my'
```

### \_str().between()

Get the portion of a string between two given values.

```js
console.log(_str('This is my name').between('This', 'name').get()); // ' is my '
```

### \_str().betweenFirst()

Get the smallest possible portion of a string between two given values.

```js
console.log(_str('[a] bc [d]').betweenFirst('[', ']').get()); // 'a'
console.log(_str('[a] bc [d]').between('[', ']').get()); // 'a] bc [d'
```

### \_str().bind()

Binds the values ​​to the given string.

```js
const user = { user_id: 1, name: 'John Doe' };
const url = '/api/users/{user_id}/edit';

console.log(_str(url).bind(user).get()); // '/api/users/1/edit'
```

```js
const user = { user_id: 1, name: 'John Doe' };
const url = '/api/users/{0}/edit';

console.log(_str(url).bind(user.user_id).get()); // '/api/users/1/edit'
```

```js
const user = { user_id: 1, name: 'John Doe' };
const post = { post_id: 1812, title: 'Title', content: 'Content' };
const url = '/api/users/{0}/post/{1}/edit';

console.log(_str(url).bind(user.user_id, post.post_id).get()); // '/api/users/1/post/1812/edit'
console.log(_str(url).bind([user.user_id, post.post_id]).get()); // '/api/users/1/post/1812/edit'
```

### \_str().append()

Append the given values to the string.

```js
console.log(_str('This is').append(' my name').get()); // 'This is my name'
```

### \_str().prepend()

Prepend the given values to the string.

```js
console.log(_str('/api/users').prepend('https://domain.example').get()); // 'https://domain.example/api/users'
```

### \_str().title()

Convert the given string to proper case.

```js
console.log(_str('trinh tran phuong nam').title().get()); // 'Trinh Tran Phuong Nam'
```

### \_str().studly()

Convert a value to studly caps case.

```js
console.log(_str('phuong_nam').studly().get()); // 'PhuongNam'
```

### \_str().camel()

Convert a value to camel case.

```js
console.log(_str('phuong_nam').camel().get()); // 'phuongNam'
```

### \_str().lower()

Convert the given string to lower-case.

```js
console.log(_str('NAM').lower().get()); // 'nam'
```

### \_str().upper()

Convert the given string to upper-case.

```js
console.log(_str('nam').upper().get()); // 'NAM'
```

### \_str().nonUnicode()

Remove Vietnamese unicode characters from the string.

```js
console.log(_str('Trịnh Trần Phương Nam').upper().get()); // 'Trinh Tran Phuong Nam'
```

### \_str().snake()

Convert a string to snake case.

```js
console.log(_str('trinhTranPhuongNam').snake().get()); // 'trinh_tran_phuong_nam'

console.log(_str('trinhTranPhuongNam').snake('-').get()); // 'trinh-tran-phuong-nam'
```

### \_str().kebab()

Convert a string to kebab case.

```js
console.log(_str('trinhTranPhuongNam').kebab().get()); // 'trinh-tran-phuong-nam'
```

### \_str().escapeHtml()

Escape HTML character.

```js
console.log(_str('<p>Hello world</p>').escapeHtml().get()); // '&lt;p&gt;Hello world&lt;/p&gt;'
```

### \_str().limit()

Limit the number of characters in a string.

```js
console.log(_str('The quick brown fox jumps over the lazy dog').limit(20).get()); // 'The quick brown fox...'
```

### \_str().random()

Generate a more truly "random" string. The `includeSymbols` option includes the following characters:

```text
!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
```

```js
console.log(_str().random(20)); // 'kvyufaqbosqlcojacnqo'
console.log(_str().random(20, { includeUppercase: true })); // 'KJqGfjKjccCjHnmmxyeM'
console.log(_str().random(20, { includeNumbers: true })); // 'h372ysnmr71klxekb4fs'
console.log(_str().random(20, { includeSymbols: true })); // '[-\\jb'p*w_i}@(;|t"zh'

// full options
const options = {
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
};
const password = _str().random(20, options);

console.log(password); // '6!?iR(2)iQW}>UY})owi'
```

### \_str().shuffle()

Randomly shuffles a string.

```js
console.log(_str('abcdefghijklmnopqrstuvwxyz').shuffle().get()); // 'zjmpnleuqfcsakigwhoxrdytbv'
```

### \_str().replace()

Replace the given value in the given string.

```js
console.log(
  _str('Hello everyone')
    .replace(/^Hello/, 'Hi')
    .get(),
); // 'Hi everyone'
```

### \_str().replaceAt()

Replace the given value in the given string from a specific position.

```js
console.log(_str('Hello everyone').replaceAt(2, '!!').get()); // 'He!!o everyone'
```

### \_str().splice()

Split a string from a specific position and then insert the splice into the slice.

```js
console.log(_str('Hello everyone!!!').splice(6, 8, '**everyone**').get()); // 'Hello **everyone**!!!'
```

### \_str().slice()

Extracts a section of this string and returns it as a new string.
The start value is the position taken from and the end value is the position taken to.
Start = 0 is equivalent to the first character of the string.
The ending value includes the character at that position.

```js
const str = 'The quick brown fox jumps over the lazy dog.';

console.log(_str(str).slice(31).get()); // 'the lazy dog.'
console.log(_str(str).slice(4, 19).get()); // 'quick brown fox'
console.log(_str(str).slice(-4).get()); // 'dog.'
console.log(_str(str).slice(-9, -5).get()); // 'lazy'
console.log(_str(str).slice(-9).upper().slice(0, 8).get()); // 'LAZY DOG'
```

### \_str().padStart()

Pads a given value in front of a given string until the given length is reached.

```js
console.log(_str('1').padStart(2, '0').get()); // '01'

const email = 'namttp@example.com';
const marked = _str(email)
  .before('@')
  .slice(-3)
  .padStart(_str(email).before('@').length(), '*')
  .append(_str(email).after('@').prepend('@').get())
  .get();
console.log(marked); // '***ttp@example.com'
```

### \_str().padEnd()

Pads a given value behind a given string until the given length is reached.

```js
console.log(_str('200').padEnd(10, '-').get()); // '200-------'
console.log(_str('200').padEnd(5)); // '200     '
```

### \_str().caseString()

Casts a value to a string type.

```js
console.log(_str().caseString({ id: 1, name: 'Nam' })); // '[object Object]'
console.log(_str().caseString([1, 2, 3])); // '1,2,3'
console.log(_str().caseString({ toString: () => 'Stringable' })); // 'Stringable'
console.log(_str().caseString(NaN)); // 'NaN'
console.log(_str().caseString(() => {})); // '() => {}'
console.log(
  _str().caseString(function () {
    return 'this is a function';
  }),
); // function () { return 'this is a function'; }
```

### \_str().dump()

Same as `_arr().dump()` You can log the results of each processing segment for easy debugging.

```js
_str('namttp@example.com')
  .before('@')
  .dump()
  .slice(-3)
  .dump()
  .padStart(_str(email).before('@').length(), '*')
  .dump()
  .append(_str(email).after('@').prepend('@').get())
  .dump();

/*
namttp
ttp
***ttp
***ttp@example.com
*/
```

## Collection

Create a collection instance from an array or object.

```js
const { _col, Collection } = require('@noravel/supporter');

// OR

import { _col, Collection } from '@noravel/supporter';

...

console.log(_col([1, 2, 3]).all()); // [1, 2, 3]

// OR

console.log(new Collection([1, 2, 3]).all()); // [1, 2, 3]
```

You can create a new instance of the collection by passing a parameter that is not an array.

```js
console.log(_col('Hello world').all()); // ['Hello world']
console.log(_col(123).all()); // [123]
console.log(_col({ name: 'John', age: 30 }).all()); // [{ name: 'John', age: 30 }]
```

### \_col().all()

Get all items in the collection as an array.

```js
console.log(_col().all()); // []
console.log(_col([1, 2, 3, 4, 5]).all()); // [1, 2, 3, 4, 5]
```

### \_col().chunk()

Split an array into chunks of the specified size.

```js
console.log(_col([1, 2, 3, 4, 5]).chunk(2).all()); // [[1, 2], [3, 4], [5]]
```

### \_col().collapse()

Collapse an array of arrays into a single array.

```js
console.log(_col([[1, 2], [3, 4], [5]]).collapse().all()); // [1, 2, 3, 4, 5]
```

### \_col().collect()

Get a shallow copy of this collection.

```js
console.log(_col([1, 2, 3, 4, 5]).collect().all()); // [1, 2, 3, 4, 5]
```

### \_col().concat()

The `concat` method concatenates the underlying array with the given array or collection and return a new collection.

```js
console.log(_col([1, 2, 3]).concat([3, 4, 5]).all()); // [1, 2, 3, 3, 4, 5]
```

### \_col().contains()

Check if a value is present in the collection.

```js
console.log(_col([1, 2, 3]).contains(2)); // true

// OR

console.log(_col([1, 2, 3]).contains(value => value === 3)); // true
```

### \_col().count()

Get the number of items in the collection.

```js
console.log(_col([1, 2, 3]).count()); // 3
```

### \_col().crossJoin()

Cross join the given arrays.

```js
console.log(_col([1, 2]).crossJoin(['a', 'b']).all()); // [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
console.log(_col([1, 2]).crossJoin(['a', 'b'], ['I', 'II']).all());
/*
[
  [1, 'a', 'I'],
  [1, 'a', 'II'],
  [1, 'b', 'I'],
  [1, 'b', 'II'],
  [2, 'a', 'I'],
  [2, 'a', 'II'],
  [2, 'b', 'I'],
  [2, 'b', 'II']
]
*/
```

### \_col().diff()

The `diff` method compares the collection against another collection or a plain array based on its values.
This method will return the values in the original collection that are not present in the given collection or array.

```js
const collection = _col([1, 2, 3, 4, 5]);
const diff = collection.diff([2, 4, 6, 8]);
console.log(diff.all()); // [1, 3, 5]
```

### \_col().each()

This will iterate over the items in the collection and pass each item to the given closure.

```js
_col([1, 2, 3]).each(value => console.log(value)); // 1 2 3
```

If you would like to stop iterating through the items, you may return false from your closure.

```js
_col([1, 2, 3, 4, 5]).each(value => {
  if (value > 3) {
    return false
  };

  console.log(value);
}); // 1 2 3
```

### \_col().every()

The `every` method may be used to verify that all elements of a collection pass a given truth test.

```js
console.log(_col([1, 2, 3, 4, 5]).every(value => value < 4)); // false
```

If the collection is empty, the `every` method will return `true`.

```js
console.log(_col().every(value => value < 4)); // true
```

### \_col().filter()

The `filter` method filters the collection using the given callback,
keeping only those items that pass a given truth test.

```js
const collection = _col([1, 2, 3, 4, 5]);
const filtered = collection.filter(value => value < 4);
console.log(filtered.all()); // [1, 2, 3]
```

If no callback is supplied, all entries of the collection that are equivalent to `false` will be returned.

```js
const collection = _col([0, 1, 2, 3, null, false, '', undefined, [], {}, { isEmpty: () => true }, { count: () => 0 }]);
const filtered = collection.filter();
console.log(filtered.all()); // [1, 2, 3]
```

### \_col().first()

The `first` method returns the first element in the collection that passes a given truth test.

```js
console.log(_col([1, 2, 3, 4, 5]).first(value => value > 3)); // 4
```

You may also call the `first` method with no arguments to get the first element in the collection.
If the collection is empty, it will return `undefined`.

```js
console.log(_col([1, 2, 3, 4, 5]).first()); // 1
```

### \_col().forPage()

The `forPage` method returns a new collection containing the items that would be present on a given page number.
The method accepts the page number as its first argument and the number of items to show per page as its second argument.
By default, the number of items per page is 10.

```js
const collection = _col([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const page = collection.forPage(2, 3);
console.log(page.all()); // [4, 5, 6]
```

### \_col().groupBy()

The `groupBy` method groups the collection's items by a given key.

```js
const collection = _col([
  { name: 'John Doe', department: 'IT' },
  { name: 'Jane Doe', department: 'IT' },
  { name: 'Jame Doe', department: 'Sales' },
]);
const grouped = collection.groupBy('department');
console.log(grouped.all());
/*
{
  IT: [
    { name: 'John Doe', department: 'IT' },
    { name: 'Jane Doe', department: 'IT' },
  ],
  Sales: [
    { name: 'Jame Doe', department: 'Sales' },
  ],
}
*/
```

### \_col().intersect()

The `intersect` method removes any values from the original collection that are not present in the given collection or array.

```js
const collection = _col([1, 2, 3, 4, 5]);
const intersected = collection.intersect([1, 2, 4]);
console.log(intersected.all()); // [1, 2, 4]
```

### \_col().isEmpty()

The `isEmpty` method returns `true` if the collection is empty, `false` otherwise.

```js
const collection = _col([]);
console.log(collection.isEmpty()); // true

const collection2 = _col([1, 2, 3]);
console.log(collection2.isEmpty()); // false
```

### \_col().isNotEmpty()

The `isNotEmpty` method returns `true` if the collection is not empty, `false` otherwise.

```js
const collection = _col([1, 2, 3]);
console.log(collection.isNotEmpty()); // true

const collection2 = _col([]);
console.log(collection2.isNotEmpty()); // false
```

### \_col().last()

The `last` method returns the last element of the collection that passes a given truth test.

```js
const collection = _col([1, 2, 3]);
console.log(collection.last(value => value < 3)); // 2
```

You may also call the `last` method with no arguments to get the last element in the collection.
If the collection is empty, it will return `undefined`.

```js
const collection = _col([1, 2, 3]);
console.log(collection.last()); // 3
```

### \_col().map()

The `map` method iterates through the collection and passes each value to the given callback.
The callback is free to modify the item and return it, thus forming a new collection of modified items.

```js
const collection = _col([1, 2, 3]);
const multiplied = collection.map(value => value * 2);
console.log(multiplied.all()); // [2, 4, 6]
```

### \_col().mapToGroups()

The `mapToGroups` method groups the collection's items by the given closure.
The closure should return an array with two elements, the first being the group key and the second being the item.
If closure returns an array with number of elements different from 2, it will throw an error.

```js
const collection = _col([
  { name: 'John', department: 'IT' },
  { name: 'Jane', department: 'Marketing' },
  { name: 'Bob', department: 'IT' }
]);
const grouped = collection.mapToGroups(item => [item.department, item.name]);
console.log(grouped);
/*
{
  IT: ['John', 'Bob'],
  Marketing: ['Jane'],
}
*/
```

### \_col().merge()

The `merge` method merges the given array or collection with the original collection.
Unlike the `concat` method, this method only merges non-existent elements in the origin collection
and modifies the original collection.

```js
const collection1 = _col([1, 2, 3]);
const collection2 = _col([3, 4, 5]);
collection1.merge(collection2);
console.log(collection1.all()); // [1, 2, 3, 4, 5]

const users1 = _col([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Jame' },
]);
const users2 = _col([
  { id: 1, name: 'John' },
  { id: 4, name: 'Bob' },
]);
users1.merge(users2);
console.log(users1.all());
/* 
[
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Jame' },
  { id: 4, name: 'Bob' },
]
*/
```

### \_col().pad()

The `pad` method will fill the array with the given value until the array reaches the specified size.
To pad to the left, you should specify a negative size.
No padding with take place if the absolute value of the size is less than or equal to the array length.

```js
const collection = _col([1, 2, 3]);
let filtered = collection.pad(5, 0);
console.log(filtered.all()); // [1, 2, 3, 0, 0]

filtered = collection.pad(-5, 0);
console.log(filtered.all()); // [0, 0, 1, 2, 3]
```

### \_col().pluck()

The `pluck` method retrieves all of the values for a given key.

```js
const collection = _col([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Jame' },
]);

const names = collection.pluck('name');
console.log(names); // ['John', 'Jane', 'Jame']
```

The `pluck` method also supports retrieving nested values using `dot` notation.

```js
const collection = _col([
  { id: 1, department: { name: 'IT' } },
  { id: 2, department: { name: 'Sales' } },
  { id: 3, department: { name: 'Marketing' } },
]);

const names = collection.pluck('department.name');
console.log(names); // ['IT', 'Sales', 'Marketing']
```

### \_col().pop()

The `pop` method removes and returns the last item from the collection.

```js
const collection = _col([1, 2, 3, 4, 5]);
const popped = collection.pop();
console.log(popped); // 5
console.log(collection.all()); // [1, 2, 3, 4]
```

You may pass an integer to the `pop` method to remove and return multiple items from the end of a collection.

```js
const collection = _col([1, 2, 3, 4, 5]);
const popped = collection.pop(2);
console.log(popped); // [5, 4]
console.log(collection.all()); // [1, 2, 3]
```

### \_col().prepend()

The `prepend` method will add the given value(s) to the beginning of the collection.

```js
const collection = _col([1, 2, 3]);
collection.prepend(-1, 0);
console.log(collection.all()); // [-1, 0, 1, 2, 3]
```

### \_col().push()

The `push` method will add the given item to the end of the collection.

```js
const collection = _col([1, 2, 3]);
collection.push(4);
console.log(collection.all()); // [1, 2, 3, 4]
```

### \_col().random()

The `random` method will return a random item from the collection.

```js
const collection = _col([1, 2, 3, 4, 5]);
const random = collection.random();
console.log(random); // 3 - (retrieved randomly)
```

### \_col().range()

The `range` method returns a collection containing integers between the specified range.
If the first argument is greater than the second, it will return a collection decreasing in value.

```js
const collection = _col.range(3, 5);
console.log(collection.all()); // [3, 4, 5]

const decreased = _col.range(5, 3);
console.log(decreased.all()); // [5, 4, 3]
```

You may also pass a third argument to specify the step value.

```js
const collection = _col.range(1, 10, 2);
console.log(collection.all()); // [1, 3, 5, 7, 9]
```

If the first argument is equal to the second, it will return a collection with 1 element.

```js
const collection = _col.range(3, 3);
console.log(collection.all()); // [3]
```

### \_col().reverse()

The `reverse` method returns a new collection with the items in reverse order.

```js
const collection = _col([1, 2, 3, 4, 5]);
const reversed = collection.reverse();
console.log(reversed.all()); // [5, 4, 3, 2, 1]
```

### \_col().shift()

The `shift` method removes and returns the first element of the collection.

```js
const collection = _col([1, 2, 3, 4, 5]);
const shifted = collection.shift();
console.log(shifted); // 1
console.log(collection.all()); // [2, 3, 4, 5]
```

### \_col().shuffle()

The `shuffle` method returns a new collection with the items in random order.

```js
const collection = _col([1, 2, 3, 4, 5]);
const shuffled = collection.shuffle();
console.log(shuffled.all()); // [3, 5, 2, 4, 1] - (retrieved randomly)
```

### \_col().slice()

The `slice` method returns a new collection containing a slice of the items in the original collection.

```js
const collection = _col([1, 2, 3, 4, 5]);
const sliced = collection.slice(1, 4);
console.log(sliced.all()); // [2, 3, 4]
```

### \_col().sort()

The `sort` method returns a new collection with the items in sorted order.

```js
const collection = _col([3, 5, 2, 4, 1]);
const sorted = collection.sort();
console.log(sorted.all()); // [1, 2, 3, 4, 5]
```

You may also pass a closure to specify the sorting criteria.

```js
const collection = _col([
  { id: 3, name: 'Jame Doe' },
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
  { id: 4, name: 'John Smith' },
]);
const sorted = collection.sort((a, b) => a.id - b.id);
console.log(sorted.all());
/*
[
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
  { id: 3, name: 'Jame Doe' },
  { id: 4, name: 'John Smith' },
]
*/
```

### \_col().splice()

The `splice` method removes and gets the spliced items in the collection.

```js
const collection1 = _col([1, 2, 3, 4, 5, 6]);
collection1.splice(1);
console.log(collection1.all()); // [1]

const collection2 = _col([1, 2, 3, 4, 5, 6]);
collection2.splice(1, 2);
console.log(collection2.all()); // [1, 4, 5, 6]

const collection3 = _col(['Jan', 'Apr', 'May', 'Jun']);
collection3.splice(1, 0, 'Feb', 'Mar');
console.log(collection3.all()); // ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
```

#### \_col().split()

The `split` method breaks a collection into the given number of groups,
filling non-terminal groups completely before allocating the remainder to the final group.

```js
const collection = _col([1, 2, 3, 4, 5]);
const groups = collection.split();
console.log(groups.all()); // [[1, 2], [3, 4], [5]]
```

### \_col().sum()

The `sum` method returns the sum of the items in the collection.

```js
const collection = _col([1, 2, 3, 4, 5]);
const sum = collection.sum();
console.log(sum); // 15
```

If the item of the collection is an array, the sum of the length of the array is returned.

```js
const collection = _col([[1, 2], [3, 4], [5]]);
const sum = collection.sum();
console.log(sum); // 5
```

If the item of the collection is an object,
you should pass a key to the `sum` method to calculate the sum of the values of that key.

```js
const collection = _col([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]);
const sum = collection.sum('id');
console.log(sum); // 3
```

### \_col().tap()

The `tap` method passes the collection to the given callback,
allowing you to `tap` into the collection at a specific point and do something with the items while not affecting
the collection itself.
The collection is then returned bt the `tap` method.

```js
const shifted = _col([2, 4, 3, 1, 5])
  .sort()
  .tap(function (collection) {
    collection.dump(); // [1, 2, 3, 4, 5]
  })
  .shift();
console.log(shifted); // 1
```

### \_col().toArray()

The `toArray` method returns all items in the collection as a plain array.
If the item of the collection is an instance of the object has a `toArray` method,
the `toArray` method will be called recursively.

```js
const collection = _col([
  _col().range(1, 5),
  _col().range(6, 10),
]);
const toArray = collection.toArray();
const all = collection.all();
console.log(toArray); // [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]
console.log(all);
/*
[
  Collection { items: [ 1, 2, 3, 4, 5 ] },
  Collection { items: [ 6, 7, 8, 9, 10 ] }
]
*/
```

### \_col().toJson()

The `toJson` method returns all items in the collection as a JSON string.

```js
const collection = _col([1, 2, 3, 4, 5]);
const json = collection.toJson();
console.log(json); // "[1,2,3,4,5]"
```

### \_col().unique()

The `unique` method returns all of the unique items in the collection.

```js
const collection = _col([1, 2, 3, 4, 5, 1, 2]);
const unique = collection.unique();
console.log(unique); // [1, 2, 3, 4, 5]
```

If the item of the collection is an object, you should specify the key to be checked.

```js
const collection = _col([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 1, name: 'John' }]);
const unique = collection.unique('id');
console.log(unique); // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
```

### \_col().when()

The `when` method method will execute the given callback when the first argument given to the method evaluates to `true`.
The collection instance and the first argument given to the `when` method will be provided to the callback.

```js
const collection = _col([1, 2, 3, 4, 5]);
collection.when(true, (collection, value) => {
  return collection.push(6);
});
console.log(collection.all()); // [2, 4, 6, 8, 10]
```

## Helper

```js
const { Helper } = require('@noravel/supporter');

// OR

import { Helper } from '@noravel/supporter';

Helper.isset();
Helper.empty();
Helper.typeOf();
Helper.isJSON();
Helper.queryStringToObject();
```

Some shared functions will be exported separately, you can call them directly to use them without going through Helper.

### isset()

Determine if a variable is declared and is different than null.

```js
const { isset } = require('@noravel/supporter');

// OR

import { isset } from '@noravel/supporter';
```

Except for undefined and null, everything will return true;

```js
console.log(isset(undefined)); // false
console.log(isset(null)); // false
```

### empty()

Determine whether a variable is empty.

```js
const { empty } = require('@noravel/supporter');

// OR

import { empty } from '@noravel/supporter';
```

```js
console.log(empty(undefined)); // true
console.log(empty(null)); // true
console.log(empty('')); // true
console.log(empty(false)); // true
console.log(empty(0)); // true
console.log(empty([])); // true
console.log(empty({})); // true
console.log(
  empty({
    items: [],
    count() {
      return this.items.length;
    },
  }),
); // true
console.log(
  empty({
    isEmpty() {
      return true;
    },
  }),
); // true
```

### typeOf()

If you want to check the exact data type then typeOf will help you.

```js
const { typeOf } = require('@noravel/supporter');

// OR

import { typeOf } from '@noravel/supporter';
```

What makes this function different from typeof is:

```js
console.log(typeof []); // object
console.log(typeOf([])); // array

console.log(typeof null); // object
console.log(typeOf(null)); // null

class A {}
console.log(typeof A); // function
console.log(typeOf(A)); // constructor
```

```js
function* inf() {
  let i = 1;
  while (true) {
    yield i;
    i++;
  }
}
console.log(typeof inf); // function
console.log(typeOf(inf)); // generatorfunction
```

### isJSON()

Check if a string value is json.

```js
console.log(isJSON('{}')); // true
console.log(isJSON('[]')); // true
console.log(isJSON('nam')); // false
```

### queryStringToObject()

Convert a query string to an object.

```js
console.log(queryStringToObject('?search[name]=Nam&sort_field=id&sort_direction=desc'));

// { search: { name: 'Nam' }, sort_field: 'id', sort_direction: 'desc' }
```
