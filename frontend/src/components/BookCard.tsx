import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Edit,
  Delete,
  CalendarToday,
  Fingerprint,
} from '@mui/icons-material';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: '#2c3e50',
            lineHeight: 1.3,
          }}
        >
          {book.title}
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 2, fontStyle: 'italic' }}
        >
          by {book.author}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {book.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          {book.isbn && (
            <Chip
              icon={<Fingerprint fontSize="small" />}
              label={`ISBN: ${book.isbn}`}
              size="small"
              sx={{ mr: 1, mb: 1 }}
              variant="outlined"
            />
          )}
          
          {book.publicationYear && (
            <Chip
              icon={<CalendarToday fontSize="small" />}
              label={`${book.publicationYear}`}
              size="small"
              sx={{ mr: 1, mb: 1 }}
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Added {formatDate(book.createdAt)}
        </Typography>
        
        <Box>
          <IconButton
            size="small"
            onClick={() => onEdit(book)}
            sx={{ color: '#3498db' }}
            aria-label="edit"
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(book.id)}
            sx={{ color: '#e74c3c' }}
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default BookCard;