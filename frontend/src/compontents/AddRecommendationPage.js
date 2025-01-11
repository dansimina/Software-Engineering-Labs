import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const AddRecommendationPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    fetchMovie();
  }, [movieId, navigate]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v1/movies/${movieId}`);
      setMovie(response.data);
    } catch (err) {
      console.error('Error fetching movie:', err);
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please enter your recommendation');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      setError('Please log in to add a recommendation');
      return;
    }

    try {
      setSubmitLoading(true);
      setError('');
      
      // Updated to match the createRecommendation method in RecommendationService
      await axios.post(`http://localhost:8080/api/v1/recommendations/create`, {
        userId: userData.id,
        movieId: parseInt(movieId),
        content: content.trim()
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/movies/${movieId}`);
      }, 2000);
    } catch (err) {
      console.error('Error submitting recommendation:', err);
      if (err.response?.data?.message?.includes('already recommended')) {
        setError('You have already recommended this movie');
      } else {
        setError(err.response?.data?.message || 'Failed to submit recommendation');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(`/movies/${movieId}`)} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Add Recommendation
        </Typography>
      </Box>

      {movie && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                {movie.poster && (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '4px'
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography variant="h5" gutterBottom>
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {movie.description}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Recommendation submitted successfully! Redirecting...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Recommendation"
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={!!error && !content.trim()}
            helperText="Share your thoughts about this movie"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/movies/${movieId}`)}
              disabled={submitLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              disabled={submitLoading || !content.trim()}
            >
              {submitLoading ? <CircularProgress size={24} /> : 'Submit Recommendation'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddRecommendationPage;