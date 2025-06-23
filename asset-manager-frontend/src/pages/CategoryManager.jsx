import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, TextField, Dialog,
  DialogActions, DialogContent, DialogTitle, Snackbar, Alert
} from '@mui/material';

import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/assetService';  // Assuming these exist in assetService.js

function CategoryManager({ token }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategories(token);
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    }
    setLoading(false);
  };

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCategoryName('');
    setEditingCategory(null);
  };

  const handleSave = async () => {
  if (!categoryName.trim()) {
    setError('Category name cannot be empty');
    return;
  }
  try {
    if (editingCategory) {
      // id, name, token
      await updateCategory(editingCategory.id, categoryName.trim(), token);
      setSuccessMsg('Category updated successfully');
    } else {
      // name, token
      await createCategory(categoryName.trim(), token);
      setSuccessMsg('Category created successfully');
    }
    handleCloseDialog();
    fetchCategories();
  } catch (err) {
    setError('Failed to save category');
  }
};

  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this category?')) return;
  try {
    await deleteCategory(id, token);
    setSuccessMsg('Category deleted successfully');
    fetchCategories();
  } catch (err) {
    setError('Failed to delete category');
  }
};

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>Manage Categories</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Add Category
      </Button>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map(cat => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => handleOpenDialog(cat)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">No categories found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="standard"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">{editingCategory ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg('')}
      >
        <Alert severity="success" onClose={() => setSuccessMsg('')}>{successMsg}</Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}

export default CategoryManager;
