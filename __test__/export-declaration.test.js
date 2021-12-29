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

describe('export-declaration-test', () => {
  test('ExportNamedDeclaration1', () => {
    let source = unpad(`
      // #
      export function add(a, b) {
        return a + b;
      }
    `)

    let expected = unpad(`
      export function add(a, b) {
        console.log('add:a', a);
        console.log('add:b', b);
        return a + b;
      }
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('ExportNamedDeclaration2', () => {
    let source = unpad(`
      // #
      export const add = (a, b) => {
        return a + b;
      }
    `)

    let expected = unpad(`
      export const add = (a, b) => {
        console.log('add:a', a);
        console.log('add:b', b);
        return a + b;
      };
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('ExportDefaultDeclaration1', () => {
    let source = unpad(`
      // #
      export default function add(a, b) {
        return a + b;
      }
    `)

    let expected = unpad(`
      export default function add(a, b) {
        console.log('add:a', a);
        console.log('add:b', b);
        return a + b;
      }
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('ExportDefaultDeclaration2', () => {
    let source = unpad(`
      // #
      export default function add(a, b) {
        return a + b;
      }
    `)

    let expected = unpad(`
      export default function add(a, b) {
        console.log('add:a', a);
        console.log('add:b', b);
        return a + b;
      }
    `)

    expect(transformCode(source)).toBe(expected)
  })

  test('ExportDefaultDeclaration3', () => {
    let source = unpad(`
      // #
      export default (a, b) => {
        return a + b;
      }
    `)

    let expected = unpad(`
      export default ((a, b) => {
        console.log(':a', a);
        console.log(':b', b);
        return a + b;
      });
    `)

    expect(transformCode(source)).toBe(expected)
  })
})
