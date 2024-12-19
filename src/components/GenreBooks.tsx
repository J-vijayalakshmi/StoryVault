// src/components/GenreBooks.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Book {
  id: number;
  title: string;
}

const GenreBooks: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      // Fetch books based on genreId
      // Replace with actual API call
      const data: Book[] = [
        { id: 1, title: 'Book 1' },
        { id: 2, title: 'Book 2' },
        // Add more books as needed
      ];
      setBooks(data);
    };

    fetchBooks();
  }, [genreId]);

  return (
    <div>
      <h1>Books in Genre {genreId}</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default GenreBooks;
