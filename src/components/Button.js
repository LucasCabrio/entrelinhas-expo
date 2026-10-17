// Renderiza um botão reutilizável com variante secundária e estado desabilitado.
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';
export default function Button({ title, onPress, disabled = false, secondary = false }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }}
    disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, secondary && styles.secondary,
      (pressed || disabled) && { opacity: 0.55 }]}>
    <Text style={[styles.label, secondary && { color: colors.ink }]}>{title}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({
  button: { backgroundColor: colors.ink, borderRadius: 10, padding: 16, minHeight: 50, alignItems: 'center' },
  secondary: { backgroundColor: colors.soft },
  label: { color: colors.paper, fontSize: 16, fontWeight: '600' },
});
