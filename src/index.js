const commentInPath = require('./comment-in-path')
const genOpts = require('./gen-opts')

module.exports = ({ types, template }, options) => {
  return {
    visitor: {
      VariableDeclaration(path) {
        const [open, hooks] = commentInPath(path.node, genOpts(options))

        if (open) {
          const declarations = path.get('declarations')
          const afterNodes = []
          declarations.forEach((n) => {
            const nodeName = n.node.id.name
            const consoleNode = template(
              `console.log('${nodeName}', ${nodeName})`
            )()

            afterNodes.push(consoleNode)
          })
          path.insertAfter(afterNodes)
        }
      },
    },
  }
}
