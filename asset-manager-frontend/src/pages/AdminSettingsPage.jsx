import React, { useState } from 'react';
import {
  Container, Typography, Tabs, Tab, Box, Divider
} from '@mui/material';
import Layout from '../components/Layout';
import CategoryManager from '../components/admin/CategoryManager';
import StatusManager from '../components/admin/StatusManager';

function AdminSettingsPage() {
  const [tab, setTab] = useState(0);

  const handleChange = (_, newValue) => setTab(newValue);

  return (
    <Layout>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Admin Panel – Categories & Statuses
        </Typography>

        <Tabs value={tab} onChange={handleChange} sx={{ mb: 2 }}>
          <Tab label="Asset Categories" />
          <Tab label="Asset Statuses" />
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        <Box hidden={tab !== 0}>
          <CategoryManager />
        </Box>
        <Box hidden={tab !== 1}>
          <StatusManager />
        </Box>
      </Container>
    </Layout>
  );
}

export default AdminSettingsPage;
