import {gql} from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_USER = gql`
mutation Mutation($username: String!, $email: String!, $password: String!) {
  createUser(username: $username, email: $email, password: $password) {
    token
    user {
      email
      username
      _id
    }
  }
}
`;

export const SAVE_BOOK = gql`
mutation Mutation($bookInput: BookInput) {
  saveBook(bookInput: $bookInput) {
    _id
    username
    email
    savedBooks {
      authors
      _id
      bookId
      description
      image
      link
      title
    }
  }
}
`;

export const REMOVE_BOOK = gql`
  mutation removeBook ($bookId: String!) {
    removeBook(bookId: $bookId){
        _id
        username
        email
        savedBooks {
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