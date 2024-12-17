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
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import axios from 'axios';

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  textAlign: 'center',
}));

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setCurrentUser(JSON.parse(userData));
    fetchUserProfile();
    fetchUserRecommendations();
  }, [userId, navigate]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/v1/user/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRecommendations = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/recommendations/user/${userId}`);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.post(`http://localhost:8080/api/v1/user/follow`, null, {
        params: {
          followerId: currentUser.id,
          followedId: userId
        }
      });
      fetchUserProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/user/unfollow`, {
        params: {
          followerId: currentUser.id,
          followedId: userId
        }
      });
      fetchUserProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
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
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const isFollowing = profile?.followerIds?.includes(currentUser?.id);
  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <IconButton 
        onClick={() => navigate('/users')} 
        sx={{ mb: 2 }}
        color="primary"
      >
        <ArrowBackIcon />
      </IconButton>

      {profile && (
        <>
          <ProfileHeader>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                fontSize: '3rem'
              }}
            >
              {profile.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography variant="h4" component="h1">
                  {profile.username}
                </Typography>
                {currentUser?.id !== parseInt(userId) && (
                  <Button
                    variant={isFollowing ? "outlined" : "contained"}
                    color="primary"
                    startIcon={isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {profile.forename} {profile.surename}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {profile.description || 'No description available'}
              </Typography>
            </Box>
          </ProfileHeader>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <StatsCard>
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {recommendations.length}
                  </Typography>
                  <Typography variant="body1">Recommendations</Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatsCard>
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {profile.followerIds?.length || 0}
                  </Typography>
                  <Typography variant="body1">Followers</Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatsCard>
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {profile.followingIds?.length || 0}
                  </Typography>
                  <Typography variant="body1">Following</Typography>
                </CardContent>
              </StatsCard>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h5" gutterBottom>
            Recent Recommendations
          </Typography>
          <Grid container spacing={3}>
            {recommendations.map((recommendation) => (
              <Grid item xs={12} md={6} key={recommendation.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {recommendation.movie.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {recommendation.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Posted on {formatDate(recommendation.createdAt)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default UserProfile;