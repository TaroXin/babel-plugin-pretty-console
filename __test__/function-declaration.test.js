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

describe('function-declaration-test', () => {
  test('FunctionDeclaration1', () => {
    let source = unpad(`
      // #
      function add(a, b) {
        return a + b;
      }
    `)

    let expected = unpad(`
      function add(a, b) {
        console.log('add:a', a);
        console.log('add:b', b);
        return a + b;
      } 
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('FunctionDeclaration2', () => {
    let source = unpad(`
      // # TestFunction
      function add(a, b) {
        return a + b;
      }
    `)

    let expected = unpad(`
      function add(a, b) {
        console.log('TestFunction:a', a);
        console.log('TestFunction:b', b);
        return a + b;
      } 
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('FunctionDeclaration3', () => {
    let source = unpad(`
      // #warn TestFunction
      function add(a, b) {
        return a + b;
      }
    `)

    let expected = unpad(`
      function add(a, b) {
        console.warn('TestFunction:a', a);
        console.warn('TestFunction:b', b);
        return a + b;
      } 
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('FunctionDeclaration4 - No parameters', () => {
    let source = unpad(`
      // #log
      function add() {
        return a + b;
      }
    `)

    let expected = unpad(`
      function add() {
        console.log('add');
        return a + b;
      } 
    `)

    expect(transformCode(source)).toBe(expected)
  })

  // test('FunctionDeclaration5 - mutiple hooks', () => {
  //   let source = unpad(`
  //     // #log
  //     function add() { // #warn
  //       return a + b;
  //     }
  //   `)

  //   let expected = unpad(`
  //     function add() {
  //       console.log('add');
  //       console.warn('add');
  //       return a + b;
  //     }
  //   `)

  //   expect(transformCode(source)).toBe(expected)
  // })

  test('ArrowFunctionExpression1', () => {
    let source = unpad(`
      // #log
      let add = (a, b) => {
        return a + b;
      };
    `)

    let expected = unpad(`
      let add = (a, b) => {
        console.log('add:a', a);
        console.log('add:b', b);
        return a + b;
      };
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('ArrowFunctionExpression2', () => {
    let source = unpad(`
      // #log
      let add = (a, b) => a + b
    `)

    let expected = unpad(`
      let add = (a, b) => {
        console.log('add:a', a);
        console.log('add:b', b);
        return a + b;
      };
    `)

    expect(transformCode(source)).toBe(expected)
  })

  // test('ArrowFunctionExpression2', () => {
  //   let source = unpad(`
  //     let add = (a, b) => { // #
  //       return a + b;
  //     };
  //   `)

  //   let expected = unpad(`
  //     let add = (a, b) => {
  //       console.log('add:a', a);
  //       console.log('add:b', b);
  //       return a + b;
  //     };
  //   `)

  //   expect(transformCode(source)).toBe(expected)
  // })
})
