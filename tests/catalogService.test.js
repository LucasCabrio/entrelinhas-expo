// Verifica a adaptação das respostas e os erros do catálogo usando respostas simuladas.
import test from 'node:test';
import assert from 'node:assert/strict';
import { searchCatalog } from '../src/services/catalogService.js';
test('busca de livros codifica consulta e preenche autor', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.ok(url.includes('title=Dom%20Casmurro'));
    return { ok: true, json: async () => ({ docs: [
      { key: '/works/1', title: 'Dom Casmurro', author_name: ['Machado de Assis'], cover_i: 12345 },
      { key: '/works/2', title: 'Sem autor' },
    ] }) };
  });
  const books = await searchCatalog('Dom Casmurro', 'title');
  assert.equal(books[0].author, 'Machado de Assis');
  assert.equal(books[1].author, '');
  assert.equal(books[0].coverId, 12345);
  assert.equal(books[1].coverId, null);
});
test('busca de autores usa endpoint próprio', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.ok(url.includes('/search/authors.json?q=Machado'));
    return { ok: true, json: async () => ({ docs: [{ key: 'OL1A', name: 'Machado de Assis' }] }) };
  });
  assert.equal((await searchCatalog('Machado', 'author'))[0].title, 'Machado de Assis');
});
test('resposta de erro é propagada para permitir cadastro manual', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 429 }));
  await assert.rejects(searchCatalog('Livro', 'title'), /manualmente/);
});
