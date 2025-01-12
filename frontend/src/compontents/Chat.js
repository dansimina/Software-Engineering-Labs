import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  ListItemAvatar,
  useTheme,
  Badge
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Chat = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load current user and followed users on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setCurrentUser(parsedUser);
    fetchFollowedUsers(parsedUser.id);
  }, [navigate]);

  // Set up periodic message refresh
  useEffect(() => {
    let intervalId;
    if (currentUser?.id && selectedUser?.id) {
      // Initial fetch
      fetchMessages(currentUser.id, selectedUser.id);
      
      // Set up interval for periodic updates
      intervalId = setInterval(() => {
        fetchMessages(currentUser.id, selectedUser.id);
      }, 5000); // Refresh every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentUser?.id, selectedUser?.id]);

  const fetchFollowedUsers = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/user/${userId}`);
      const followedIds = response.data.followingIds || [];

      const usersPromises = followedIds.map(id =>
        axios.get(`http://localhost:8080/api/v1/user/${id}`)
      );

      const usersResponses = await Promise.all(usersPromises);
      const users = usersResponses.map(response => response.data);
      setFollowedUsers(users);
    } catch (error) {
      console.error('Error fetching followed users:', error);
      setError('Failed to load followed users');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId1, userId2) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/messages/between`, {
        params: { userId1, userId2 }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    }
  };

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    if (currentUser?.id && user?.id) {
      fetchMessages(currentUser.id, user.id);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser?.id || !currentUser?.id || sending) return;

    try {
      setSending(true);
      const response = await axios.post('http://localhost:8080/api/v1/messages/send', {
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        content: newMessage.trim()
      });

      if (response.data) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <IconButton onClick={() => navigate('/home')} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Messages
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        height: 'calc(100vh - 200px)',
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden'
      }}>
        {/* Users List */}
        <Paper sx={{ 
          width: 300, 
          overflow: 'auto',
          borderRadius: theme.shape.borderRadius
        }}>
          <List>
            {followedUsers.map((user) => (
              <ListItem
                key={user.id}
                onClick={() => handleUserSelect(user)}
                selected={selectedUser?.id === user.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                    }
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    {user.username?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={user.forename && user.surename ? 
                    `${user.forename} ${user.surename}` : 
                    'No name provided'}
                />
              </ListItem>
            ))}
            {followedUsers.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No followed users"
                  secondary="Follow some users to start chatting"
                />
              </ListItem>
            )}
          </List>
        </Paper>

        {/* Chat Area */}
        <Paper sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: theme.shape.borderRadius,
          bgcolor: theme.palette.background.paper
        }}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <Box sx={{ 
                p: 2, 
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    {selectedUser.username[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedUser.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.forename} {selectedUser.surename}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Messages Area */}
              <Box 
                ref={messageListRef}
                sx={{ 
                  flex: 1, 
                  overflow: 'auto', 
                  p: 2,
                  bgcolor: theme.palette.grey[50]
                }}
              >
                {messages.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%'
                  }}>
                    <Typography color="text.secondary">
                      No messages yet. Start a conversation!
                    </Typography>
                  </Box>
                ) : (
                  messages.map((message, index) => {
                    const isCurrentUser = message.sender.id === currentUser.id;
                    const showDate = index === 0 || 
                      new Date(message.sentAt).toDateString() !== 
                      new Date(messages[index - 1].sentAt).toDateString();

                    return (
                      <React.Fragment key={message.id}>
                        {showDate && (
                          <Box 
                            sx={{ 
                              textAlign: 'center', 
                              my: 2,
                              position: 'relative'
                            }}
                          >
                            <Typography 
                              variant="caption"
                              sx={{
                                bgcolor: 'background.paper',
                                px: 2,
                                py: 0.5,
                                borderRadius: 1,
                                color: 'text.secondary'
                              }}
                            >
                              {new Date(message.sentAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                            mb: 1.5
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: '70%',
                              bgcolor: isCurrentUser ? 'primary.main' : 'background.paper',
                              color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                              borderRadius: 2,
                              p: 1.5,
                              boxShadow: 1
                            }}
                          >
                            <Typography variant="body1">
                              {message.content}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                display: 'block',
                                textAlign: 'right',
                                mt: 0.5,
                                opacity: 0.8
                              }}
                            >
                              {formatDateTime(message.sentAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box 
                component="form" 
                onSubmit={handleSendMessage}
                sx={{ 
                  p: 2, 
                  borderTop: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.background.paper
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="medium"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    InputProps={{
                      sx: {
                        borderRadius: 2
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!newMessage.trim() || sending}
                    endIcon={<SendIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%'
            }}>
              <Typography color="text.secondary">
                Select a user to start chatting
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Chat;