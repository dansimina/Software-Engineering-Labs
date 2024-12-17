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
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

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
        {loading ? (
          <Typography>Loading recommendations...</Typography>
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
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {recommendation.user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {recommendation.user.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(recommendation.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="h6" gutterBottom>
                        {recommendation.movie.title}
                      </Typography>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {recommendation.content}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {recommendation.comments?.length || 0} comments
                        </Typography>
                      </Box>
                    </CardContent>
                  </RecommendationCard>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </MainContent>
    </Box>
  );
};

export default Home;