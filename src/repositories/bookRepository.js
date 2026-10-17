// Lê e grava a estante; somente esta camada conhece o AsyncStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isBookList } from '../services/bookService';
const STORAGE_KEY = '@entrelinhas/books:v1';
export async function loadBooks() {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved === null) return [];
  const books = JSON.parse(saved);
  if (!isBookList(books)) throw new Error('Dados da estante inválidos.');
  return books;
}
export async function saveBooks(books) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}
