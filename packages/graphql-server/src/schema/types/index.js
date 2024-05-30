const { indexer, json } = require("./common");
const { avatar } = require("./avatar");
const { queries } = require("./query");

const typeDefs = [indexer, json, avatar, queries];

module.exports = {
  typeDefs,
};
