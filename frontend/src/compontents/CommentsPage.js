import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const CommentsPage = () => {
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
    Promise.all([fetchRecommendation(), fetchComments()])
      .finally(() => setLoading(false));
  }, [recommendationId, navigate]);

  const fetchRecommendation = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/recommendations/${recommendationId}`);
      console.log('Recommendation:', response.data);
      setRecommendation(response.data);
    } catch (err) {
      console.error('Error fetching recommendation:', err);
      setError('Failed to load recommendation details');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/comments/recommendation/${recommendationId}`);
      console.log('Comments:', response.data);
      setComments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
      setComments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError('');

      const response = await axios.post('http://localhost:8080/api/v1/comments/create', {
        userId: currentUser.id,
        recommendationId: parseInt(recommendationId),
        content: newComment.trim()
      });

      console.log('New comment response:', response.data);
      
      setNewComment('');
      await fetchComments(); // Refresh comments after posting
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Comments
        </Typography>
      </Box>

      {recommendation && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 48,
                  height: 48
                }}
              >
                {recommendation.user?.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {recommendation.user?.username}'s Recommendation
                </Typography>
                <Typography variant="body1" paragraph>
                  {recommendation.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Posted on {formatDate(recommendation.createdAt)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || !newComment.trim()}
            endIcon={<SendIcon />}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </Box>
      </Box>

      <Typography variant="h5" gutterBottom>
        Comments ({comments.length})
      </Typography>

      {comments.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" align="center">
              No comments yet. Be the first to comment!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    {comment.user?.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {comment.user?.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default CommentsPage;