import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import {useMutation} from '@apollo/client';
import {GET_ME} from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {

  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  console.log("logged in", Auth.loggedIn())
  console.log("token", Auth.getToken())
  const userDataLength = Object.keys(userData);
  console.log("HELLO userdata", userData)
  const { loading, data, queryError } = useQuery(GET_ME, {
    context: {
      headers: {
        authorization: Auth.loggedIn() ? `Bearer ${Auth.getToken()}` : ''
      },

    }

    
  });

  // console.log('Loading:', loading);
  // console.log('Error:', queryError );
  // console.log('Data:', data);
  // console.log("HELLO DATA", data)
 
  useEffect(() => {

    if (!loading) {
      if (data) {
        console.log("RESPONSE", data.me);
        setUserData(data.me);
      } else if (queryError) {
        console.log("useEffect error",queryError);
      }
    }
    
  }, [loading, data, queryError]);


  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
 
    return false;
  }
  

  try {
    const { data } = await removeBook({
      variables: { bookId },
      context: {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    });

    if (!data.removeBook) {
      throw new Error('something went wrong!');
    }

    setUserData(data.removeBook);
    // upon success, remove book's id from localStorage
    removeBookId(bookId);
  } catch (err) {
    console.error(err);
  }
};
if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  console.error("Error:", error);
  return <div>Error!</div>;
}

if (!data?.me?.savedBooks) {
  return <div>No saved books!</div>;
}

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
     
        <Row>
          {data.me.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId} >
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;

/*
 <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
            {console.log("BOOKDATA", userData)}
        </h2>
*/