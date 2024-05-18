import { gql } from '@apollo/client';

export const QUERY_BOOK = gql`
  query book($bookId: ID!) {
    book(bookId: $bookId) {
      _id
      authors
      description
      bookId
      image
      link
      title 
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
     _id
        username
        email
        savedBooks {
          _id
          authors
          description
          bookId
          image
          link
          title
        }
    }
  }
`;

export const QUERY_ME = gql`
  query me($username: String!) {
    me (username: $username) {
     _id
        username
        email
        savedBooks {
          _id
          authors
          description
          bookId
          image
          link
          title
        }
    }
  }
`;