// Reúne rótulo e campo de texto usados no cadastro de livros.
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';
export default function Field({ label, ...props }) {
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput accessibilityLabel={label} placeholderTextColor={colors.muted}
      style={styles.input} {...props} />
  </View>;
}
const styles = StyleSheet.create({
  field: { marginBottom: 22 }, label: { color: colors.ink, fontSize: 14, fontWeight: '600', marginBottom: 9 },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper, borderRadius: 8, padding: 15, fontSize: 16, color: colors.ink, minHeight: 54 },
});
