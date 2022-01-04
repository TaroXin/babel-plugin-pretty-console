const babel = require('@babel/core')
const plugin = require('../src/index')
const rmw = require('../lib/rmw')

function transformCode(code) {
  const result = babel.transform(code, {
    plugins: [plugin],
    comments: false,
  })
  return result.code
}

describe('vue-sfc-test', () => {
  test('declare components', () => {
    let source = `
      export default {
        // #
        created() {
          
        }
      }
    `

    let expected = rmw(`
      export default {
        created() {
          console.log('created');
        }
      };
    `)

    expect(rmw(transformCode(source))).toBe(expected)
  })

  test('declare components 2', () => {
    let source = `
      export default {
        // #
        created() {
          // #
          let res = add(1, 2);
        },
        methods: {
          // #
          add(a, b) {
            return a + b;
          }
        }
      }
    `

    let expected = rmw(`
      export default {
        created() {
          console.log('created');
          let res = add(1, 2);
          console.log('res', res);
        },
        methods: {
          add(a, b) {
            console.log('add:a', a);
            console.log('add:b', b);
            return a + b;
          }
        }
      };
    `)

    expect(rmw(transformCode(source))).toBe(expected)
  })
})
