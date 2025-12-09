import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  LibraryBooks,
  Search,
  AddCircle,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#2c3e50',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: '0 0 20px 20px',
        }}
      >
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Library Management System
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
                Organize, manage, and track your book collection with ease
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/books')}
                sx={{
                  backgroundColor: '#3498db',
                  '&:hover': { backgroundColor: '#2980b9' },
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <LibraryBooks sx={{ fontSize: 200, opacity: 0.8 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 600 }}>
          Features
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Everything you need to manage your library
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: <AddCircle fontSize="large" />,
              title: 'Add Books',
              description: 'Easily add new books to your collection with detailed information.',
              color: '#2ecc71',
            },
            {
              icon: <Search fontSize="large" />,
              title: 'Search & Filter',
              description: 'Quickly find books by title, author, or description.',
              color: '#3498db',
            },
            {
              icon: <Edit fontSize="large" />,
              title: 'Edit Details',
              description: 'Update book information anytime with our intuitive interface.',
              color: '#f39c12',
            },
            {
              icon: <Delete fontSize="large" />,
              title: 'Manage Collection',
              description: 'Remove books from your collection when needed.',
              color: '#e74c3c',
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: `${feature.color}15`,
                    borderRadius: '50%',
                    p: 2,
                    mb: 2,
                  }}
                >
                  <Box sx={{ color: feature.color }}>{feature.icon}</Box>
                </Box>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;