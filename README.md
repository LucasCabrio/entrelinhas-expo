# Entrelinhas

Um caderno de leituras feito com **React Native, JavaScript e Expo Go**. Projeto pequeno para discutir aplicação em camadas em sala de aula.

## O que faz

- Cadastra livros com título e autor.
- Sugere livros e autores da Open Library durante a digitação; selecionar um livro preenche os dois campos.
- Exibe capas nas sugestões, no cadastro e na estante. Imagens indisponíveis usam uma alternativa simples.
- Permite marcar e desmarcar livros como lidos, filtrar a estante e remover com confirmação.
- O cartão informa o status atual separadamente. Use “Marcar como lido” ou “Mover para Quero ler” para mudar o status; as abas no topo apenas filtram a lista.
- Salva a estante no aparelho com AsyncStorage. Sem conta ou backend próprio.
- Funciona sem internet para cadastro manual e gerenciamento; só as sugestões precisam de conexão.

## Executar no Expo Go

Requisitos: Node.js 22.13 ou superior, npm e Expo Go compatível com **SDK 57**.

```bash
npm ci
npm start
```

Abra o Expo Go e escaneie o QR code. Computador e celular devem estar na mesma rede. No iPhone, use a câmera para abrir o QR code. Se houver aviso de versão incompatível, confira a versão do Expo Go em https://expo.dev/go.

O servidor de desenvolvimento usa a porta **8081**. Se estiver ocupada, encerre o processo que você iniciou nessa porta antes de executar novamente; não aceite outra porta se quiser manter esse padrão.

```bash
npm run web      # prévia no navegador, porta 8081
npm run android  # abre em emulador/dispositivo Android configurado
npm test         # testes das regras e adaptação do catálogo
npm run check    # compatibilidade das dependências com o Expo
```

## Organização em camadas

```text
App.js                       Provedores e entrada das rotas
index.js                     Registro do app no Expo
src/
  navigation/AppNavigator.js Duas rotas: estante e cadastro
  screens/                   Composição das telas
  components/                Botão, campo, filtros, livro e sugestões
  hooks/                     Estado e coordenação das operações
  services/                  Regras dos livros e consulta ao catálogo
  repositories/              Persistência local
  theme.js                   Cores e tipografia
tests/                       Testes com o runner nativo do Node
```

Fluxo de cadastro:

```text
AddBookScreen → useBooks → bookService (valida)
                        → bookRepository (salva)
                        → atualiza o estado → LibraryScreen
```

Fluxo das sugestões:

```text
Campo → useCatalogSearch → catalogService → Open Library
                         → Suggestions → preenche o formulário
```

A tela não acessa AsyncStorage e o repositório não renderiza interface. As regras não importam React. Os arquivos JavaScript essenciais começam com uma linha explicando sua responsabilidade. JSON não aceita comentários; `package.json` declara scripts e dependências, e `app.json` configura o Expo.

São só duas telas: a navegação usa estado local e trata o botão voltar do Android. Não há histórico de URLs ou deep links. Em um app maior, essa camada pode ser substituída por React Navigation ou Expo Router.

## Autocomplete e CORS

As buscas começam após 3 caracteres e 1,2 segundo sem digitar. Consultas antigas são canceladas, há timeout de 8 segundos e até 5 sugestões por consulta. Erros e falta de resultados não bloqueiam o cadastro manual. O catálogo pode trazer nomes em outros idiomas ou dados incompletos: confira antes de salvar.

Usamos os endpoints públicos `https://openlibrary.org/search.json` e `https://openlibrary.org/search/authors.json`, sem chave de API. O texto digitado é enviado ao catálogo apenas para buscar sugestões; sua estante fica local.

No React Native nativo, CORS não é aplicado como no navegador. Na prévia web, a política CORS é definida pela Open Library, não pelo aplicativo. Este projeto não abre um servidor de API nem configura `origin: '*'`. A porta local do Expo é 8081. Se um backend for adicionado, configure nele uma origem exata, como `http://localhost:8081`, em vez de liberar todas as origens.

## Para apresentar em sala

1. Abra `App.js` e siga até `AppNavigator.js` para localizar as telas.
2. Digite “Dom Casmurro”, escolha uma sugestão e salve.
3. Mostre a validação de livro duplicado e de campos vazios.
4. Marque o livro como lido, filtre e reabra o aplicativo para mostrar persistência.
5. Siga o fluxo da tela até o repositório. Discuta onde entraria uma API própria.
6. Desligue a internet e cadastre outro livro manualmente.

## Limites do exemplo

As capas usam a [API de capas da Open Library](https://openlibrary.org/dev/docs/api/covers). Salvamos apenas `coverId`, sem baixar arquivos: a exibição depende da rede/cache do aparelho. Livros antigos continuam funcionando sem capa. Alterar título ou autor manualmente remove a capa selecionada para evitar associar uma imagem ao livro errado. A capa do catálogo pode corresponder a outra edição.

Sem sincronização, login, edição de título ou backup. Limpar os dados do Expo Go/navegador pode apagar a estante. O armazenamento não é criptografado e não deve guardar dados sensíveis. Em falha de gravação, a tela mantém os dados anteriores; em falha de leitura, novas gravações ficam bloqueadas para não sobrescrever a estante.

## Verificação realizada

Nove testes automatizados passaram, as dependências foram conferidas com `expo install --check` e os bundles Android, iOS e web foram exportados com `npx expo export --platform all`. Cadastro, autocomplete real, filtros e persistência também foram conferidos na prévia web. A execução em um celular físico com Expo Go ainda precisa ser conferida no aparelho.

O `npm audit` apontou 22 alertas na árvore de dependências do SDK (7 moderados e 15 altos). As sugestões automáticas incluem trocar Expo/React Native por versões antigas incompatíveis; não foi aplicado `--force`. Esse resultado não significa que o aplicativo passou por uma auditoria de segurança.

## Referências

- [Documentação do Expo](https://docs.expo.dev/)
- [API de busca da Open Library](https://openlibrary.org/dev/docs/api/search)
- [Política de uso da Open Library](https://openlibrary.org/developers/api)
