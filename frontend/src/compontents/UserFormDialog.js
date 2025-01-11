import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const UserFormDialog = ({ open, onClose, onSuccess, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    surename: '',
    forename: '',
    description: '',
    role: 'USER'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        ...initialData,
        password: '' // Don't populate password for security
      });
    }
  }, [initialData, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (!isEditing && (!formData.password || formData.password.length < 6)) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.surename || !formData.forename) {
      setError('Please enter both surname and forename');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const endpoint = isEditing 
        ? `http://localhost:8080/api/v1/user/${initialData.id}`
        : 'http://localhost:8080/api/v1/user/save';
      
      const method = isEditing ? 'put' : 'post';
      
      // Only include password in the request if it's provided
      const requestData = {
        ...formData,
        ...((!isEditing || formData.password) && { password: formData.password })
      };

      const response = await axios[method](endpoint, requestData);
      
      if (response.data) {
        onSuccess();
        handleClose();
      }
    } catch (err) {
      console.error('Error saving user:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setError('Username or email already exists');
      } else {
        setError(isEditing ? 'Failed to update user' : 'Failed to create user');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      surename: '',
      forename: '',
      description: '',
      role: 'USER'
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit User Profile' : 'Add New User'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="username"
              label="Username"
              fullWidth
              required
              value={formData.username}
              onChange={handleInputChange}
              disabled={isEditing} // Username cannot be changed when editing
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="password"
              label={isEditing ? "New Password (leave blank to keep current)" : "Password"}
              type="password"
              fullWidth
              required={!isEditing}
              value={formData.password}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="surename"
              label="Surname"
              fullWidth
              required
              value={formData.surename}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="forename"
              label="Forename"
              fullWidth
              required
              value={formData.forename}
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
              value={formData.description}
              onChange={handleInputChange}
              helperText="Tell us about yourself (optional)"
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create User')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;