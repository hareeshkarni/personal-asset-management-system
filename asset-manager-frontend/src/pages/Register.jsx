import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setSuccessMessage('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        background: '#0f172a',
        minHeight: '100vh',
        maxHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Left Side - Illustration */}
      <Box
        sx={{
          flex: 1,
          height: 'auto',
        }}
      >
        <img
          src="https://www.itchapter.com/france/wp-content/uploads/sites/5/2022/04/itam-header.jpg"
          alt="Illustration"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            maxHeight: '100%',
          }}
        />
      </Box>

      {/* Right Side - Form Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <Paper
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#fff' }}>
              <span style={{ padding: '0 6px', borderRadius: '4px' }}>Welcome to</span>
              <br />
              <span
                style={{
                  backgroundColor: '#3b82f6',
                  padding: '0 6px',
                  borderRadius: '4px',
                  color: '#fff',
                }}
              >
                Asset Manager!
              </span>
            </Typography>

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#cbd5e1' }}>
              Register your account
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Name"
                name="username"
                fullWidth
                variant="filled"
                value={formData.username}
                onChange={handleChange}
                required
                sx={glassField}
                InputProps={{ disableUnderline: true }}
                InputLabelProps={{ sx: { color: '#cbd5e1' } }}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                variant="filled"
                value={formData.email}
                onChange={handleChange}
                required
                sx={glassField}
                InputProps={{ disableUnderline: true }}
                InputLabelProps={{ sx: { color: '#cbd5e1' } }}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                variant="filled"
                value={formData.password}
                onChange={handleChange}
                required
                sx={glassField}
                InputProps={{ disableUnderline: true }}
                InputLabelProps={{ sx: { color: '#cbd5e1' } }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  backgroundColor: '#6366f1',
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#4f46e5',
                  },
                }}
              >
                Register
              </Button>

              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{ mt: 3, textAlign: 'center', color: '#cbd5e1' }}
              >
                Already have an account?{' '}
                <span
                  style={{ color: '#60a5fa', cursor: 'pointer' }}
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </span>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Snackbar Alerts */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const glassField = {
  mb: 2,
  '& .MuiFilledInput-root': {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    color: '#fff',
    padding: '8px 12px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.08)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255,255,255,0.1)',
      boxShadow: '0 0 0 2px #6366f1',
    },
  },
};

export default RegisterPage;