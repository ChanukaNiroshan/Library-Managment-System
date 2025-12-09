import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import BookManagementPage from './pages/BookManagementPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Simple auth check for demo
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

// Simple header component
const Header = () => (
  <header style={{
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '1rem',
    marginBottom: '2rem'
  }}>
    <h1 style={{ margin: 0 }}>Library Management System</h1>
    <nav style={{ marginTop: '1rem' }}>
      <a href="/" style={{ color: 'white', marginRight: '1rem' }}>Home</a>
      <a href="/books" style={{ color: 'white', marginRight: '1rem' }}>Books</a>
      {isAuthenticated() ? (
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          style={{ marginLeft: '1rem' }}
        >
          Logout
        </button>
      ) : (
        <>
          <a href="/login" style={{ color: 'white', marginRight: '1rem' }}>Login</a>
          <a href="/register" style={{ color: 'white' }}>Register</a>
        </>
      )}
    </nav>
  </header>
);

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/books"
          element={
            <PrivateRoute>
              <BookManagementPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;