// Controla as duas rotas e trata o botão voltar do Android sem biblioteca extra.
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import useBooks from '../hooks/useBooks';
import LibraryScreen from '../screens/LibraryScreen';
import AddBookScreen from '../screens/AddBookScreen';
export default function AppNavigator() {
  const [route, setRoute] = useState('library');
  const library = useBooks();
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (route !== 'add') return false;
      if (!library.saving) setRoute('library');
      return true;
    });
    return () => subscription.remove();
  }, [route, library.saving]);
  if (route === 'add') return <AddBookScreen onSave={library.addBook}
    saving={library.saving} onBack={() => setRoute('library')} />;
  return <LibraryScreen library={library} onAdd={() => setRoute('add')} />;
}
