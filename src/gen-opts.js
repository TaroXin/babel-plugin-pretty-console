module.exports = (options = {}) => {
  const defaultOptions = {
    token: '#',
    open: true,
    printFileName: false,
  }

  return Object.assign({}, defaultOptions, options)
}
