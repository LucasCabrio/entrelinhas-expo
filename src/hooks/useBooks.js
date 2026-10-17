// Coordena estado, regras e persistência, entregando ações prontas às telas.
import { useEffect, useRef, useState } from 'react';
import * as repository from '../repositories/bookRepository';
import { createBook, toggleBook } from '../services/bookService';
export default function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  async function reload() {
    setLoading(true);
    setError('');
    try { setBooks(await repository.loadBooks()); }
    catch { setError('Não foi possível abrir sua estante. Tente novamente.'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    let active = true;
    repository.loadBooks()
      .then((saved) => { if (active) setBooks(saved); })
      .catch(() => { if (active) setError('Não foi possível abrir sua estante. Tente novamente.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function persist(nextBooks) {
    if (busy.current) throw new Error('Aguarde a alteração atual terminar.');
    busy.current = true;
    setSaving(true);
    try {
      await repository.saveBooks(nextBooks);
      setBooks(nextBooks);
    } catch {
      throw new Error('Não foi possível salvar. Tente novamente.');
    } finally { busy.current = false; setSaving(false); }
  }
  return {
    books, loading, saving, error, reload,
    addBook: (form) => persist([createBook(form, books), ...books]),
    toggleBook: (id) => persist(toggleBook(books, id)),
    removeBook: (id) => persist(books.filter((book) => book.id !== id)),
  };
}
