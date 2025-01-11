import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  useTheme,
  Avatar,
  Divider,
  ButtonGroup,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import MovieIcon from '@mui/icons-material/Movie';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import LaunchIcon from '@mui/icons-material/Launch';
import AddIcon from '@mui/icons-material/Add';
import MovieFormDialog from './MovieFormDialog';
import UserFormDialog from './UserFormDialog';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const StyledToolbar = styled(Toolbar)({
  justifyContent: 'space-between',
});

const UserSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const NavigationButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const MainContent = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const RecommendationCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMovieFormOpen, setIsMovieFormOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchRecommendations(parsedUser.id);
  }, [navigate]);

  const fetchRecommendations = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/v1/recommendations/followed/${userId}`
      );
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleMovieFormSuccess = () => {
    setIsMovieFormOpen(false);
  };

  const handleUserFormSuccess = async () => {
    setIsUserFormOpen(false);
    // Optionally refresh data if needed
    if (user?.id) {
      await fetchRecommendations(user.id);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <StyledAppBar position="static" elevation={1}>
        <StyledToolbar>
          <Typography variant="h6" component="h1" color="text.primary" sx={{ fontWeight: 'bold' }}>
            Movie Recommendations
          </Typography>
          
          {user && (
            <UserSection>
              <Typography variant="body1" color="text.secondary">
                Welcome, {user.username}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleNavigate(`/users/${user.id}`)}
                size="small"
                sx={{ mr: 1 }}
              >
                My Profile
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLogout}
                size="small"
              >
                Logout
              </Button>
            </UserSection>
          )}
        </StyledToolbar>
      </StyledAppBar>

      <MainContent maxWidth="lg">
        <NavigationButtons>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ButtonGroup variant="contained" size="large">
              <Button
                onClick={() => handleNavigate('/movies')}
                startIcon={<MovieIcon />}
                sx={{ px: 4 }}
              >
                Movies
              </Button>
              <Button
                onClick={() => handleNavigate('/users')}
                startIcon={<PeopleIcon />}
                sx={{ px: 4 }}
              >
                Users
              </Button>
              <Button
                onClick={() => handleNavigate('/chat')}
                startIcon={<ChatIcon />}
                sx={{ px: 4 }}
              >
                Chat
              </Button>
            </ButtonGroup>
            
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => setIsMovieFormOpen(true)}
              sx={{ height: '100%' }}
            >
              Add Movie
            </Button>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => setIsUserFormOpen(true)}
              sx={{ height: '100%' }}
            >
              Add User
            </Button>
          </Box>
        </NavigationButtons>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {recommendations.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      No recommendations yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Follow other users to see their movie recommendations here!
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              recommendations.map((recommendation) => (
                <Grid item xs={12} md={6} key={recommendation.id}>
                  <RecommendationCard elevation={2}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main', 
                            mr: 2,
                            width: 48,
                            height: 48
                          }}
                        >
                          {recommendation.user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {recommendation.user.username}
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<LaunchIcon />}
                              onClick={() => handleNavigate(`/users/${recommendation.user.id}`)}
                              sx={{ minWidth: 0, p: 0 }}
                            >
                              Profile
                            </Button>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(recommendation.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          mb: 2 
                        }}
                      >
                        {recommendation.movie?.poster ? (
                          <img
                            src={recommendation.movie.poster}
                            alt={recommendation.movie.title}
                            style={{
                              width: 60,
                              height: 90,
                              objectFit: 'cover',
                              borderRadius: theme.shape.borderRadius
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 60,
                              height: 90,
                              bgcolor: 'grey.200',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1
                            }}
                          >
                            <MovieIcon sx={{ fontSize: 32, color: 'grey.400' }} />
                          </Box>
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {recommendation.movie.title}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleNavigate(`/movies/${recommendation.movie.id}`)}
                          >
                            View Movie
                          </Button>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          mb: 2,
                          minHeight: '4.5em'
                        }}
                      >
                        {recommendation.content}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 'auto'
                      }}>
                        <Typography variant="caption" color="text.secondary">
                          {recommendation.comments?.length || 0} comments
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleNavigate(`/recommendations/${recommendation.id}`)}
                        >
                          Read Full Recommendation
                        </Button>
                      </Box>
                    </CardContent>
                  </RecommendationCard>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </MainContent>

      <MovieFormDialog
        open={isMovieFormOpen}
        onClose={() => setIsMovieFormOpen(false)}
        onSuccess={handleMovieFormSuccess}
      />

      <UserFormDialog
        open={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        onSuccess={handleUserFormSuccess}
      />
    </Box>
  );
};

export default Home;