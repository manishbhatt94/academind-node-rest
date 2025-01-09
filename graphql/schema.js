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

  input CreatePostInput {
    title: String!
    content: String!
    imageUrl: String!
  }

  type AuthData {
    token: String!
    userId: String!
  }

  type RootMutation {
    createUser(userInput: CreateUserInput!): User!
    createPost(postInput: CreatePostInput!): Post!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    getPosts(page: Int): [Post!]!
    getPostsCount: Int!
    getPostDetails(postId: String!): Post!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
