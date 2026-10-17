// Consulta livros e autores na Open Library e adapta a resposta para o formulário.
const BASE_URL = 'https://openlibrary.org';

export async function searchCatalog(query, kind, signal) {
  const term = encodeURIComponent(query.trim());
  const path = kind === 'author'
    ? `/search/authors.json?q=${term}&limit=5`
    : `/search.json?title=${term}&fields=key,title,author_name,cover_i&limit=5&lang=pt`;
  const response = await fetch(`${BASE_URL}${path}`, { signal });
  if (!response.ok) throw new Error('Catálogo indisponível. Preencha manualmente.');
  const data = await response.json();
  return (data.docs || []).filter((item) => item.key && (kind === 'author' ? item.name : item.title))
    .map((item) => ({
      id: item.key,
      title: kind === 'author' ? item.name : item.title,
      author: kind === 'author' ? '' : (item.author_name || []).join(', '),
      coverId: kind !== 'author' && Number.isSafeInteger(item.cover_i) && item.cover_i > 0 ? item.cover_i : null,
    }));
}
