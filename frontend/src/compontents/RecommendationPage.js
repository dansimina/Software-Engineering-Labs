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
  Divider,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MovieIcon from '@mui/icons-material/Movie';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const RecommendationPage = () => {
  const { recommendationId } = useParams();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setCurrentUser(JSON.parse(userData));
    fetchRecommendation();
    fetchComments();
  }, [recommendationId, navigate]);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:8080/api/v1/recommendations/${recommendationId}`);
      setRecommendation(response.data);
    } catch (err) {
      console.error('Error fetching recommendation:', err);
      setError('Failed to load recommendation details');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/comments/recommendation/${recommendationId}`);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await axios.post('http://localhost:8080/api/v1/comments/create', {
        userId: currentUser.id,
        recommendationId: parseInt(recommendationId),
        content: newComment.trim()
      });

      setNewComment('');
      fetchComments(); // Refresh comments after posting
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      </Container>
    );
  }

  if (!recommendation) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/home')} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Movie Recommendation
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'primary.main',
                    mr: 2
                  }}
                >
                  {recommendation.user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {recommendation.user?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posted on {formatDate(recommendation.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {recommendation.movie && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {recommendation.movie.poster ? (
                        <img
                          src={recommendation.movie.poster}
                          alt={recommendation.movie.title}
                          style={{ width: 100, height: 150, objectFit: 'cover', borderRadius: 4 }}
                        />
                      ) : (
                        <MovieIcon sx={{ fontSize: 100, color: 'grey.500' }} />
                      )}
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {recommendation.movie.title}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/movies/${recommendation.movie.id}`)}
                        >
                          View Movie Details
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Recommendation
              </Typography>
              <Typography variant="body1" paragraph>
                {recommendation.content}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>

          {/* Comment Form */}
          <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Comments List */}
          <List>
            {comments.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No comments yet. Be the first to comment!
              </Typography>
            ) : (
              comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {comment.user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">
                            {comment.user.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={comment.content}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            )}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecommendationPage;