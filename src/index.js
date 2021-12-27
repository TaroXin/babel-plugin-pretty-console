const commentInPath = require('./comment-in-path')
const genOpts = require('./gen-opts')

module.exports = ({ types, template }, options) => {
  return {
    visitor: {
      VariableDeclaration(path) {
        const [open, hooks] = commentInPath(path.node, genOpts(options))

        if (open) {
          const declarations = path.get('declarations')
          const insertNodes = []
          declarations.forEach((n) => {
            const nodeName = n.node.id.name

            hooks.forEach((hook) => {
              const consoleNode = template(`console.${hook.type}('${hook.name || nodeName}', ${nodeName})`)()

              insertNodes.push(consoleNode)
            })
          })
          path.insertAfter(insertNodes)
        }
      },
      FunctionDeclaration(path) {
        const [open, hooks] = commentInPath(path.node, genOpts(options))

        if (open) {
          const insertNodes = []
          const params = path.node.params
          const functionId = path.node.id.name
          if (params && params.length) {
            params.forEach((n) => {
              const nodeName = n.name

              hooks.forEach((hook) => {
                const consoleNode = template(
                  `console.${hook.type}('${hook.name || functionId}:${nodeName}', ${nodeName})`
                )()

                insertNodes.push(consoleNode)
              })
            })
          } else {
            // no params
            hooks.forEach((hook) => {
              const consoleNode = template(`console.${hook.type}('${hook.name || functionId}')`)()

              insertNodes.push(consoleNode)
            })
          }

          const body = path.get('body')
          body.node.body.unshift(...insertNodes)
        }
      },
    },
  }
}
