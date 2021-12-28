const babel = require('@babel/core')
const plugin = require('../src/index')
const unpad = require('../lib/unpad')

function transformCode(code) {
  const result = babel.transform(code, {
    plugins: [plugin],
    comments: false,
  })
  return result.code
}

describe('object-method-test', () => {
  test('ObjectMethod1', () => {
    let source = unpad(`
      let method = {
        // #
        add(a, b) {
          return a + b;
        }
      };
    `)

    let expected = unpad(`
      let method = {
        add(a, b) {
          console.log('add:a', a);
          console.log('add:b', b);
          return a + b;
        }
      
      };
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('ObjectMethod2', () => {
    let source = unpad(`
      let method = {
        // #warn TestAddFunction
        add(a, b) {
          return a + b;
        }
      };
    `)

    let expected = unpad(`
      let method = {
        add(a, b) {
          console.warn('TestAddFunction:a', a);
          console.warn('TestAddFunction:b', b);
          return a + b;
        }
      
      };
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('ObjectProperty1', () => {
    let source = unpad(`
      let method = {
        // #warn
        add: (a, b) => {
          return a + b;
        }
      };
    `)

    let expected = unpad(`
      let method = {
        add: (a, b) => {
          console.warn('add:a', a);
          console.warn('add:b', b);
          return a + b;
        }
      };
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('ObjectProperty2', () => {
    let source = unpad(`
      let method = {
        // #warn
        add: (a, b) => a + b,
      };
    `)

    let expected = unpad(`
      let method = {
        add: (a, b) => {
          console.warn('add:a', a);
          console.warn('add:b', b);
          return a + b;
        }
      };
    `)

    expect(transformCode(source)).toBe(expected)
  })
})
