// Aplica as regras dos livros sem depender de React ou de armazenamento.
export const filters = [
  { value: 'all', label: 'Todos' },
  { value: 'to-read', label: 'Quero ler' },
  { value: 'read', label: 'Lidos' },
];

export function createBook({ title, author, coverId = null }, existingBooks = []) {
  const cleanTitle = title.trim();
  const cleanAuthor = author.trim();
  if (!cleanTitle || !cleanAuthor) throw new Error('Preencha o título e o autor.');
  if (cleanTitle.length > 100 || cleanAuthor.length > 80) {
    throw new Error('Use até 100 caracteres no título e 80 no autor.');
  }
  const duplicate = existingBooks.some((book) =>
    book.title.toLocaleLowerCase('pt-BR') === cleanTitle.toLocaleLowerCase('pt-BR') &&
    book.author.toLocaleLowerCase('pt-BR') === cleanAuthor.toLocaleLowerCase('pt-BR'));
  if (duplicate) throw new Error('Esse livro já está na sua estante.');
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: cleanTitle, author: cleanAuthor, status: 'to-read',
    coverId: Number.isSafeInteger(coverId) && coverId > 0 ? coverId : null,
  };
}
export function toggleBook(books, id) {
  return books.map((book) => book.id === id
    ? { ...book, status: book.status === 'read' ? 'to-read' : 'read' } : book);
}
export function filterBooks(books, status) {
  return status === 'all' ? books : books.filter((book) => book.status === status);
}
export function isBookList(value) {
  return Array.isArray(value) && value.every((book) => book &&
    typeof book.id === 'string' && typeof book.title === 'string' &&
    typeof book.author === 'string' && ['read', 'to-read'].includes(book.status));
}
