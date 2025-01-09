import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  IconButton,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const Input = styled('input')({
  display: 'none',
});

const MovieFormDialog = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseYear: '',
    genres: '',
    runtime: '',
    stars: '',
    director: '',
    trailer: ''
  });
  
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2000000) { // 2MB limit
        setError('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPoster(reader.result);
        setPosterPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPoster(null);
    setPosterPreview(null);
  };

  const convertRuntimeToLocalTime = (runtimeStr) => {
    if (!runtimeStr) return null;
    
    // Extract hours and minutes from string like "2h 22m"
    const hoursMatch = runtimeStr.match(/(\d+)h/);
    const minutesMatch = runtimeStr.match(/(\d+)m/);
    
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    
    // Convert to HH:mm:ss format
    const totalMinutes = (hours * 60) + minutes;
    const formattedHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const formattedMinutes = (totalMinutes % 60).toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}:00`;
  };

  const validateForm = () => {
    if (!formData.title) {
      setError('Title is required');
      return false;
    }
    if (!formData.description) {
      setError('Description is required');
      return false;
    }
    if (!formData.releaseYear || formData.releaseYear < 1888 || formData.releaseYear > new Date().getFullYear() + 5) {
      setError('Please enter a valid release year');
      return false;
    }

    // Validate runtime format if provided
    if (formData.runtime) {
      const runtimeRegex = /^(\d+h\s*)?(\d+m)?$/;
      if (!runtimeRegex.test(formData.runtime.trim())) {
        setError('Runtime should be in format: 2h 30m or 90m');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const movieData = {
        ...formData,
        poster: poster,
        createdAt: new Date().toISOString(),
        releaseYear: new Date(formData.releaseYear, 0, 1).toISOString(),
        runtime: convertRuntimeToLocalTime(formData.runtime)
      };

      const response = await axios.post('http://localhost:8080/api/v1/movies/create', movieData);
      
      if (response.data) {
        onSuccess();
        handleClose();
      }
    } catch (err) {
      console.error('Error creating movie:', err);
      setError(err.response?.data?.message || 'Failed to create movie');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      releaseYear: '',
      genres: '',
      runtime: '',
      stars: '',
      director: '',
      trailer: ''
    });
    setPoster(null);
    setPosterPreview(null);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Movie</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Poster Upload Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                {posterPreview ? (
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={posterPreview}
                      alt="Movie poster preview"
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
                      }}
                      onClick={handleRemoveImage}
                    >
                      <DeleteIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </Box>
                ) : (
                  <label htmlFor="poster-upload">
                    <Input
                      accept="image/*"
                      id="poster-upload"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <Button
                      component="span"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{ height: '200px', width: '100%' }}
                    >
                      Upload Poster
                    </Button>
                  </label>
                )}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Max file size: 2MB
                </Typography>
              </Box>
            </Grid>

            {/* Movie Details Form */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="title"
                    label="Movie Title"
                    fullWidth
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="releaseYear"
                    label="Release Year"
                    type="number"
                    fullWidth
                    required
                    value={formData.releaseYear}
                    onChange={handleInputChange}
                    inputProps={{ 
                      min: 1888,
                      max: new Date().getFullYear() + 5
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="genres"
                    label="Genres (comma-separated)"
                    fullWidth
                    value={formData.genres}
                    onChange={handleInputChange}
                    helperText="e.g., Action, Drama, Comedy"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="runtime"
                    label="Runtime"
                    fullWidth
                    value={formData.runtime}
                    onChange={handleInputChange}
                    helperText="Format: 2h 30m or 90m"
                    placeholder="2h 30m"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="director"
                    label="Director"
                    fullWidth
                    value={formData.director}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="stars"
                    label="Stars (comma-separated)"
                    fullWidth
                    value={formData.stars}
                    onChange={handleInputChange}
                    helperText="e.g., Tom Hanks, Morgan Freeman"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="trailer"
                    label="Trailer URL"
                    fullWidth
                    value={formData.trailer}
                    onChange={handleInputChange}
                    helperText="YouTube or other video platform URL"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Creating...' : 'Create Movie'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovieFormDialog;