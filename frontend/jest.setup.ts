// Configuração comum dos testes: rotas do Expo Router e cabeçalho simulados.
// Os testes acessam o roteador e os parâmetros simulados por jest.requireMock('expo-router').

jest.mock('expo-router', () => {
  const React = require('react');
  const router = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  };
  const params = { current: {} as Record<string, string> };
  return {
    useRouter: () => router,
    useLocalSearchParams: () => params.current,
    useFocusEffect: (callback: () => void) => React.useEffect(callback, [callback]),
    Stack: { Screen: () => null },
    Redirect: () => null,
    __router: router,
    __params: params,
  };
});

// O cabeçalho consulta notificações e a sessão; nas telas testadas ele não interessa
jest.mock('@/components/reusable/Header', () => () => null);

// Os ícones dependem do carregamento de fontes nativas, indisponível nos testes
jest.mock('@expo/vector-icons', () => {
  const Icone = () => null;
  return new Proxy({}, { get: () => Icone });
});

afterEach(() => {
  jest.clearAllMocks();
});
