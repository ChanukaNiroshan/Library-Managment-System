import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Book, BookCreateDto } from '../types';

interface BookFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookCreateDto) => Promise<void>;
  initialData?: Book | null;
  isSubmitting?: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(1, 'Title must be at least 1 character')
    .max(200, 'Title must be at most 200 characters'),
  author: Yup.string()
    .required('Author is required')
    .min(1, 'Author must be at least 1 character')
    .max(150, 'Author must be at most 150 characters'),
  description: Yup.string()
    .max(1000, 'Description must be at most 1000 characters'),
  isbn: Yup.string()
    .matches(/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits')
    .nullable(),
  publicationYear: Yup.number()
    .min(1000, 'Year must be after 1000')
    .max(2100, 'Year must be before 2100')
    .nullable(),
});

const BookForm: React.FC<BookFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const isEdit = !!initialData;

  const formik = useFormik({
    initialValues: {
      title: initialData?.title || '',
      author: initialData?.author || '',
      description: initialData?.description || '',
      isbn: initialData?.isbn || '',
      publicationYear: initialData?.publicationYear?.toString() || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const submitData = {
        ...values,
        publicationYear: values.publicationYear 
          ? parseInt(values.publicationYear) 
          : undefined,
        isbn: values.isbn || undefined,
      };
      await onSubmit(submitData);
      formik.resetForm();
    },
    enableReinitialize: true,
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        {isEdit ? 'Edit Book' : 'Add New Book'}
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Book Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                disabled={isSubmitting}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="author"
                name="author"
                label="Author"
                value={formik.values.author}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.author && Boolean(formik.errors.author)}
                helperText={formik.touched.author && formik.errors.author}
                disabled={isSubmitting}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="isbn"
                name="isbn"
                label="ISBN (10 or 13 digits)"
                value={formik.values.isbn}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.isbn && Boolean(formik.errors.isbn)}
                helperText={formik.touched.isbn && formik.errors.isbn}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="publicationYear"
                name="publicationYear"
                label="Publication Year"
                type="number"
                value={formik.values.publicationYear}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.publicationYear && Boolean(formik.errors.publicationYear)}
                helperText={formik.touched.publicationYear && formik.errors.publicationYear}
                disabled={isSubmitting}
                InputProps={{ inputProps: { min: 1000, max: 2100 } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={isSubmitting}
            sx={{ color: '#7f8c8d' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !formik.isValid}
            sx={{
              backgroundColor: '#3498db',
              '&:hover': { backgroundColor: '#2980b9' },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEdit ? (
              'Update Book'
            ) : (
              'Add Book'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookForm;