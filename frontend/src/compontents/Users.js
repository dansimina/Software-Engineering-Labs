import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  Grid,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
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

const UserInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setCurrentUser(JSON.parse(userData));
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/v1/user/all');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userToFollow) => {
    try {
      await axios.post(`http://localhost:8080/api/v1/user/follow`, null, {
        params: {
          followerId: currentUser.id,
          followedId: userToFollow.id
        }
      });

      const updatedUsers = users.map(user => {
        if (user.id === userToFollow.id) {
          return {
            ...user,
            followerIds: [...(user.followerIds || []), currentUser.id]
          };
        }
        return user;
      });
      setUsers(updatedUsers);

      setSnackbar({
        open: true,
        message: `You are now following ${userToFollow.username}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error following user:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to follow user. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleUnfollow = async (userToUnfollow) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/user/unfollow`, {
        params: {
          followerId: currentUser.id,
          followedId: userToUnfollow.id
        }
      });

      const updatedUsers = users.map(user => {
        if (user.id === userToUnfollow.id) {
          return {
            ...user,
            followerIds: (user.followerIds || []).filter(id => id !== currentUser.id)
          };
        }
        return user;
      });
      setUsers(updatedUsers);

      setSnackbar({
        open: true,
        message: `You have unfollowed ${userToUnfollow.username}`,
        severity: 'info'
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to unfollow user. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/users/${userId}`);
  };

  const filteredUsers = users.filter(user => 
    user.id !== currentUser?.id && // Don't show current user
    (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.forename.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.surename.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isUserFollowed = (user) => {
    return user.followerIds?.includes(currentUser?.id);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/home')} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Users
        </Typography>
      </Box>

      {/* Search Box */}
      <SearchBox>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
        />
      </SearchBox>

      {/* Users Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56,
                        bgcolor: 'primary.main'
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <UserInfo>
                      <Typography variant="h6" gutterBottom>
                        {user.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {user.forename} {user.surename}
                      </Typography>
                      {user.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {user.description}
                        </Typography>
                      )}
                    </UserInfo>
                  </Box>
                  
                  <ButtonsContainer>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewProfile(user.id)}
                      fullWidth
                    >
                      View Profile
                    </Button>
                    {isUserFollowed(user) ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<PersonRemoveIcon />}
                        onClick={() => handleUnfollow(user)}
                        fullWidth
                      >
                        Unfollow
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAddIcon />}
                        onClick={() => handleFollow(user)}
                        fullWidth
                      >
                        Follow
                      </Button>
                    )}
                  </ButtonsContainer>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Users;