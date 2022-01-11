const generate = require('@babel/generator').default
const commentInPath = require('./comment-in-path')
const genOpts = require('./gen-opts')

module.exports = ({ types, template }, options) => {
  let filename = ''
  // cache all comments in file
  let fileComments = []

  const genLog = (type, name = null, ...args) => {
    let opts = genOpts(options)
    let printFileName = opts.printFileName && filename ? "'" + filename + "'," : ''

    return template(`console.${type}(${printFileName}${name ? "'" + name + "'," : ''}${args.join(',')})`)()
  }

  // Handle functions or arrow functions,
  // inlcuding functions declared in `Object` and `Class`.
  const functionDeclaration = (path, outerFunctionId) => {
    const [open, hooks] = commentInPath(path.node, genOpts(options), fileComments)

    if (open) {
      const insertNodes = []
      const params = path.node.params
      // `outerFunctionId` is useful for rendering
      // `anonymous arrow functions` or
      // `properties for Object` or
      // `properties for Class` or
      // `Reassign a Variable`
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
    pre({ hub, ast }) {
      try {
        fileComments = ast.comments
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
          if (!types.isArrowFunctionExpression(initPath)) {
            const [open, hooks] = commentInPath(path.node, genOpts(options), fileComments)

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
        let nodeName = path.node.left.name
        if (!nodeName) {
          // fix: this.a = 1; => console.log('this.a', this.a)
          let code = generate(path.node.left).code
          nodeName = code
        }
        const insertNodes = []
        if (!types.isArrowFunctionExpression(right)) {
          const [open, hooks] = commentInPath(path.node, genOpts(options), fileComments)
          if (open) {
            hooks.forEach((hook) => {
              const log = genLog(hook.type, hook.name || nodeName, nodeName)
              insertNodes.push(log)
            })
          }
          insertNodes.length && path.insertAfter(insertNodes)
        }
      },
      FunctionDeclaration(path) {
        functionDeclaration(path)
      },
      ArrowFunctionExpression(path) {
        let functionId = ''
        if (types.isAssignmentExpression(path.parent)) {
          functionId = path.parent.left.name
        }
        if (types.isVariableDeclaration(path.parent) || types.isVariableDeclarator(path.parent)) {
          functionId = path.parent.id.name
        }
        if (types.isObjectProperty(path.parent) || types.isClassProperty(path.parent)) {
          functionId = path.parent.key.name
        }
        functionDeclaration(path, functionId)
      },
      'ObjectMethod|ClassMethod'(path) {
        const functionId = path.node.key.name
        functionDeclaration(path, functionId)
      },
    },
  }
}
