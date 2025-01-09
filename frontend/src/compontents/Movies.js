import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  IconButton,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  gap: theme.spacing(2),
}));

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    fetchMovies();
  }, [navigate]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('http://localhost:8080/api/v1/movies', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Movies response:', response.data);
      
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected an array');
      }
      
      setMovies(response.data);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMovie = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/home')} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Movies
        </Typography>
      </Box>

      <SearchBox>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search movies by title, genre, or director..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
        />
      </SearchBox>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id || Math.random()}>
              <StyledCard>
                {movie.poster && (
                  <CardMedia
                    component="img"
                    height="300"
                    image={movie.poster}
                    alt={movie.title || 'Movie poster'}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                      console.error(`Error loading image for movie: ${movie.title}`);
                      e.target.src = '/api/placeholder/400/300'; // Placeholder image
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {movie.title || 'Untitled Movie'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {movie.releaseYear ? new Date(movie.releaseYear).getFullYear() : 'N/A'} • {movie.genres || 'No genres listed'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {movie.description || 'No description available'}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleViewMovie(movie.id)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
          {filteredMovies.length === 0 && !loading && !error && (
            <Grid item xs={12}>
              <Alert severity="info">No movies found</Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Movies;