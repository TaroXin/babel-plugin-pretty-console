const commentParse = require('./comment-parse')

module.exports = (node, options, comments = []) => {
  const tokenList = []
  if (comments && comments.length) {
    comments.forEach((c) => {
      const nodeLine = node.loc ? node.loc.start.line : -1
      const line = c.loc.end.line

      let result = commentParse(c.value, options)
      if (result.isHook && (nodeLine == line || nodeLine - 1 == line)) {
        tokenList.push(result)
      }
    })
  }

  return [!!tokenList.length && options.open, tokenList]
}
