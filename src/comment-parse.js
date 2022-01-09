module.exports = (comment, options) => {
  let [token, ...name] = comment.trim().split(' ')

  let isHook = false,
    type = 'log'
  if (token && token.startsWith(options.token)) {
    isHook = true
    type = token.split(options.token)[1] || 'log'
  }

  return {
    isHook,
    type,
    name: name.join(' '),
  }
}
