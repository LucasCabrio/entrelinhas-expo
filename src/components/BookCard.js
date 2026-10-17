// Mostra um livro e permite marcar a leitura ou solicitar sua remoção.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, serif } from '../theme';
import BookCover from './BookCover';
export default function BookCard({ book, disabled, onToggle, onRemove }) {
  const read = book.status === 'read';
  return <View style={styles.card}>
    <View style={styles.content}>
      <View style={styles.details}>
        <BookCover coverId={book.coverId} title={book.title} />
        <View style={{ flex: 1 }}><Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text></View>
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel={`${read ? 'Marcar como não lido' : 'Marcar como lido'}: ${book.title}`}
          disabled={disabled} onPress={onToggle} style={styles.status}>
          <Text style={styles.statusText}>{read ? '✓  Lido' : '○  Quero ler'}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Remover ${book.title}`}
          disabled={disabled} onPress={onRemove} style={styles.remove}>
          <Text style={styles.removeText}>Remover</Text>
        </Pressable>
      </View>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  card: { borderBottomWidth: 1, borderColor: colors.line, marginBottom: 8 },
  content: { paddingVertical: 16 },
  details: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  title: { fontFamily: serif, fontSize: 24, color: colors.ink },
  author: { fontSize: 14, color: colors.muted, marginTop: 5 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginTop: 12 },
  status: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, backgroundColor: colors.soft, borderRadius: 6 },
  statusText: { fontSize: 13, color: colors.ink, fontWeight: '600' },
  remove: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  removeText: { color: colors.muted, fontSize: 13, textDecorationLine: 'underline' },
});
