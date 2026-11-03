import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import StudyDetailScreen from '@/app/(protected)/volunteer/available-research/[id]';
import { apiService } from '@/services/api/apiClient';
import { avisar, confirmar } from '@/utils/feedback';

jest.mock('@/services/api/apiClient', () => ({
  apiService: {
    estudo: { getById: jest.fn() },
    candidatura: { listarPorVoluntario: jest.fn(), criar: jest.fn() },
  },
  getErrorMessage: (_erro: unknown, padrao: string) => padrao,
}));

jest.mock('@/utils/feedback', () => ({
  avisar: jest.fn((_titulo: string, _mensagem: string, aoFechar?: () => void) => aoFechar?.()),
  confirmar: jest.fn(),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 10, perfilId: 5 } }),
}));

const { __router: router, __params: params } = jest.requireMock('expo-router');

const estudo = {
  id: 42,
  publicTitle: 'Caminhada para hipertensos',
  scientificTitle: 'Ensaio clínico randomizado sobre caminhada',
  recruitmentStatus: 'Recruiting',
  trialId: 'RBR-abc123',
  dateRegistration: '2026-08-01',
  approvalDate: null,
  primarySponsor: 'UERJ',
  hcFreetext: 'Hipertensão',
  iFreetext: 'Caminhada',
  pesquisador: { id: 1, nomeFicticio: 'PS1RJ' },
  criterios: [
    {
      id: 1,
      agemin: '18Y',
      agemax: '65Y',
      gender: 'AMBOS',
      inclusion_criteria: 'Adultos',
      exclusion_criteria: '',
    },
  ],
};

const abrirTela = async (candidaturas: unknown[] = []) => {
  params.current = { id: '42' };
  jest.mocked(apiService.estudo.getById).mockResolvedValue(estudo as never);
  jest.mocked(apiService.candidatura.listarPorVoluntario).mockResolvedValue(candidaturas as never);
  render(<StudyDetailScreen />);
  await screen.findByText('Caminhada para hipertensos');
};

describe('candidatura do voluntário a um estudo', () => {
  it('exibe os dados do estudo e o botão de candidatura', async () => {
    await abrirTela();

    expect(screen.getByText('RBR-abc123')).toBeOnTheScreen();
    expect(screen.getByText('Candidatar-se para o Estudo')).toBeOnTheScreen();
  });

  it('após confirmar, envia a candidatura, avisa e volta para a lista de estudos', async () => {
    jest.mocked(confirmar).mockResolvedValue(true);
    jest
      .mocked(apiService.candidatura.criar)
      .mockResolvedValue({ id: 1, estudoId: 42, status: 'PENDENTE' } as never);
    await abrirTela();

    fireEvent.press(screen.getByText('Candidatar-se para o Estudo'));

    await waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith('/(protected)/volunteer/available-research/page')
    );
    expect(apiService.candidatura.criar).toHaveBeenCalledWith({ estudoId: 42 });
    expect(avisar).toHaveBeenCalledWith('Candidatura enviada', expect.any(String), expect.any(Function));
  });

  it('não envia nada se o voluntário cancelar a confirmação', async () => {
    jest.mocked(confirmar).mockResolvedValue(false);
    await abrirTela();

    fireEvent.press(screen.getByText('Candidatar-se para o Estudo'));

    await waitFor(() => expect(confirmar).toHaveBeenCalledTimes(1));
    expect(apiService.candidatura.criar).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('mostra o erro da API e permanece na tela', async () => {
    jest.mocked(confirmar).mockResolvedValue(true);
    jest.mocked(apiService.candidatura.criar).mockRejectedValue(new Error('conflito'));
    await abrirTela();

    fireEvent.press(screen.getByText('Candidatar-se para o Estudo'));

    await waitFor(() =>
      expect(avisar).toHaveBeenCalledWith('Erro', 'Não foi possível realizar a candidatura.')
    );
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('não oferece nova candidatura quando o voluntário já se candidatou', async () => {
    await abrirTela([{ id: 9, estudoId: 42, status: 'PENDENTE' }]);

    expect(screen.queryByText('Candidatar-se para o Estudo')).not.toBeOnTheScreen();
  });
});
