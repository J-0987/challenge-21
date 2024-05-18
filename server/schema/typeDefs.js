const typeDefs =`
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
        password: String
        savedBooks: [Book]
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        book: [Book] 
        user: [User]
        me: User
    }

    type Mutation {
        login (username: String, email: String, password: String!): Auth
        createUser (username: String!, email: String!, password: String!): Auth
        saveBook(authors: [String], description: String, bookId: String!, image: String, link: String, title: String): User
        removeBook(bookId: String!): User
    }

`

module.exports = typeDefs;