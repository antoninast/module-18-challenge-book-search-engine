import { useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import Auth from '../utils/auth.js';
import { removeBookId } from '../utils/localStorage';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries.js';
import { REMOVE_BOOK } from '../utils/mutations.js';

const SavedBooks = () => {
  const { loading, data, refetch } = useQuery(QUERY_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
  
        if (!token) {
          return false;
        }

        await refetch(); 
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [data]);

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({ variables: { bookId } });
      removeBookId(bookId);
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {data.me.username ? (
            <h1>Viewing {data.me.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {data.me.savedBooks.length
            ? `Viewing ${data.me.savedBooks.length} saved ${
              data.me.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {data.me.savedBooks.map((book: { bookId: Key | null | undefined; image: string | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; authors: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId as string)}
                    >
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
