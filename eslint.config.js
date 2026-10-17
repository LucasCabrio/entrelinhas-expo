// Usa as regras recomendadas do Expo para revisar os arquivos JavaScript.
import expo from 'eslint-config-expo/flat.js';
export default [...expo, { ignores: ['dist/**'] }];
