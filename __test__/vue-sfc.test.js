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

describe('vue-sfc-test', () => {
  test('declare components', () => {
    let source = unpad(`
      export default {
        // #
        created() {
          
        }
      }
    `)

    let expected = unpad(`
      export default {
        created() {
          console.log('created');
        }

      };
    `)

    expect(transformCode(source)).toBe(expected)
  })
})
