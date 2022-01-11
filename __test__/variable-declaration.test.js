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

  test('VariableDeclarator5', () => {
    let source = unpad(`
      // # TestName
      let a = 1; // #
    `)

    let expected = unpad(`
      let a = 1;
      console.log('TestName', a);
      console.log('a', a);
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('VariableDeclarator6', () => {
    let source = unpad(`
      // #error TestName
      let a = 1;
    `)

    let expected = unpad(`
      let a = 1;
      console.error('TestName', a);
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('VariableDeclarator7', () => {
    let source = unpad(`
      // #error TestName
      this.a = 1;
    `)

    let expected = unpad(`
      this.a = 1;
      console.error('TestName', this.a);
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('VariableDeclarator8', () => {
    let source = unpad(`
      // #error
      this.a = 1;
    `)

    let expected = unpad(`
      this.a = 1;
      console.error('this.a', this.a);
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('VariableDeclarator9', () => {
    let source = unpad(`
      // #
      obj.name.value = 'Taro';
    `)

    let expected = unpad(`
      obj.name.value = 'Taro';
      console.log('obj.name.value', obj.name.value);
    `)

    expect(transformCode(source)).toBe(expected)
  })
})
