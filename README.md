# Noravel supporter

This is a support library for Nam's projects.

## \_obj

```js
const { _obj } = require('@noravel/supporter');

# OR

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

## \_arr()

```js
const { _arr } = require('@noravel/supporter');

# OR

import { _arr } from '@noravel/supporter';
```

### \_arr().get()

Gets the array value of this object.

```js
console.log(_arr([1, 2, 3, 4, 5, 6]).get()); // [1, 2, 3, 4, 5, 6]

# OR

console.log(_arr([1, 2, 3, 4, 5, 6]).toArray()); // [1, 2, 3, 4, 5, 6]
```

### \_arr().chunk()

Chunk the array into chunks of the given size.

```js
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(_arr(data).chunk(2).get()); // [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]
```

### \_arr().first()

Returns the first element of the array.

```js
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(_arr(data).first()); // 1
```

### \_arr().map()

Run a map over each of the items in the array.

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

console.log(_arr(users).map(user => user.name)); // ['Trinh Tran Phuong Nam', 'John Doe']
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

console.log(_arr(users).pluck('id').get()); // [1, 2]
```

### \_arr().range()

Creates an array of numbers processing from "start" up to "end" (including "end").

```js
console.log(_arr().range(10), get()); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(_arr().range(-10), get()); // [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1]
console.log(_arr().range(0, 10), get()); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(_arr().range(1, 10, 2), get()); // [1, 3, 5, 7, 9]
console.log(_arr().range(10, 1), get()); // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
console.log(_arr().range(10, 1, 2), get()); // [10, 8, 6, 4, 2]
```

### \_arr().supplement()

Add elements to ensure the length of the array.

```js
const data = ['a', 'b', 'c'];

console.log(_arr(data).supplement(5), get()); // ['a', 'b', 'c', null, null]
console.log(_arr(data).supplement(5, 'additional item'), get()); // ['a', 'b', 'c', 'additional item', 'additional item']
```

### \_arr().unique()

Filter out duplicate elements to ensure that array elements are unique.

```js
const data = ['a', 'b', 1, 2, 'a', '1'];
console.log(_arr(data).unique().get()); // ['a', 'b', 1, 2, '1']
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

console.log(_arr(users).unique('id').get());
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

### \_arr().count()

Count the element of this array.

```js
console.log(_arr([1, 2, 3]).count()); // 3
```

### \_arr().isEmpty()

Check for empty array.

```js
console.log(_arr([]).isEmpty()); // true
console.log(_arr([]).supplement(10).isEmpty()); // false
```

## \_str()

```js
const { _str } = require('@noravel/supporter');

# OR

import { _str } from '@noravel/supporter';
```

### \_str().get()

Get the raw string value.

```js
console.log(_str('Lorem ipsum').get()); // 'Lorem ipsum'

# OR

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

Generate a more truly "random" string.

```js
console.log(_str().random(20)); // 'kvyufaqbosqlcojacnqo'
console.log(_str().random(20, { includeUppercase: true })); // 'KJqGfjKjccCjHnmmxyeM'
console.log(_str().random(20, { includeNumbers: true })); // 'h372ysnmr71klxekb4fs'

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

## helper

### isset()

Determine if a variable is declared and is different than null.

```js
const { isset } = require('@noravel/supporter');

# OR

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

# OR

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

# OR

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
