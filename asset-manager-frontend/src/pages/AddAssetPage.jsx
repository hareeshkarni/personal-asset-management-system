import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { createAsset, fetchCategories, fetchStatuses } from '../services/assetService';
import { fetchUsers } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function AddAssetPage() {
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
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);

        const cats = await fetchCategories(token);
        const stats = await fetchStatuses(token);
        setCategories(cats);
        setStatuses(stats);

        if (decoded.role === 'ROLE_ADMIN') {
          const users = await fetchUsers(token);
          setUsers(users);
        }
      } catch (err) {
        console.error('Failed to load data', err);
        setError('Failed to load categories, statuses, or users.');
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAsset(form, token);
      setSuccessMessage('Asset added successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Asset creation failed:', err);
      setError('Failed to create asset. Check console for details.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Add New Asset</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Cost (in ₹)" name="cost" type="number" value={form.cost} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select name="category" value={form.category} onChange={handleChange} label="Category">
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={form.status} onChange={handleChange} label="Status">
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status.name}>{status.name}</MenuItem>
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
                    <MenuItem key={username} value={username}>
                      {username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField label="Purchase Date" name="purchaseDate" type="date" value={form.purchaseDate} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Warranty Expiry Date" name="warrantyExpiryDate" type="date" value={form.warrantyExpiryDate} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Image URL" name="assetImageUrl" value={form.assetImageUrl} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Feedback messages */}
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage('')}>
        <Alert severity="success" onClose={() => setSuccessMessage('')}>{successMessage}</Alert>
      </Snackbar>
    </Container>
  );
}

export default AddAssetPage;
