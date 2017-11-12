module.exports = function (content) {
  this.cacheable && this.cacheable()
  content = JSON.parse(content)
  // FIXME: Need to find better place to save these attributes.
  this.options.frontmatterAttributes = this.options.frontmatterAttributes || {}
  this.options.frontmatterAttributes[this.resourcePath] = content.attributes
  return content.body
}
