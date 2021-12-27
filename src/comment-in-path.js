const commentParse = require('./comment-parse')

module.exports = (node, options) => {
  const commentsList = []
    .concat(node.leadingComments || [])
    .concat(node.innerComments || [])
    .concat(node.trailingComments || [])

  const tokenList = []
  if (commentsList && commentsList.length) {
    commentsList.forEach((c) => {
      const nodeLine = node.loc.start.line
      const line = c.loc.end.line

      let result = commentParse(c.value, options)
      if (result.isHook && (nodeLine == line || nodeLine - 1 == line)) {
        tokenList.push(result)
      }
    })
  }

  return [!!tokenList.length && options.open, tokenList]
}
