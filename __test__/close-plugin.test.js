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
          open: false,
        },
      ],
    ],
    comments: false,
  })
  return result.code
}

describe('close-plugin-test', () => {
  test('close-plugin', () => {
    let source = unpad(`
      // #
      let a = 1;
    `)

    let expected = unpad(`
      let a = 1;
    `)

    expect(transformCode(source)).toBe(expected)
  })
})
