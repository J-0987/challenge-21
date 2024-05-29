const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Book {
    _id: ID!
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
    }
    

    type User {
        _id: ID!
        username: String
        email: String
      
      
        savedBooks: [Book]
    }
    type Auth {
        token: ID
        user: User
    }



    input BookInput {
        authors: [String]!
        description: String
        title: String!
        bookId: String!
        image: String
        link: String
      }

  

    type Query {
        users: [User]
        me: User
        user(username: String!): User
    }

    type Mutation {
        login (username: String, email: String, password: String!): Auth
        createUser (username: String!, email: String!, password: String!): Auth
        saveBook(bookInput : BookInput): User
        removeBook(bookId: String!): User
    }

`

module.exports = typeDefs;