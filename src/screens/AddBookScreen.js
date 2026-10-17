// Captura título e autor e apresenta as mensagens da regra de cadastro.
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Field from '../components/Field';
import Suggestions from '../components/Suggestions';
import BookCover from '../components/BookCover';
import useCatalogSearch from '../hooks/useCatalogSearch';
import { colors, serif } from '../theme';
export default function AddBookScreen({ onSave, onBack, saving }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverId, setCoverId] = useState(null);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState(null);
  const titleSearch = useCatalogSearch(title, 'title', activeField === 'title' && !saving);
  const authorSearch = useCatalogSearch(author, 'author', activeField === 'author' && !saving);
  async function submit() {
    setError('');
    try { await onSave({ title, author, coverId }); onBack(); }
    catch (failure) { setError(failure.message); }
  }
  return <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
        <Button title="←  Voltar à estante" secondary onPress={onBack} disabled={saving} />
        <Text style={styles.title}>Adicionar livro</Text>
        <Text style={styles.description}>Busque no catálogo ou preencha por conta própria.</Text>
        <View style={{ marginTop: 32 }}>
          <Field label="Título do livro" placeholder="Ex.: Dom Casmurro" value={title}
            onFocus={() => setActiveField('title')} onChangeText={(value) => { setTitle(value); setCoverId(null); setActiveField('title'); }}
            maxLength={100} editable={!saving} autoCapitalize="sentences" />
          {activeField === 'title' && <Suggestions search={titleSearch} showCovers onSelect={(item) => {
            setTitle(item.title); setAuthor(item.author); setCoverId(item.coverId); setActiveField(null);
          }} />}
          <Field label="Autor ou autora" placeholder="Ex.: Machado de Assis" value={author}
            onFocus={() => setActiveField('author')} onChangeText={(value) => { setAuthor(value); setCoverId(null); setActiveField('author'); }}
            maxLength={80} editable={!saving} autoCapitalize="words" />
          {activeField === 'author' && <Suggestions search={authorSearch} onSelect={(item) => {
            setAuthor(item.title); setCoverId(null); setActiveField(null);
          }} />}
          {!!coverId && <View style={styles.coverPreview}>
            <BookCover coverId={coverId} title={title} />
            <Text style={[styles.note, { flex: 1, marginTop: 0 }]}>Capa do catálogo. A edição pode ser diferente da sua.</Text>
          </View>}
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Button title={saving ? 'Salvando…' : 'Guardar na estante'} onPress={submit} disabled={saving} />
          <Text style={styles.note}>Sugestões da Open Library a partir de 3 letras. Confira os dados antes de salvar.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, page: { padding: 24, width: '100%', maxWidth: 600, alignSelf: 'center' },
  title: { fontFamily: serif, fontSize: 32, color: colors.ink, marginTop: 32 },
  description: { color: colors.muted, fontSize: 15, lineHeight: 24, marginTop: 10 },
  error: { color: colors.danger, marginBottom: 16, lineHeight: 22 },
  coverPreview: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 20, marginTop: 18 },
});
