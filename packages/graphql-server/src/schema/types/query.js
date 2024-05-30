const queries = /* GraphQL */ `
  type Query {
    avatar(address: String!):Avatar
  }
`;

module.exports = {
  queries,
};
