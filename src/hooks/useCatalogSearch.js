// Aguarda a digitação e cancela buscas antigas para evitar sugestões desatualizadas.
import { useEffect, useState } from 'react';
import { searchCatalog } from '../services/catalogService';

export default function useCatalogSearch(query, kind, enabled) {
  const [state, setState] = useState({ query: '', kind: '', items: [], loading: false, message: '' });
  useEffect(() => {
    if (!enabled || query.trim().length < 3) {
      return;
    }
    let active = true;
    const controller = new AbortController();
    let timeout;
    // Uma pausa de 1,2s reduz as consultas e respeita o limite público do catálogo.
    const debounce = setTimeout(async () => {
      timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const items = await searchCatalog(query, kind, controller.signal);
        if (active) setState({ query, kind, items, loading: false,
          message: items.length ? '' : 'Nenhuma sugestão. Você pode preencher manualmente.' });
      } catch {
        if (active) setState({ query, kind, items: [], loading: false,
          message: 'Busca indisponível. Você pode preencher manualmente.' });
      } finally { clearTimeout(timeout); }
    }, 1200);
    return () => {
      active = false;
      clearTimeout(debounce);
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, kind, enabled]);
  if (!enabled || query.trim().length < 3) return { items: [], loading: false, message: '' };
  if (state.query !== query || state.kind !== kind) return { items: [], loading: true, message: '' };
  return state;
}
