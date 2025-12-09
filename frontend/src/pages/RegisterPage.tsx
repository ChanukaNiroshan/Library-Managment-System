import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5006/api';

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        setLoading(true);

        console.log('Registering user:', { fullName: values.fullName, email: values.email });

        // Register the user
        const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        });

        console.log('Registration response:', registerResponse.data);

        let token = registerResponse.data.token;
        let user = registerResponse.data.user;

        // If no token in registration response, try to login
        if (!token) {
          console.log('No token in register response, attempting login...');
          
          const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: values.email,
            password: values.password,
          });

          token = loginResponse.data.token;
          user = loginResponse.data.user;
        }

        if (!token) {
          throw new Error('No token received from server');
        }

        // Store token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user || { 
          email: values.email, 
          fullName: values.fullName 
        }));

        console.log('Token saved:', localStorage.getItem('token'));
        console.log('User saved:', localStorage.getItem('user'));

        // Navigate to home page
        navigate('/', { replace: true });
        
        // Force reload to ensure components pick up the new auth state
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch (err: any) {
        console.error('Registration error:', err);
        console.error('Error response:', err.response?.data);
        
        let errorMessage = 'Registration failed. Please try again.';
        
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.data?.title) {
          errorMessage = err.response.data.title;
        } else if (typeof err.response?.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response?.status === 400) {
          errorMessage = 'Invalid registration data. Please check your inputs.';
        } else if (err.response?.status === 409) {
          errorMessage = 'An account with this email already exists.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join our library management system
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="fullName"
            name="fullName"
            label="Full Name"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            disabled={loading}
            sx={{ mb: 4 }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !formik.isValid}
            sx={{
              backgroundColor: '#2ecc71',
              '&:hover': { backgroundColor: '#27ae60' },
              py: 1.5,
              mb: 3,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Account'
            )}
          </Button>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#3498db',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;