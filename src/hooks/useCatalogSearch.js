// Aguarda a digitação e cancela buscas antigas para evitar sugestões desatualizadas.
import { useEffect, useState } from 'react';
import { searchCatalog } from '../services/catalogService';

export default function useCatalogSearch(query, kind, enabled) {
  const [state, setState] = useState({ items: [], loading: false, message: '' });
  useEffect(() => {
    if (!enabled || query.trim().length < 3) {
      setState({ items: [], loading: false, message: '' });
      return;
    }
    let active = true;
    const controller = new AbortController();
    let timeout;
    setState({ items: [], loading: true, message: '' });
    // Uma pausa de 1,2s reduz as consultas e respeita o limite público do catálogo.
    const debounce = setTimeout(async () => {
      timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const items = await searchCatalog(query, kind, controller.signal);
        if (active) setState({ items, loading: false,
          message: items.length ? '' : 'Nenhuma sugestão. Você pode preencher manualmente.' });
      } catch {
        if (active) setState({ items: [], loading: false,
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
  return state;
}
