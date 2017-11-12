module.exports = function (content) {
  this.cacheable && this.cacheable()
  const attributes = (this.options.frontmatterAttributes || {})[this.resourcePath] || {}
  return content + '\nmodule.exports = module.exports(' + JSON.stringify(attributes) + ');'
}
