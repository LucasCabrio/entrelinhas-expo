// Verifica as regras de cadastro, filtros e integridade sem iniciar o aplicativo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createBook, toggleBook, filterBooks, isBookList } from '../src/services/bookService.js';

test('cadastro remove espaços e começa como quero ler', () => {
  const book = createBook({ title: '  Dom Casmurro ', author: ' Machado de Assis ' });
  assert.equal(book.title, 'Dom Casmurro');
  assert.equal(book.author, 'Machado de Assis');
  assert.equal(book.status, 'to-read');
  assert.ok(book.id);
});
test('campos vazios e textos muito longos são recusados', () => {
  assert.throws(() => createBook({ title: ' ', author: 'Autor' }), /Preencha/);
  assert.throws(() => createBook({ title: 'Livro', author: '' }), /Preencha/);
  assert.throws(() => createBook({ title: 'a'.repeat(101), author: 'Autor' }), /100/);
  assert.throws(() => createBook({ title: 'Livro', author: 'a'.repeat(81) }), /80/);
});
test('duplicados ignoram caixa e espaços, mas permitem outro autor', () => {
  const first = createBook({ title: 'Livro', author: 'Autor' });
  assert.throws(() => createBook({ title: ' LIVRO ', author: 'autor' }, [first]), /já está/);
  assert.doesNotThrow(() => createBook({ title: 'Livro', author: 'Outro autor' }, [first]));
});
test('alterar status não modifica os dados originais e permite desfazer', () => {
  const original = [createBook({ title: 'Livro', author: 'Autor' })];
  const updated = toggleBook(original, original[0].id);
  assert.equal(original[0].status, 'to-read');
  assert.equal(updated[0].status, 'read');
  assert.equal(toggleBook(updated, original[0].id)[0].status, 'to-read');
  assert.equal(filterBooks(updated, 'read').length, 1);
  assert.equal(filterBooks(updated, 'to-read').length, 0);
  assert.equal(filterBooks(updated, 'all').length, 1);
});
test('dados inválidos no armazenamento não são aceitos', () => {
  assert.equal(isBookList([]), true);
  assert.equal(isBookList(null), false);
  assert.equal(isBookList([null]), false);
  assert.equal(isBookList([{ id: '1', title: 'Livro', author: 'Autor', status: 'erro' }]), false);
});
test('capa persiste ao marcar leitura e livros antigos continuam válidos', () => {
  const book = createBook({ title: 'Livro', author: 'Autor', coverId: 12345 });
  const saved = JSON.parse(JSON.stringify([book]));
  assert.equal(toggleBook(saved, book.id)[0].coverId, 12345);
  assert.equal(isBookList(saved), true);
  assert.equal(isBookList([{ id: 'antigo', title: 'Livro', author: 'Autor', status: 'read' }]), true);
  assert.equal(createBook({ title: 'Livro', author: 'Autor', coverId: -1 }).coverId, null);
});
