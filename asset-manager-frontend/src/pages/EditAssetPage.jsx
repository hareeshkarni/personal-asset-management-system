import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, MenuItem,
  Select, InputLabel, FormControl, Grid, Box,
  CircularProgress, Alert, Snackbar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  fetchCategories,
  fetchStatuses,
  getAssetById,
  updateAsset
} from '../services/assetService';
import { fetchUsers } from '../services/userService';

function EditAssetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    name: '',
    description: '',
    cost: '',
    category: '',
    status: '',
    purchaseDate: '',
    warrantyExpiryDate: '',
    assetImageUrl: '',
    username: ''
  });

  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);

        const [asset, cats, stats] = await Promise.all([
          getAssetById(id, token),
          fetchCategories(token),
          fetchStatuses(token)
        ]);

        const userList = decoded.role === 'ROLE_ADMIN' ? await fetchUsers(token) : [];

        setForm({
          ...asset,
          username: asset.assignedTo || '',
          purchaseDate: asset.purchaseDate || '',
          warrantyExpiryDate: asset.warrantyExpiryDate || '',
        });

        setCategories(cats);
        setStatuses(stats);
        setUsers(userList);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load data', err);
        setError('Failed to load asset, categories, or users.');
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAsset(id, form, token);
      setSuccessMessage('Asset updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Asset update failed:', err);
      setError('Failed to update asset');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4, ml: 4 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Edit Asset</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Cost (₹)" name="cost" type="number" value={form.cost} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select name="category" value={form.category} onChange={handleChange} label="Category">
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={form.status} onChange={handleChange} label="Status">
                {statuses.map(stat => (
                  <MenuItem key={stat.id} value={stat.name}>{stat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {userRole === 'ROLE_ADMIN' && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Assign To User</InputLabel>
                <Select name="username" value={form.username} onChange={handleChange} label="Assign To User">
                  {users.map(username => (
                    <MenuItem key={username} value={username}>{username}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              label="Purchase Date"
              name="purchaseDate"
              type="date"
              value={form.purchaseDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Warranty Expiry Date"
              name="warrantyExpiryDate"
              type="date"
              value={form.warrantyExpiryDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Image URL" name="assetImageUrl" value={form.assetImageUrl} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage('')}>
        <Alert onClose={() => setSuccessMessage('')} severity="success">{successMessage}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
}

export default EditAssetPage;
