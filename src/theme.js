// Centraliza as cores e a tipografia da aplicação.
import { Platform } from 'react-native';
export const colors = {
  background: '#F6F3EB', paper: '#FFFDFA', ink: '#273B34', muted: '#68716A',
  line: '#DEDCD2', accent: '#A64429', soft: '#E8EDDF', danger: '#A33226',
};
export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });
