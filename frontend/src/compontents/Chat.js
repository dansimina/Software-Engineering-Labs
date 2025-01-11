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
  ListItemAvatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Chat = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

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

  // Fetch messages for the last selected user on mount
  useEffect(() => {
    const selectedUserData = localStorage.getItem('selectedUser');
    if (selectedUserData) {
      const parsedSelectedUser = JSON.parse(selectedUserData);
      setSelectedUser(parsedSelectedUser);
      if (currentUser?.id && parsedSelectedUser?.id) {
        fetchMessages(currentUser.id, parsedSelectedUser.id);
      }
    }
  }, [currentUser]);

  // Scroll to the latest message when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
      console.log('Fetched messages:', response.data); // Debugging log
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
      setMessages([]);
    }
  };

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    localStorage.setItem('selectedUser', JSON.stringify(user));
    if (currentUser?.id && user?.id) {
      await fetchMessages(currentUser.id, user.id);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser?.id || !currentUser?.id) return;

    try {
      const response = await axios.post('http://localhost:8080/api/v1/messages/send', {
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        content: newMessage.trim()
      });

      if (response.data) {
        const sentMessage = {
          ...response.data,
          sender: currentUser,
          receiver: selectedUser,
          content: newMessage.trim(),
        };
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, height: '70vh' }}>
        {/* Users List */}
        <Paper sx={{ width: 300, overflow: 'auto' }}>
          <List>
            {followedUsers.map((user) => (
              <ListItem
                key={user.id}
                onClick={() => handleUserSelect(user)}
                selected={selectedUser?.id === user.id}
                sx={{
                  cursor: 'pointer',
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {user.username?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username || 'Unknown User'}
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

        {/* Messages Area */}
        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedUser ? (
            <>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                <Typography variant="h6">
                  Chat with {selectedUser.username}
                </Typography>
              </Box>

              <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {messages.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">No messages yet</Typography>
                  </Box>
                ) : (
                  messages.map((message, index) => {
                    console.log('Rendering message:', message); // Debugging log
                    return (
                      <React.Fragment key={message.id || index}>
                        <ListItem sx={{ py: 1 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: 1,
                            width: '100%'
                          }}>
                            <Typography 
                              component="span" 
                              variant="subtitle2" 
                              color={message.sender?.id === currentUser?.id ? 'primary' : 'text.primary'}
                              sx={{ 
                                fontWeight: message.sender?.id === currentUser?.id ? 'bold' : 'normal',
                                minWidth: 'fit-content'
                              }}
                            >
                              {message.sender?.id === currentUser?.id ? 'You' : selectedUser.username}:
                            </Typography>
                            <Typography 
                              component="span" 
                              sx={{ 
                                flex: 1,
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word'
                              }}
                            >
                              {message.content}
                            </Typography>
                            <Typography 
                              component="span" 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                ml: 2,
                                minWidth: 'fit-content'
                              }}
                            >
                              {formatDateTime(message.sentAt)}
                            </Typography>
                          </Box>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </List>

              <Box 
                component="form" 
                onSubmit={handleSendMessage} 
                sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="text.secondary">
                Select a user to
                </Typography> </Box> )} </Paper> </Box> </Container> ); };
                export default Chat;
                