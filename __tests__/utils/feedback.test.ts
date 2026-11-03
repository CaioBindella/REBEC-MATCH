import { Alert, AlertButton } from 'react-native';

import { avisar, confirmar } from '@/utils/feedback';

const botoesDoAlerta = () => (jest.mocked(Alert.alert).mock.calls[0][2] ?? []) as AlertButton[];

describe('feedback no celular', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });

  it('avisar mostra o alerta e chama aoFechar ao tocar em OK', () => {
    const aoFechar = jest.fn();
    avisar('Candidato aprovado', 'O voluntário foi notificado.', aoFechar);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Candidato aprovado',
      'O voluntário foi notificado.',
      expect.any(Array),
      { cancelable: false }
    );
    expect(aoFechar).not.toHaveBeenCalled();
    botoesDoAlerta()[0].onPress?.();
    expect(aoFechar).toHaveBeenCalledTimes(1);
  });

  it('confirmar resolve true quando o usuário confirma', async () => {
    const resposta = confirmar('Sair', 'Deseja sair?', { textoConfirmar: 'Sair', destrutivo: true });
    const [cancelar, sair] = botoesDoAlerta();

    expect(cancelar.text).toBe('Cancelar');
    expect(sair).toMatchObject({ text: 'Sair', style: 'destructive' });
    sair.onPress?.();
    await expect(resposta).resolves.toBe(true);
  });

  it('confirmar resolve false quando o usuário cancela', async () => {
    const resposta = confirmar('Recusar', 'Deseja recusar?');
    botoesDoAlerta()[0].onPress?.();
    await expect(resposta).resolves.toBe(false);
  });
});

describe('feedback na versão web', () => {
  // O módulo decide a plataforma ao ser carregado, por isso é recarregado com Platform.OS = 'web'
  const carregarNaWeb = () => {
    let modulo!: typeof import('@/utils/feedback');
    jest.isolateModules(() => {
      const { Platform: plataforma } = require('react-native') as typeof import('react-native');
      jest.replaceProperty(plataforma, 'OS', 'web');
      modulo = require('@/utils/feedback');
    });
    return modulo;
  };

  it('avisar usa window.alert e chama aoFechar em seguida', () => {
    const { avisar: avisarWeb } = carregarNaWeb();
    const alerta = jest.fn();
    Object.assign(window, { alert: alerta });
    const aoFechar = jest.fn();

    avisarWeb('Estudo registrado', 'O estudo foi cadastrado.', aoFechar);

    expect(alerta).toHaveBeenCalledWith('Estudo registrado\n\nO estudo foi cadastrado.');
    expect(aoFechar).toHaveBeenCalledTimes(1);
  });

  it('confirmar usa window.confirm e devolve a escolha do usuário', async () => {
    const { confirmar: confirmarWeb } = carregarNaWeb();
    const confirmacao = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);
    Object.assign(window, { confirm: confirmacao });

    await expect(confirmarWeb('Sair', 'Deseja sair?')).resolves.toBe(true);
    await expect(confirmarWeb('Sair', 'Deseja sair?')).resolves.toBe(false);
    expect(confirmacao).toHaveBeenCalledTimes(2);
  });
});
