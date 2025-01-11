import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MovieIcon from '@mui/icons-material/Movie';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import CommentIcon from '@mui/icons-material/Comment';
import axios from 'axios';
import CommentDialog from './CommentDialog';

const RecommendationPage = () => {
  const { recommendationId } = useParams();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    fetchRecommendation();
  }, [recommendationId, navigate]);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v1/recommendations/${recommendationId}`);
      setRecommendation(response.data);
    } catch (err) {
      console.error('Error fetching recommendation:', err);
      setError('Failed to load recommendation details');
    } finally {
      setLoading(false);
    }
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
        <Button variant="contained" onClick={() => navigate('/home')} sx={{ mt: 2 }}>
          Return to Home
        </Button>
      </Container>
    );
  }

  if (!recommendation) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Back Button */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/home')} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Movie Recommendation
        </Typography>
      </Box>

      {/* Movie Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* User Info Section */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    mr: 2
                  }}
                >
                  {recommendation.user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">
                      {recommendation.user?.username}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PersonIcon />}
                      onClick={() => navigate(`/users/${recommendation.user?.id}`)}
                    >
                      View Profile
                    </Button>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon fontSize="small" />
                    Posted on {formatDate(recommendation.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Movie Details Section */}
            {recommendation.movie && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      {recommendation.movie.poster ? (
                        <img
                          src={recommendation.movie.poster}
                          alt={recommendation.movie.title}
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '4px',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '200px',
                            bgcolor: 'grey.200',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1
                          }}
                        >
                          <MovieIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Typography variant="h5" gutterBottom>
                        {recommendation.movie.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {recommendation.movie.description}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/movies/${recommendation.movie.id}`)}
                      >
                        View Movie Details
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Recommendation Content */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Recommendation
              </Typography>
              <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {recommendation.content}
                </Typography>
              </Paper>
            </Grid>

            {/* Comments Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<CommentIcon />}
                  onClick={() => setIsCommentDialogOpen(true)}
                >
                  View Comments ({recommendation.comments?.length || 0})
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Comments Dialog */}
      <CommentDialog
        open={isCommentDialogOpen}
        onClose={() => setIsCommentDialogOpen(false)}
        recommendationId={recommendationId}
      />
    </Container>
  );
};

export default RecommendationPage;