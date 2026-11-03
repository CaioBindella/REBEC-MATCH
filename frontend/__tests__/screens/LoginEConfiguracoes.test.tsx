import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import SettingsPage from '@/app/(protected)/settings/page';
import LoginCredentials from '@/components/reusable/LoginCredentials';
import { apiService } from '@/services/api/apiClient';
import { avisar, confirmar } from '@/utils/feedback';

const mockAuth = {
  user: { id: 10 },
  isLoading: false,
  logIn: jest.fn(),
  logOut: jest.fn(),
};

jest.mock('@/context/AuthContext', () => ({ useAuth: () => mockAuth }));

jest.mock('@/services/api/apiClient', () => ({
  apiService: { usuario: { delete: jest.fn() } },
  getErrorMessage: (erro: Error, padrao: string) => erro?.message || padrao,
}));

jest.mock('@/services/preferences', () => ({
  preferencias: { alertasAtivos: jest.fn(async () => true), definirAlertas: jest.fn() },
}));

jest.mock('@/utils/feedback', () => ({
  avisar: jest.fn((_titulo: string, _mensagem: string, aoFechar?: () => void) => aoFechar?.()),
  confirmar: jest.fn(),
}));

describe('login', () => {
  it('valida os campos obrigatórios antes de chamar a API', async () => {
    render(<LoginCredentials />);

    fireEvent.press(screen.getByText('Entrar'));

    expect(await screen.findByText('Informe o seu nome de usuário.')).toBeOnTheScreen();
    expect(screen.getByText('Informe a sua senha.')).toBeOnTheScreen();
    expect(mockAuth.logIn).not.toHaveBeenCalled();
  });

  it('envia as credenciais e mostra a mensagem de erro da API', async () => {
    mockAuth.logIn.mockRejectedValue(new Error('Login ou senha inválidos.'));
    render(<LoginCredentials />);

    fireEvent.changeText(screen.getByPlaceholderText('Nome de usuário'), ' voluntaria.teste ');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), 'senha123');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => expect(avisar).toHaveBeenCalledWith('Erro de login', 'Login ou senha inválidos.'));
    expect(mockAuth.logIn).toHaveBeenCalledWith({ login: 'voluntaria.teste', senha: 'senha123' });
  });
});

describe('configurações da conta', () => {
  it('só sai da conta depois da confirmação', async () => {
    jest.mocked(confirmar).mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    render(<SettingsPage />);

    fireEvent.press(screen.getByText('Sair da Conta'));
    await waitFor(() => expect(confirmar).toHaveBeenCalledTimes(1));
    expect(mockAuth.logOut).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText('Sair da Conta'));
    await waitFor(() => expect(mockAuth.logOut).toHaveBeenCalledTimes(1));
  });

  it('exclui a conta após a confirmação, avisa e encerra a sessão', async () => {
    jest.mocked(confirmar).mockResolvedValue(true);
    jest.mocked(apiService.usuario.delete).mockResolvedValue(undefined);
    render(<SettingsPage />);

    fireEvent.press(screen.getByText('Excluir minha conta e meus dados'));

    await waitFor(() => expect(mockAuth.logOut).toHaveBeenCalledTimes(1));
    expect(apiService.usuario.delete).toHaveBeenCalledWith(10);
    expect(avisar).toHaveBeenCalledWith('Conta excluída', expect.any(String), mockAuth.logOut);
  });

  it('mantém a sessão se a exclusão falhar', async () => {
    jest.mocked(confirmar).mockResolvedValue(true);
    jest.mocked(apiService.usuario.delete).mockRejectedValue(new Error('Erro no servidor.'));
    render(<SettingsPage />);

    fireEvent.press(screen.getByText('Excluir minha conta e meus dados'));

    await waitFor(() => expect(avisar).toHaveBeenCalledWith('Erro', 'Erro no servidor.'));
    expect(mockAuth.logOut).not.toHaveBeenCalled();
  });
});
