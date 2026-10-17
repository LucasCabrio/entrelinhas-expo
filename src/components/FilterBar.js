// Exibe os filtros da estante e informa qual está selecionado.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { filters } from '../services/bookService';
import { colors } from '../theme';
export default function FilterBar({ value, onChange }) {
  return <View style={styles.row}>{filters.map((filter) => (
    <Pressable key={filter.value} accessibilityRole="button"
      accessibilityState={{ selected: filter.value === value }}
      onPress={() => onChange(filter.value)}
      style={[styles.item, filter.value === value && styles.selected]}>
      <Text style={[styles.text, filter.value === value && styles.active]}>{filter.label}</Text>
    </Pressable>
  ))}</View>;
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginVertical: 20, flexWrap: 'wrap' },
  item: { paddingHorizontal: 12, minHeight: 44, justifyContent: 'center', borderBottomWidth: 2, borderColor: 'transparent' },
  selected: { borderColor: colors.ink },
  text: { color: colors.muted, fontSize: 14 }, active: { color: colors.ink, fontWeight: '600' },
});
