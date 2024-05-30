const avatar = /* GraphQL */ `
  type Avatar {
    address: String!
    cid: String!
    mediaType: String
    indexer: Indexer!
  }
`;

module.exports = {
  avatar,
};
