import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Container,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import BookCard from './BookCard';
import BookForm from './BookForm';
import SearchBar from './SearchBar';
import ConfirmationDialog from './ConfirmationDialog';
import { Book, BookCreateDto, BookUpdateDto } from '../types';
import { bookService } from '../services/bookService';

interface BookListProps {
  showHeader?: boolean;
}

const BookList: React.FC<BookListProps> = ({ showHeader = true }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.isbn && book.isbn.includes(searchTerm))
      );
      setFilteredBooks(filtered);
    }
  }, [books, searchTerm]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      showSnackbar('Failed to load books', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const data = await bookService.searchBooks(searchTerm);
        setFilteredBooks(data);
      } catch (error) {
        showSnackbar('Failed to search books', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      loadBooks();
    }
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setFormOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setBookToDelete(id);
    setConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      try {
        await bookService.deleteBook(bookToDelete);
        setBooks(books.filter(book => book.id !== bookToDelete));
        showSnackbar('Book deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete book', 'error');
      }
    }
    setConfirmationOpen(false);
    setBookToDelete(null);
  };

  const handleSubmit = async (data: BookCreateDto) => {
    try {
      setIsSubmitting(true);
      
      if (selectedBook) {
        // Update existing book
        const updatedBook = await bookService.updateBook(selectedBook.id, data);
        setBooks(books.map(book => 
          book.id === selectedBook.id ? updatedBook : book
        ));
        showSnackbar('Book updated successfully', 'success');
      } else {
        // Create new book
        const newBook = await bookService.createBook(data);
        setBooks([newBook, ...books]);
        showSnackbar('Book added successfully', 'success');
      }
      
      setFormOpen(false);
    } catch (error) {
      showSnackbar(
        selectedBook ? 'Failed to update book' : 'Failed to add book',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && books.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {showHeader && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Library Books
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage your library collection with easy
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, alignItems: 'center' }}>
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by title, author, or description..."
        />
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddBook}
          sx={{
            backgroundColor: '#2ecc71',
            '&:hover': { backgroundColor: '#27ae60' },
            minWidth: 150,
          }}
        >
          Add Book
        </Button>
      </Box>

      {filteredBooks.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No books found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try a different search term' : 'Add your first book to get started'}
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            Showing {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
          </Typography>

          <Grid container spacing={3}>
            {filteredBooks.map((book) => (
              <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                <BookCard
                  book={book}
                  onEdit={handleEditBook}
                  onDelete={handleDeleteClick}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <BookForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedBook}
        isSubmitting={isSubmitting}
      />

      <ConfirmationDialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookList;