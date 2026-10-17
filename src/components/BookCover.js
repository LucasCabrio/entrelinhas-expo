// Exibe a capa da Open Library ou uma alternativa quando a imagem não existe ou falha.
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function BookCover({ coverId, title, small = false }) {
  const [failedId, setFailedId] = useState(null);
  const available = Number.isSafeInteger(coverId) && coverId > 0 && failedId !== coverId;
  const size = small ? { width: 42, height: 62 } : { width: 76, height: 112 };
  return <View style={[styles.cover, size]}>
    {available ? <Image key={coverId} accessibilityLabel={`Capa de ${title}`}
      source={{ uri: `https://covers.openlibrary.org/b/id/${coverId}-M.jpg?default=false` }}
      style={styles.image} resizeMode="contain" onError={() => setFailedId(coverId)} />
      : <Text style={styles.placeholder}>{'Sem\ncapa'}</Text>}
  </View>;
}
const styles = StyleSheet.create({
  cover: { backgroundColor: colors.soft, borderRadius: 3, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  placeholder: { fontSize: 10, lineHeight: 15, textAlign: 'center', color: colors.muted },
});
