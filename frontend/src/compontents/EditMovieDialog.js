import React, { useState, useEffect } from 'react';
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

const Input = styled('input')({
  display: 'none',
});

const EditMovieDialog = ({ open, onClose, onSave, movie, loading, error }) => {
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

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        releaseYear: movie.releaseYear ? new Date(movie.releaseYear).getFullYear() : '',
        genres: movie.genres || '',
        runtime: movie.runtime || '',
        stars: movie.stars || '',
        director: movie.director || '',
        trailer: movie.trailer || ''
      });
      setPoster(movie.poster || null);
      setPosterPreview(movie.poster || null);
    }
  }, [movie]);

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
      if (file.size > 2000000) {
        alert('Image size should be less than 2MB');
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

  const handleSubmit = () => {
    const updatedMovie = {
      ...movie,
      ...formData,
      poster,
      releaseYear: new Date(formData.releaseYear, 0, 1).toISOString()
    };
    onSave(updatedMovie);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Movie</DialogTitle>
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
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="trailer"
                    label="Trailer URL"
                    fullWidth
                    value={formData.trailer}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMovieDialog;