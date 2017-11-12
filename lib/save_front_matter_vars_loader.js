module.exports = function (content) {
  this.cacheable && this.cacheable()
  content = JSON.parse(content)
  // FIXME: Need to find better place to save these attributes.
  this._module._attributes = this._module._attributes || {}
  this._module._attributes[this.resourcePath] = content.attributes
  return content.body
}
