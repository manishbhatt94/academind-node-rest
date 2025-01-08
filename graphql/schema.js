const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    name: String!
    status: String!
    posts: [Post!]!
  }

  input CreateUserInput {
    email: String!
    password: String!
    name: String!
  }

  type AuthData {
    token: String!
    userId: String!
  }

  type RootMutation {
    createUser(userInput: CreateUserInput!): User!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    getPosts: [Post!]!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
