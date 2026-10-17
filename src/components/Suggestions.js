// Mostra sugestões do catálogo logo abaixo do campo que está sendo preenchido.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
export default function Suggestions({ search, onSelect }) {
  if (!search.loading && !search.message && !search.items.length) return null;
  return <View style={styles.container}>
    {search.loading && <Text accessibilityLiveRegion="polite" style={styles.note}>Buscando sugestões…</Text>}
    {!!search.message && <Text accessibilityLiveRegion="polite" style={styles.note}>{search.message}</Text>}
    {search.items.map((item) => <Pressable key={item.id} accessibilityRole="button"
      accessibilityLabel={`Selecionar ${item.title}${item.author ? `, ${item.author}` : ''}`}
      onPress={() => onSelect(item)} style={({ pressed }) => [styles.item, pressed && { backgroundColor: colors.soft }]}>
      <Text style={styles.title}>{item.title}</Text>
      {!!item.author && <Text style={styles.note}>{item.author}</Text>}
    </Pressable>)}
  </View>;
}
const styles = StyleSheet.create({
  container: { marginTop: -12, marginBottom: 22, borderLeftWidth: 2, borderColor: colors.line, paddingLeft: 12 },
  item: { paddingVertical: 12, minHeight: 48, borderBottomWidth: 1, borderColor: colors.line },
  title: { color: colors.ink, fontSize: 15, lineHeight: 22 }, note: { color: colors.muted, fontSize: 12, lineHeight: 20 },
});
