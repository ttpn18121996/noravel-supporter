const { _str } = require('../dist');

test('it can get string length', () => {
  expect(_str('Nam').length()).toEqual(3);
});

test('it can get the remainder of the string after the first occurrence of a certain value', () => {
  expect(_str('This is my name').after(' ').get()).toEqual('is my name');
});

test('it can get the remainder of the string after the last occurrence of a certain value', () => {
  expect(_str('/path/to/filename.extension').afterLast('/').get()).toEqual('filename.extension');
});

test('it can get the portion of a string before the first occurrence of a given value', () => {
  expect(_str('This is my name').before(' ').get()).toEqual('This');
});

test('it can get the portion of a string before the last occurrence of a given value', () => {
  expect(_str('This is my name').beforeLast(' ').get()).toEqual('This is my');
});

test('it can get the portion of a string between two given values', () => {
  expect(_str('This is my name').between('This', 'name').get()).toEqual(' is my ');
});

test('it can get the smallest possible portion of a string between two given values', () => {
  expect(_str('[a] bc [d]').betweenFirst('[', ']').get()).toEqual('a');
});

describe('it can binds the values ​​to the given string', () => {
  test('with a value is an object', () => {
    const user = { user_id: 1, name: 'John Doe' };
    const url = '/api/users/{user_id}/edit';
    expect(_str(url).bind(user).get()).toEqual('/api/users/1/edit');
  });

  test('with a specified value', () => {
    const user = { user_id: 1, name: 'John Doe' };
    const url = '/api/users/{0}/edit';
    expect(_str(url).bind(user.user_id).get()).toEqual('/api/users/1/edit');
  });

  test('with a value is an array', () => {
    const url = '/api/users/{0}/edit';
    expect(_str(url).bind([2]).get()).toEqual('/api/users/2/edit');
  });

  test('with an object whose properties do not exist', () => {
    const user = { user_id: 1, name: 'John Doe' };
    const url = '/api/users/{user_id}/edit?email={email}';
    expect(_str(url).bind(user).get()).toEqual('/api/users/1/edit?email={email}');
  });
});

describe('it can get a raw string value', () => {
  test('with a full value', () => {
    expect(_str('Lorem ipsum').get()).toEqual('Lorem ipsum');
  });

  test('with substring from start to end position', () => {
    expect(_str('Lorem ipsum').get(6, 11)).toEqual('ipsum');
  });
});

test('it can add given values ​​to the end of the string', () => {
  expect(_str('This is').append(' my name').get()).toEqual('This is my name');
});

test('it can add given values ​​to the beginning of the string', () => {
  expect(_str('/api/users').prepend('https://domain.example').get()).toEqual('https://domain.example/api/users');
});

describe('it can convert the given value', () => {
  test('to title case', () => {
    expect(_str('trinh tran phuong nam').title().get()).toEqual('Trinh Tran Phuong Nam');
  });

  test('to studly case', () => {
    expect(_str('phuong_nam').studly().get()).toEqual('PhuongNam');
  });

  test('to camel case', () => {
    expect(_str('phuong_nam').camel().get()).toEqual('phuongNam');
  });

  test('to lower case', () => {
    expect(_str('NAM').lower().get()).toEqual('nam');
  });

  test('to upper case', () => {
    expect(_str('nam').upper().get()).toEqual('NAM');
  });

  test('into a value with escaped Vietnamese characters', () => {
    expect(_str('Trịnh Trần Phương Nam').upper().get()).toEqual('TRỊNH TRẦN PHƯƠNG NAM');
  });

  test('to snake case', () => {
    expect(_str('trinhTranPhuongNam').snake().get()).toEqual('trinh_tran_phuong_nam');
    expect(_str('trinhTranPhuongNam').snake('-').get()).toEqual('trinh-tran-phuong-nam');
  });

  test('to kebab case', () => {
    expect(_str('trinhTranPhuongNam').kebab().get()).toEqual('trinh-tran-phuong-nam');
  });

  test('into a value with escaped HTML characters', () => {
    expect(_str('<p>Hello world</p>').escapeHtml().get()).toEqual('&lt;p&gt;Hello world&lt;/p&gt;');
  });
});

test('it can limit the number of characters in a string', () => {
  expect(_str('Short string').limit().get()).toEqual('Short string');
  expect(_str('The quick brown fox jumps over the lazy dog').limit(20).get()).toEqual('The quick brown ...');
});

describe('it can generate a random string', () => {
  test('without options', () => {
    const actual = _str().random();
    expect(actual).toEqual(actual);
    expect(actual.length).toEqual(16);
  });

  test('with capital letters', () => {
    const actual = _str().random(16, { includeUppercase: true });
    expect(/[A-Z]/.test(actual)).toBeTruthy();
  });

  test('with digits', () => {
    const actual = _str().random(16, { includeNumbers: true });
    expect(/[0-9]/.test(actual)).toBeTruthy();
  });

  test('with symbols', () => {
    const actual = _str().random(16, { includeSymbols: true });
    expect(/[\!-\/]/.test(actual)).toBeTruthy();
  });
});

test('it can randomly shuffle a string', () => {
  const origin = 'abcdefghijklmnopqrstuvwxyz';
  const shuffled1 = _str(origin).shuffle().get();
  const shuffled2 = _str(origin).shuffle().get();

  expect(shuffled1).not.toEqual(origin);
  expect(shuffled1).not.toEqual(shuffled2);
  expect(shuffled2).not.toEqual(origin);
});

test('it can replace the given value in the given string', () => {
  expect(
    _str('Hello everyone')
      .replace(/^Hello/, 'Hi')
      .get(),
  ).toEqual('Hi everyone');
});

test('it can replace the given value in the given string from a specific position', () => {
  expect(_str('Hello everyone').replaceAt(2, '!!').get()).toEqual('He!!o everyone');
});

test('it can split a string from a specific position and then insert the splice into the slice', () => {
  expect(_str('Hello everyone!!!').splice(6, 8, '**everyone**').get()).toEqual('Hello **everyone**!!!');
});

describe.each(['The quick brown fox jumps over the lazy dog.'])(
  'it can extract a section of this string and return it as a new string',
  str => {
    test('with 1 parameter', () => {
      expect(_str(str).slice(31).get()).toEqual('the lazy dog.');
    });

    test('with 2 parameters', () => {
      expect(_str(str).slice(4, 19).get()).toEqual('quick brown fox');
    });

    test('with negative parameter', () => {
      expect(_str(str).slice(-4).get()).toEqual('dog.');
    });

    test('with 2 negative parameters', () => {
      expect(_str(str).slice(-9, -5).get()).toEqual('lazy');
    });

    test('with complicated cases', () => {
      expect(_str(str).slice(-9).upper().slice(0, 8).get()).toEqual('LAZY DOG');
    });
  },
);

test('it can pads a given value in front of a given string until the given length is reached', () => {
  const email = 'namttp@example.com';
  const actual = _str(email)
    .before('@')
    .slice(-3)
    .padStart(_str(email).before('@').length(), '*')
    .append(_str(email).after('@').prepend('@').get())
    .get();

  expect(actual).toEqual('***ttp@example.com');
});

test('it can pads a given value behind a given string until the given length is reached', () => {
  expect(_str('200').padEnd(10, '-').get()).toEqual('200-------');
  expect(_str('200').padEnd(5).get()).toEqual('200  ');
});

describe('it can be cast to string type', () => {
  test('with an object', () => {
    expect(_str().caseString({})).toEqual('[object Object]');
  });

  test('with an object has toString method', () => {
    expect(_str().caseString({ toString: () => 'This is an object' })).toEqual('This is an object');
  });

  test('with an array', () => {
    expect(_str().caseString([1, 2, 3])).toEqual('1,2,3');
  });

  test('with Not a Number', () => {
    expect(_str().caseString(NaN)).toEqual('NaN');
  });

  test('with an arrow function', () => {
    expect(_str().caseString(() => {})).toEqual('() => {}');
  });

  test('with a function', () => {
    expect(
      _str().caseString(function () {
        return 'this is a function';
      }),
    ).toEqual(`function () {
      return 'this is a function';
    }`);
  });
});

test('it can dump the string', () => {
  expect(_str('Nam').dump()).toEqual({ value: 'Nam' });
});
