import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import Footer from './components/Footer';
import MovieDetails from './components/MovieDetails';
import AppNavbar from './components/Navbar';
import Watchlist from './components/Watchlist'; // Import du composant Watchlist

const API_KEY = '41b947864f10a265f44f000f55902f36'; // Remplace par ta clé API TMDb
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('popularity');
  

  useEffect(() => {
    fetchGenres();
    fetchMoviesSorted(sortCriteria).then((data) => setMovies(data.results));
    fetchMovieVideos()

  }, [sortCriteria]);

  const fetchMovies = async (query = '', genreId = '') => {
    const url = query
      ? `${BASE_URL}/search/movie`
      : `${BASE_URL}/movie/popular`;


    try {
      const response = await axios.get(url, {
        params: {
          api_key: API_KEY,
          language: 'fr-FR',
          query: query,
          with_genres: genreId,
          page: 1
        }
      });
      setMovies(response.data.results);
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
    }
  };

  const fetchMovieVideos = async (movieId) => {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`)
    const data = await response.json()
    return data
  }

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
        params: {
          api_key: API_KEY,
          language: 'fr-FR'
        }
      });
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Erreur lors de la récupération des genres:', error);
    }
  };
  const fetchMoviesSorted = async (sortCriteria = 'popularity') => {
    try {
      const response = await axios.get(
        `${BASE_URL}/discover/movie?sort_by=${sortCriteria}.desc&api_key=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des films', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchMovies(e.target.value, selectedGenre);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    fetchMovies(searchTerm, e.target.value);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleBackToMovies = () => {
    setSelectedMovie(null);
  };

  // Fonction d'ajout aux favoris
  const addToWatchlist = (movie) => {
    const currentWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const isAlreadyInWatchlist = currentWatchlist.find((item) => item.id === movie.id);

    if (!isAlreadyInWatchlist) {
      const updatedWatchlist = [...currentWatchlist, movie];
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      alert('Film ajouté à la liste de favoris !');
    } else {
      alert('Ce film est déjà dans vos favoris.');
    }
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  return (
    <>
      <Router>
        <AppNavbar />
          <Routes>
            <Route path='/watchlist' element={<Watchlist />}/>
          </Routes>
      </Router>

      <Container className="my-4">
        {selectedMovie ? (
          <MovieDetails movie={selectedMovie} onBack={handleBackToMovies} />
        ) : (
          <>
            <h1 className="text-center mb-4">Films Populaires</h1>
            <Form className="mb-4">
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Rechercher un film..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </Col>
                <Col md={6}>
                  <Form.Control as="select" value={selectedGenre} onChange={handleGenreChange}>
                    <option value="">Tous les genres</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
            </Form>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="sortMovies">
                  <Form.Label>Trier par :</Form.Label>
                  <Form.Control as="select" value={sortCriteria} onChange={handleSortChange}>
                    <option value="popularity">Popularité</option>
                    <option value="release_date">Date de sortie</option>
                    <option value="vote_average">Note</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
            {movies.map((movie) => (
                <Col key={movie.id} md={4} className="mb-4">
                <Card>
                    <Card.Img variant="top" src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
                    <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Button variant="primary" onClick={() => addToWatchlist(movie)}>
                        Ajouter aux favoris
                    </Button>
                    <Button style={{marginLeft: "15px"}} variant="primary" onClick={() => handleMovieClick(movie)}>
                        Détails du films
                    </Button>
                    </Card.Body>
                </Card>
                </Col>
            ))}
            </Row>
          </>
        )}
      </Container>

      <Footer />
    </>
  );
}

export default App;
