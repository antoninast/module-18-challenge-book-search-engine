const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]!
  }

  type Book {
    _id: ID
    userId: String
    bookId: String
    authors: [String]
    description: String
    image: String
    link: String
    title: String
  }


  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input BookInput {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  input SaveBookInput {
    userId: String
    book: BookInput!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: SaveBookInput!): Book
    deleteBook(userId: String!, bookId: String!): String
  }
`;

export default typeDefs;
