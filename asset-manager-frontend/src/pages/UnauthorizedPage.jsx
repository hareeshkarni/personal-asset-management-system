// src/pages/UnauthorizedPage.jsx
import React from 'react';
import { Typography, Container } from '@mui/material';

function UnauthorizedPage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" color="error">
        Unauthorized Access
      </Typography>
      <Typography>
        You do not have permission to view this page.
      </Typography>
    </Container>
  );
}

export default UnauthorizedPage;
