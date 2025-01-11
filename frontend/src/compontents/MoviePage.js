import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import axios from 'axios';

import EditMovieDialog from './EditMovieDialog';

const MovieInfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const extractVideoId = (url) => {
  if (!url) return null;

  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

const MoviePage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [videoId, setVideoId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    fetchMovie();
    fetchRecommendations();
  }, [movieId, navigate]);

  useEffect(() => {
    if (movie?.trailer) {
      const extractedId = extractVideoId(movie.trailer);
      setVideoId(extractedId);
    }
  }, [movie]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`http://localhost:8080/api/v1/movies/${movieId}`);

      if (!response.data) {
        throw new Error('No movie data received');
      }

      setMovie(response.data);
    } catch (err) {
      console.error('Error fetching movie:', err);
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/recommendations/movie/${movieId}`);
      console.log('Recommendations:', response.data);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleEditMovie = async (updatedMovie) => {
    try {
      setEditLoading(true);
      setEditError('');

      const response = await axios.put(`http://localhost:8080/api/v1/movies/${movieId}`, updatedMovie);

      if (response.data) {
        setMovie(response.data);
        setIsEditDialogOpen(false);
      }
    } catch (err) {
      console.error('Error updating movie:', err);
      setEditError(err.response?.data?.message || 'Failed to update movie');
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddRecommendation = () => {
    navigate(`/movie/${movieId}/add-recommendation`);
  };

  const renderPoster = () => {
    if (!movie?.poster) {
      return (
        <Box
          sx={{
            height: '500px',
            bgcolor: 'grey.300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography color="text.secondary">
            No poster available
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ height: '500px', position: 'relative' }}>
        <img
          src={movie.poster}
          alt={movie.title || 'Movie poster'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          onError={(e) => {
            console.error('Image failed to load');
            e.target.style.display = 'none';
          }}
        />
      </Box>
    );
  };

  const formatReleaseYear = (releaseYear) => {
    if (!releaseYear) return 'N/A';
    try {
      return new Date(releaseYear).getFullYear();
    } catch {
      return releaseYear;
    }
  };

  const renderGenres = (genresString) => {
    if (!genresString) return null;

    return genresString.split(',').map((genre, index) => (
      <Chip
        key={index}
        label={genre.trim()}
        sx={{ mr: 1, mb: 1 }}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={fetchMovie} sx={{ mr: 2 }}>
            Try Again
          </Button>
          <Button variant="outlined" onClick={() => navigate('/movies')}>
            Back to Movies
          </Button>
        </Box>
      </Container>
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/movies')} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {movie.title}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditDialogOpen(true)}
        >
          Edit Movie
        </Button>
      </Box>

      {/* Movie Details */}
      <MovieInfoCard>
        <Grid container>
          <Grid item xs={12} md={4}>
            {renderPoster()}
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {movie.title} ({formatReleaseYear(movie.releaseYear)})
              </Typography>

              <Box sx={{ mb: 2 }}>
                {renderGenres(movie.genres)}
              </Box>

              <Typography variant="body1" paragraph>
                {movie.description || 'No description available'}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Director
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {movie.director || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Runtime
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <AccessTimeIcon sx={{ fontSize: 'small', mr: 1 }} />
                    {movie.runtime || 'Not specified'}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" color="text.secondary">
                Stars
              </Typography>
              <Typography variant="body1" paragraph>
                {movie.stars || 'Cast information not available'}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddRecommendation}
                sx={{ mt: 2 }}
              >
                Add Recommendation
              </Button>
            </Box>
          </Grid>
        </Grid>
      </MovieInfoCard>

      {/* Trailer Section */}
      {videoId && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Trailer
          </Typography>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%', // 16:9 Aspect Ratio
              bgcolor: 'black',
              borderRadius: 1,
              overflow: 'hidden'
            }}
          >
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </Box>
      )}

      {/* Recommendations Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recommendations ({recommendations.length})
        </Typography>

        {recommendations.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center">
                No recommendations yet. Be the first to recommend this movie!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {recommendations.map((recommendation) => (
              <Grid item xs={12} key={recommendation.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          mr: 2
                        }}
                      >
                        {recommendation.user?.username?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {recommendation.user?.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(recommendation.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {recommendation.content}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CommentIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {recommendation.comments?.length || 0} comments
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/recommendations/${recommendation.id}`)}
                      >
                        View Full Discussion
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <EditMovieDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditMovie}
        movie={movie}
        loading={editLoading}
        error={editError}
      />
    </Container>
  );
};

export default MoviePage;