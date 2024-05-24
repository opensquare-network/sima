const ipfsFetch = require("./fetch");

module.exports = {
  fetch: ipfsFetch,
  ...require("./isCid"),
}
