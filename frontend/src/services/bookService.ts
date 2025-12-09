// src/services/bookService.ts
import axios from 'axios';
import { Book, BookCreateDto, BookUpdateDto } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5006/api';

// Helper function to get headers with auth token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

class BookService {
  private baseURL = `${API_BASE_URL}/books`;

  async getAllBooks(): Promise<Book[]> {
    try {
      console.log('Fetching all books...');
      const response = await axios.get<Book[]>(this.baseURL, {
        headers: getHeaders(),
      });
      console.log('Books fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching books:', error.response?.data || error.message);
      throw error;
    }
  }

  async getBookById(id: number): Promise<Book> {
    try {
      const response = await axios.get<Book>(`${this.baseURL}/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching book:', error.response?.data || error.message);
      throw error;
    }
  }

  async searchBooks(searchTerm: string): Promise<Book[]> {
    try {
      const response = await axios.get<Book[]>(
        `${this.baseURL}/search?query=${encodeURIComponent(searchTerm)}`,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error searching books:', error.response?.data || error.message);
      // If search endpoint doesn't exist, fall back to client-side filtering
      const allBooks = await this.getAllBooks();
      return allBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  }

  async createBook(book: BookCreateDto): Promise<Book> {
    try {
      console.log('Creating book with data:', book);
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      const response = await axios.post<Book>(
        this.baseURL,
        book,
        { headers: getHeaders() }
      );
      console.log('Book created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating book:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      throw error;
    }
  }

  async updateBook(id: number, book: BookCreateDto | BookUpdateDto): Promise<Book> {
    try {
      console.log('Updating book:', id, book);
      const response = await axios.put<Book>(
        `${this.baseURL}/${id}`,
        book,
        { headers: getHeaders() }
      );
      console.log('Book updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating book:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteBook(id: number): Promise<void> {
    try {
      console.log('Deleting book:', id);
      await axios.delete(`${this.baseURL}/${id}`, {
        headers: getHeaders(),
      });
      console.log('Book deleted successfully');
    } catch (error: any) {
      console.error('Error deleting book:', error.response?.data || error.message);
      throw error;
    }
  }
}

export const bookService = new BookService();
export default bookService;