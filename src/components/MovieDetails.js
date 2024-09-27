import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ReactPlayer from 'react-player';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


function MovieDetails({ movie, onBack }) {

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchMovieVideos(movie.id).then((data) => {
      const youtubeVideos = data.results.filter(video => video.site === "YouTube");
      setVideos(youtubeVideos)
    });
  }, [movie.id]);

  const fetchMovieVideos = async (movieId) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=41b947864f10a265f44f000f55902f36`);
    const data = await response.json();
    return data;
  }

  return (
    <Container className="movie-details my-4">
      <Button variant="secondary" onClick={onBack} className="mb-4">
        Retour aux films
      </Button>
      <Row>
        <Col md={4}>
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="img-fluid"
          />
        </Col>
        <Col md={8}>
          <h2>{movie.title}</h2>
          <p><strong>Date de sortie : </strong>{movie.release_date}</p>
          <p><strong>Note : </strong>{movie.vote_average}</p>
          <p><strong>Description :</strong></p>
          <p>{movie.overview}</p>
        </Col>

        <Col md={6}>
          <h2>Bandes-annonces</h2>
          {videos.length === 0 ? (
            <p>Aucune bande-annonce disponible.</p>
          ) : (
            videos.map((video) => (
              <div key={video.id} className="mb-4">
                <ReactPlayer url={`https://www.youtube.com/watch?v=${video.key}`} controls={true} width="100%" />
                <p>{video.name}</p>
              </div>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MovieDetails;
