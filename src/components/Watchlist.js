import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(storedWatchlist);
  }, []);

  const removeFromWatchlist = (movieId) => {
    const updatedWatchlist = watchlist.filter((movie) => movie.id !== movieId);
    setWatchlist(updatedWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  };

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Ma Liste de Favoris</h1>
      <Row>
        {watchlist.length > 0 ? (
          watchlist.map((movie) => (
            <Col key={movie.id} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Button variant="danger" onClick={() => removeFromWatchlist(movie.id)}>
                    Supprimer de la liste
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">Aucun film dans votre liste de favoris.</p>
        )}
      </Row>
    </Container>
  );
}

export default Watchlist;
