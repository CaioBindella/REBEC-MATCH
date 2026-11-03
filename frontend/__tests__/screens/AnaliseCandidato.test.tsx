import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import VolunteerDetailsScreen from '@/app/(protected)/researcher/volunteer-details/[id]';
import { apiService } from '@/services/api/apiClient';
import { avisar, confirmar } from '@/utils/feedback';

jest.mock('@/services/api/apiClient', () => ({
  apiService: {
    resposta: { getByVoluntario: jest.fn() },
    candidatura: { analisePesquisador: jest.fn() },
  },
  getErrorMessage: (_erro: unknown, padrao: string) => padrao,
}));

// avisar chama o callback imediatamente, como se o usuário tivesse tocado em OK
jest.mock('@/utils/feedback', () => ({
  avisar: jest.fn((_titulo: string, _mensagem: string, aoFechar?: () => void) => aoFechar?.()),
  confirmar: jest.fn(),
}));

const { __router: router, __params: params } = jest.requireMock('expo-router');

const abrirTela = async () => {
  params.current = {
    id: '7',
    voluntarioId: '3',
    nomeFicticio: 'VOL3RJ',
    idade: '38',
    sexo: 'MASCULINO',
    uf: 'RJ',
  };
  jest.mocked(apiService.resposta.getByVoluntario).mockResolvedValue([
    {
      id: 1,
      voluntarioId: 3,
      questaoId: 1,
      questaoTexto: 'Data de nascimento',
      conteudo: '22/09/1988',
      marcado: false,
    },
  ] as never);
  render(<VolunteerDetailsScreen />);
  await screen.findByText('22/09/1988');
};

describe('análise de candidato pelo pesquisador', () => {
  // Temporizadores simulados para que a animação de opacidade dos botões termine dentro do teste
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  it('exibe o candidato pelo nome fictício e as respostas do formulário', async () => {
    await abrirTela();

    expect(screen.getByText('VOL3RJ')).toBeOnTheScreen();
    expect(screen.getByText('Data de nascimento')).toBeOnTheScreen();
    expect(apiService.resposta.getByVoluntario).toHaveBeenCalledWith(3);
  });

  it('ao aprovar, avisa o pesquisador e volta para a lista de candidatos', async () => {
    jest.mocked(apiService.candidatura.analisePesquisador).mockResolvedValue({} as never);
    await abrirTela();

    fireEvent.press(screen.getByText('Aprovar'));

    await waitFor(() => expect(router.back).toHaveBeenCalledTimes(1));
    expect(apiService.candidatura.analisePesquisador).toHaveBeenCalledWith(7, true);
    expect(avisar).toHaveBeenCalledWith('Candidato aprovado', expect.any(String), expect.any(Function));
    expect(confirmar).not.toHaveBeenCalled();
  });

  it('sem histórico de navegação, vai direto para a lista de candidatos', async () => {
    router.canGoBack.mockReturnValueOnce(false);
    jest.mocked(apiService.candidatura.analisePesquisador).mockResolvedValue({} as never);
    await abrirTela();

    fireEvent.press(screen.getByText('Aprovar'));

    await waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith('/(protected)/researcher/manage-candidates/page')
    );
  });

  it('pede confirmação antes de recusar e não faz nada se o pesquisador desistir', async () => {
    jest.mocked(confirmar).mockResolvedValue(false);
    await abrirTela();

    fireEvent.press(screen.getByText('Recusar'));

    await waitFor(() => expect(confirmar).toHaveBeenCalledTimes(1));
    expect(apiService.candidatura.analisePesquisador).not.toHaveBeenCalled();
    expect(router.back).not.toHaveBeenCalled();
  });

  it('recusa a candidatura quando o pesquisador confirma', async () => {
    jest.mocked(confirmar).mockResolvedValue(true);
    jest.mocked(apiService.candidatura.analisePesquisador).mockResolvedValue({} as never);
    await abrirTela();

    fireEvent.press(screen.getByText('Recusar'));

    await waitFor(() => expect(apiService.candidatura.analisePesquisador).toHaveBeenCalledWith(7, false));
    expect(avisar).toHaveBeenCalledWith('Candidatura recusada', expect.any(String), expect.any(Function));
  });

  it('em caso de erro, mostra a mensagem e permanece na tela', async () => {
    jest.mocked(apiService.candidatura.analisePesquisador).mockRejectedValue(new Error('falha'));
    await abrirTela();

    fireEvent.press(screen.getByText('Aprovar'));

    await waitFor(() => expect(avisar).toHaveBeenCalledWith('Erro', 'Falha ao processar a análise.'));
    expect(router.back).not.toHaveBeenCalled();
    expect(screen.getByText('Aprovar')).toBeOnTheScreen();
  });
});
