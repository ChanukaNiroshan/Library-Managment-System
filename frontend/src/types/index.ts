// src/types/index.ts

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  isbn?: string;
  publicationYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookCreateDto {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  publicationYear?: number;
}

export interface BookUpdateDto {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  publicationYear?: number;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  createdAt: string;
  isActive: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}