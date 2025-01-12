import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Alert,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const CommentDialog = ({ open, onClose, recommendationId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!recommendationId) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(
        `http://localhost:8080/api/v1/comments/recommendation/${recommendationId}`
      );
      
      // Ensure we have valid data
      const commentsArray = Array.isArray(response.data) ? response.data : [];
      setComments(commentsArray);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Unable to load comments. Please try again.');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [recommendationId]);

  useEffect(() => {
    if (open && recommendationId) {
      fetchComments();
    }
  }, [open, recommendationId, fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const userData = localStorage.getItem('user');
    if (!userData) {
      setError('Please log in to comment');
      return;
    }

    const user = JSON.parse(userData);

    try {
      setSubmitting(true);
      setError('');
      
      await axios.post('http://localhost:8080/api/v1/comments/create', {
        userId: user.id,
        recommendationId: parseInt(recommendationId),
        content: newComment.trim()
      });
      
      setNewComment('');
      await fetchComments();
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6">
          Comments ({comments.length})
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* New Comment Form */}
        <Card sx={{ mb: 3 }} elevation={0}>
          <CardContent>
            <form onSubmit={handleSubmit}>
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
            </form>
          </CardContent>
        </Card>

        <Divider sx={{ mb: 2 }} />

        {/* Comments List */}
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {comments.length === 0 ? (
              <Grid item xs={12}>
                <Card elevation={0}>
                  <CardContent>
                    <Typography color="text.secondary" align="center">
                      No comments yet. Be the first to comment!
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              comments.map((comment) => (
                <Grid item xs={12} key={comment.id}>
                  <Card elevation={1}>
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            width: 40,
                            height: 40
                          }}
                        >
                          {comment.user?.username?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 0.5
                          }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              {comment.user?.username || 'Unknown User'}
                              <Typography 
                                component="span" 
                                variant="body2" 
                                color="text.secondary"
                              >
                                • {formatDate(comment.createdAt)}
                              </Typography>
                            </Typography>
                          </Box>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'text.primary',
                              whiteSpace: 'pre-wrap'
                            }}
                          >
                            {comment.content}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;