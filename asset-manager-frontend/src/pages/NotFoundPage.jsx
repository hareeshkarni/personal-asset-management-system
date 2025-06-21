// src/pages/NotFoundPage.jsx
import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ textAlign: 'center', paddingTop: '4rem' }}>
      <Typography variant="h3" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </Button>
    </Container>
  );
}

export default NotFoundPage;
