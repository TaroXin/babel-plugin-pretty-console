const commentInPath = require('./comment-in-path')
const genOpts = require('./gen-opts')
const template = require('@babel/template').default
const types = require('@babel/types')

function functionDeclaration(path, options, outerFunctionId) {
  const [open, hooks] = commentInPath(path.node, genOpts(options))

  if (open) {
    const insertNodes = []
    const params = path.node.params
    // `outerFunctionId` is useful for rendering anonymous arrow functions
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
      // FIXME: The FunctionDeclaration has no `innerComments`
      hooks.forEach((hook) => {
        const consoleNode = template(`console.${hook.type}('${hook.name || functionId}')`)()

        insertNodes.push(consoleNode)
      })
    }

    const body = path.get('body')
    if (types.isBlockStatement(body.node)) {
      body.node.body.unshift(...insertNodes)
    } else {
      body.replaceWith(types.blockStatement([...insertNodes, types.returnStatement(body.node)]))
    }
  }
}

module.exports = ({}, options) => {
  return {
    visitor: {
      VariableDeclaration(path) {
        const declarations = path.get('declarations')
        const insertNodes = []
        declarations.forEach((n) => {
          const nodeName = n.node.id.name
          const initPath = n.get('init')

          if (types.isArrowFunctionExpression(initPath)) {
            // FIXME: ArrowFunctionExpression can't use inner comment hook!
            // Because babel does't return `innerComments` for arrow functions.
            initPath.node.leadingComments = path.node.leadingComments
            initPath.node.trailingComments = path.node.trailingComments
            initPath.node.innerComments = initPath.get('body').innerComments

            return functionDeclaration(initPath, genOpts(options), nodeName)
          } else {
            const [open, hooks] = commentInPath(path.node, genOpts(options))

            if (open) {
              hooks.forEach((hook) => {
                const consoleNode = template(`console.${hook.type}('${hook.name || nodeName}', ${nodeName})`)()
                insertNodes.push(consoleNode)
              })
            }
          }
        })
        insertNodes.length && path.insertAfter(insertNodes)
      },
      FunctionDeclaration(path) {
        functionDeclaration(path, genOpts(options))
      },
    },
  }
}
