const babel = require('@babel/core')
const plugin = require('../src/index')
const unpad = require('../lib/unpad')

function transformCode(code) {
  const result = babel.transform(code, {
    plugins: [
      [
        plugin,
        {
          token: '#',
        },
      ],
    ],
    comments: false,
  })
  return result.code
}

describe('variable-declaration-test', () => {
  test('VariableDeclarator1', () => {
    let source = unpad(`
      // #
      let a = 1;
      // #
      let b = 2;
    `)

    let expected = unpad(`
      let a = 1;
      console.log('a', a);
      let b = 2;
      console.log('b', b);
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('VariableDeclarator2', () => {
    let source = unpad(`
      // #
      let a = 1, b = 2;
    `)

    let expected = unpad(`
      let a = 1,
          b = 2;
      console.log('a', a);
      console.log('b', b);
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('VariableDeclarator3', () => {
    let source = unpad(`
      let a = 1; // #
    `)

    let expected = unpad(`
      let a = 1;
      console.log('a', a);
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('VariableDeclarator4', () => {
    let source = unpad(`
      function test() {}
      // #
      let a = test();
    `)

    let expected = unpad(`
      function test() {}
      
      let a = test();
      console.log('a', a);
    `)

    expect(transformCode(source)).toBe(expected)
  })
})
