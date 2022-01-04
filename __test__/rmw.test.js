const rmw = require('../lib/rmw')

describe('rmw-test', () => {
  test('rmw-test1', () => {
    let source = rmw(`
      export default {
        created() {
          
        }


      };
    `)

    let expected = rmw(`
      export default {
        created() {
        }

      };
    `)

    expect(source).toBe(expected)
  })

  test('rmw-test2', () => {
    let source = rmw(`
      let a = 0;



    `)

    let expected = rmw(`
      let a= 0;
    `)

    expect(source).toBe(expected)
  })
})
