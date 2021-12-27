const commentInPath = require('./comment-in-path')
const genOpts = require('./gen-opts')
const template = require('@babel/template').default

function functionDeclaration(path, options, outerFunctionId) {
  const [open, hooks] = commentInPath(path.node, genOpts(options))

  if (open) {
    const insertNodes = []
    const params = path.node.params
    const functionId = outerFunctionId || path.node.id.name

    if (params && params.length) {
      params.forEach((n) => {
        const nodeName = n.name

        hooks.forEach((hook) => {
          const consoleNode = template(`console.${hook.type}('${hook.name || functionId}:${nodeName}', ${nodeName})`)()

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
}

module.exports = ({ types }, options) => {
  return {
    visitor: {
      VariableDeclaration(path) {
        const [open, hooks] = commentInPath(path.node, genOpts(options))

        if (open) {
          const declarations = path.get('declarations')
          const insertNodes = []
          declarations.forEach((n) => {
            const nodeName = n.node.id.name

            if (types.isArrowFunctionExpression(n.node.init)) {
              //
              const functionPath = n.get('init')
              // FIXME: ArrowFunctionExpression can only support `leadingComments`
              // Because babel does't return `innerComments` for arrow function.
              functionPath.node.leadingComments = path.node.leadingComments

              return functionDeclaration(functionPath, genOpts(options), nodeName)
            } else {
              hooks.forEach((hook) => {
                const consoleNode = template(`console.${hook.type}('${hook.name || nodeName}', ${nodeName})`)()

                insertNodes.push(consoleNode)
              })
            }
          })
          path.insertAfter(insertNodes)
        }
      },
      FunctionDeclaration(path) {
        functionDeclaration(path, genOpts(options))
      },
    },
  }
}
