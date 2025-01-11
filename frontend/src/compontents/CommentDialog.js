import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const CommentDialog = ({ open, onClose, recommendationId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    if (open && recommendationId) {
      fetchComments();
    }
  }, [open, recommendationId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v1/comments/recommendation/${recommendationId}`);
      console.log('Raw comment data:', response.data);
      
      if (response.data) {
        let commentsArray = Array.isArray(response.data) ? response.data : [response.data];
        
        // Add console logging to inspect comment structure
        commentsArray.forEach((comment, index) => {
          console.log(`Comment ${index + 1}:`, {
            id: comment.id,
            content: comment.content,
            user: comment.user,
            createdAt: comment.createdAt
          });
        });
        
        setComments(commentsArray);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      setSubmitting(true);
      setError('');
      
      const response = await axios.post('http://localhost:8080/api/v1/comments/create', {
        userId: currentUser.id,
        recommendationId: parseInt(recommendationId),
        content: newComment.trim()
      });
      
      console.log('Comment creation response:', response.data);

      console.log('New comment response:', response.data);
      setNewComment('');
      await fetchComments();
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '80vh', // Set maximum height
          minHeight: '60vh'  // Set minimum height
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6">
          Comments ({comments.length})
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <List sx={{ mb: 2 }}>
                              {comments.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" color="text.secondary" align="center">
                        No comments yet. Be the first to comment!
                      </Typography>
                    }
                  />
                </ListItem>
              ) : (
                comments.slice(0, 5).map((comment, index) => {
                  // Log the individual fields we're trying to render
                  console.log(`Rendering comment ${index + 1}:`, {
                    content: comment.content,
                    createdAt: comment.createdAt,
                    username: comment.user?.username
                  });
                  return (
                  <React.Fragment key={comment.id || index}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {comment.user?.username?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                            <Typography variant="subtitle1" component="span" fontWeight="bold">
                              {comment.user?.username || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(comment.createdAt)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            {comment.content ? (
                              <Typography
                                variant="body1"
                                color="text.primary"
                                sx={{ 
                                  whiteSpace: 'pre-wrap',
                                  minHeight: '3em',
                                  backgroundColor: 'grey.50',
                                  p: 2,
                                  borderRadius: 1,
                                  fontSize: '1rem',
                                  lineHeight: 1.6
                                }}
                              >
                                {comment.content}
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontStyle: 'italic' }}
                              >
                                Content not available
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < comments.length - 1 && (
                      <Divider variant="inset" component="li" sx={{ my: 1 }} />
                    )}
                  </React.Fragment>
                )})
              )}
              {comments.length > 5 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing first 5 comments of {comments.length}
                  </Typography>
                </Box>
              )}
            </List>
          </>
        )}
      </DialogContent>

      <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Add a comment
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !newComment.trim()}
              startIcon={<SendIcon />}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default CommentDialog;