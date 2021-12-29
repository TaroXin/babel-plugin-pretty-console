const commentInPath = require('./comment-in-path')
const genOpts = require('./gen-opts')

module.exports = ({ types, template }, options) => {
  let filename = ''
  const genLog = (type, name = null, ...args) => {
    let opts = genOpts(options)
    let printFileName = opts.printFileName && filename ? "'" + filename + "'," : ''

    return template(`console.${type}(${printFileName}${name ? "'" + name + "'," : ''}${args.join(',')})`)()
  }

  // Handle functions or arrow functions,
  // inlcuding functions declared in `Object`.
  const functionDeclaration = (path, outerFunctionId) => {
    const [open, hooks] = commentInPath(path.node, genOpts(options))

    if (open) {
      const insertNodes = []
      const params = path.node.params
      // `outerFunctionId` is useful for rendering anonymous arrow functions
      let functionId = outerFunctionId
      if (!functionId) {
        functionId = path.node.id ? path.node.id.name : ''
      }

      if (params && params.length) {
        params.forEach((n) => {
          const nodeName = n.name

          hooks.forEach((hook) => {
            const log = genLog(hook.type, `${hook.name || functionId}:${nodeName}`, nodeName)
            insertNodes.push(log)
          })
        })
      } else {
        // no parameters
        hooks.forEach((hook) => {
          const log = genLog(hook.type, hook.name || functionId)
          insertNodes.push(log)
        })
      }

      const body = path.get('body')
      if (types.isBlockStatement(body.node)) {
        body.node.body.unshift(...insertNodes)
      } else {
        // `add() => true`, The body property is not a block statement
        body.replaceWith(types.blockStatement([...insertNodes, types.returnStatement(body.node)]))
      }
    }
  }

  return {
    pre({ hub }) {
      try {
        filename = hub.file.opts.generatorOpts.filename
      } catch (error) {}
    },
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
            // see: https://github.com/babel/babel/issues/883
            initPath.node.leadingComments = path.node.leadingComments
            initPath.node.trailingComments = path.node.trailingComments
            initPath.node.innerComments = initPath.get('body').innerComments

            return functionDeclaration(initPath, nodeName)
          } else {
            const [open, hooks] = commentInPath(path.node, genOpts(options))

            if (open) {
              hooks.forEach((hook) => {
                const log = genLog(hook.type, hook.name || nodeName, nodeName)
                insertNodes.push(log)
              })
            }
          }
        })
        insertNodes.length && path.insertAfter(insertNodes)
      },
      AssignmentExpression(path) {
        const right = path.get('right')
        const nodeName = path.node.left.name
        const insertNodes = []
        if (types.isArrowFunctionExpression(right)) {
          right.node.leadingComments = path.node.leadingComments
          right.node.trailingComments = path.node.trailingComments
          return functionDeclaration(right, nodeName)
        } else {
          const [open, hooks] = commentInPath(path.node, genOpts(options))
          if (open) {
            hooks.forEach((hook) => {
              const log = genLog(hook.type, hook.name || nodeName, nodeName)
              insertNodes.push(log)
            })
          }
        }
      },
      FunctionDeclaration(path) {
        functionDeclaration(path)
      },
      ObjectMethod(path) {
        const functionId = path.node.key.name
        functionDeclaration(path, functionId)
      },
      ObjectProperty(path) {
        const propValue = path.get('value')
        const propKey = path.node.key.name
        if (types.isArrowFunctionExpression(propValue)) {
          propValue.node.leadingComments = path.node.leadingComments
          propValue.node.trailingComments = path.node.trailingComments

          return functionDeclaration(propValue, propKey)
        }
      },
      ExportDefaultDeclaration(path) {
        const declaration = path.get('declaration')
        if (
          types.isFunctionDeclaration(declaration) ||
          types.isAssignmentExpression(declaration) ||
          types.isArrowFunctionExpression(declaration)
        ) {
          declaration.node.leadingComments = path.node.leadingComments
          declaration.node.trailingComments = path.node.trailingComments
        }

        if (types.isArrowFunctionExpression(declaration)) {
          functionDeclaration(declaration)
        }
      },
      ExportNamedDeclaration(path) {
        const declaration = path.get('declaration')
        if (types.isFunctionDeclaration(declaration) || types.isVariableDeclaration(declaration)) {
          declaration.node.leadingComments = path.node.leadingComments
          declaration.node.trailingComments = path.node.trailingComments
        }
      },
      ExpressionStatement(path) {
        const expression = path.get('expression')
        if (types.isAssignmentExpression(expression)) {
          expression.node.leadingComments = path.node.leadingComments
          expression.node.trailingComments = path.node.trailingComments
        }
      },
    },
  }
}
