// Apresenta a estante, seus filtros e os estados de carregamento e erro.
import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookCard from '../components/BookCard';
import Button from '../components/Button';
import FilterBar from '../components/FilterBar';
import { filterBooks } from '../services/bookService';
import { colors, serif } from '../theme';

export default function LibraryScreen({ library, onAdd }) {
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [removing, setRemoving] = useState(null);
  const { books, loading, error, saving } = library;
  const readCount = books.filter((book) => book.status === 'read').length;
  async function change(action) {
    setMessage('');
    try { await action(); return true; }
    catch (failure) { setMessage(failure.message); return false; }
  }
  return <SafeAreaView style={styles.safe}>
    <View style={styles.page}>
      <FlatList data={loading || error ? [] : filterBooks(books, filter)} keyExtractor={(book) => book.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<>
          <Text style={styles.brand}>Entrelinhas</Text>
          <Text style={styles.subtitle}>Caderno de leituras</Text>
          <View style={styles.summary}>
            <Text style={styles.summaryNumber}>{loading ? '—' : readCount}</Text>
            <View style={{ flex: 1 }}><Text style={styles.summaryTitle}>livros lidos</Text>
              <Text style={styles.subtitle}>de {books.length} na estante</Text></View>
          </View>
          <Text style={styles.heading}>Minha estante</Text>
          <FilterBar value={filter} onChange={setFilter} />
          {!!message && <Text accessibilityRole="alert" style={styles.error}>{message}</Text>}
        </>}
        renderItem={({ item }) => <BookCard book={item} disabled={saving}
          onToggle={() => change(() => library.toggleBook(item.id))} onRemove={() => { setMessage(''); setRemoving(item); }} />}
        ListEmptyComponent={loading ? <ActivityIndicator color={colors.ink} style={{ margin: 40 }} /> : error ?
          <View style={styles.empty}><Text style={styles.error}>{error}</Text><Button title="Tentar novamente" onPress={library.reload} /></View> :
          <View style={styles.empty}>
            <Text style={styles.heading}>{books.length ? 'Nenhum livro neste filtro.' : 'Sua estante está vazia.'}</Text>
            <Text style={styles.emptyText}>{books.length ? 'Troque o filtro ou marque um livro como lido.' : 'Use o botão abaixo para adicionar seu primeiro livro.'}</Text></View>}
      />
      <View style={styles.footer}><Button title="+  Adicionar livro" onPress={onAdd} disabled={loading || !!error || saving} />
        <Text style={styles.footnote}>Sua estante fica salva neste aparelho.</Text></View>
    </View>
    <Modal visible={!!removing} transparent animationType="fade" onRequestClose={() => !saving && setRemoving(null)}>
      <View style={styles.overlay}><View style={styles.dialog}>
        <Text style={styles.heading}>Retirar da estante?</Text>
        <Text style={styles.emptyText}>“{removing?.title}” será removido. Você poderá cadastrá-lo novamente.</Text>
        {!!message && <Text accessibilityRole="alert" style={styles.error}>{message}</Text>}
        <Button title={saving ? 'Removendo…' : 'Remover livro'} disabled={saving} onPress={async () => {
          if (await change(() => library.removeBook(removing.id))) setRemoving(null);
        }} />
        <Button title="Manter na estante" secondary disabled={saving} onPress={() => setRemoving(null)} />
      </View></View>
    </Modal>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, page: { flex: 1, width: '100%', maxWidth: 600, alignSelf: 'center' },
  list: { padding: 24, paddingBottom: 12 },
  brand: { fontFamily: serif, fontSize: 36, color: colors.ink, marginTop: 8 }, subtitle: { fontSize: 13, color: colors.muted, lineHeight: 21 },
  summary: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 20, marginVertical: 28, flexDirection: 'row', gap: 16, alignItems: 'center' },
  summaryNumber: { fontFamily: serif, fontSize: 32, color: colors.ink }, summaryTitle: { fontSize: 16, fontWeight: '600', color: colors.ink },
  heading: { fontFamily: serif, fontSize: 24, color: colors.ink },
  empty: { paddingVertical: 24, gap: 14 },
  emptyText: { color: colors.muted, fontSize: 15, lineHeight: 24, marginVertical: 12 },
  footer: { padding: 20, borderTopWidth: 1, borderColor: colors.line }, footnote: { textAlign: 'center', fontSize: 11, color: colors.muted, marginTop: 12 },
  error: { color: colors.danger, lineHeight: 22, marginBottom: 12 },
  overlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'center', alignItems: 'center', padding: 24 },
  dialog: { backgroundColor: colors.paper, borderRadius: 12, padding: 24, gap: 12, width: '100%', maxWidth: 420 },
});
