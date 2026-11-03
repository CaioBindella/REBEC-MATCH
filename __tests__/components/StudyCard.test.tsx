import { fireEvent, render, screen } from '@testing-library/react-native';

import { StudyCard, StudySummary } from '@/components/volunteerComponents/StudyCard';

const estudo: StudySummary = {
  id: 1,
  titulo: 'Caminhada para hipertensos',
  informacoesGerais: 'Ensaio clínico sobre caminhada supervisionada',
  status: 'Recruiting',
  doencas: ['Hipertensão'],
};

describe('StudyCard', () => {
  it('mostra o título, o status traduzido e as condições do estudo', () => {
    render(<StudyCard study={estudo} onPress={jest.fn()} />);

    expect(screen.getByText('Caminhada para hipertensos')).toBeOnTheScreen();
    expect(screen.getByText('Recrutando')).toBeOnTheScreen();
    expect(screen.getByText('Condições: Hipertensão')).toBeOnTheScreen();
    expect(screen.queryByText('Compatível com seu perfil')).not.toBeOnTheScreen();
  });

  it('exibe os selos de compatibilidade e de estudo no mesmo estado', () => {
    render(
      <StudyCard study={{ ...estudo, compativel: true, mesmaUf: true, uf: 'RJ' }} onPress={jest.fn()} />
    );

    expect(screen.getByText('Compatível com seu perfil')).toBeOnTheScreen();
    expect(screen.getByText('No seu estado (RJ)')).toBeOnTheScreen();
  });

  it('exibe o selo de região quando o estudo é de outro estado da mesma região', () => {
    render(<StudyCard study={{ ...estudo, mesmaRegiao: true, uf: 'SP' }} onPress={jest.fn()} />);

    expect(screen.getByText('Na sua região (SP)')).toBeOnTheScreen();
  });

  it('exibe um aviso para cada alerta de possível exclusão', () => {
    render(<StudyCard study={{ ...estudo, alertas: ['GESTACAO', 'TABAGISMO'] }} onPress={jest.fn()} />);

    expect(screen.getByText('Atenção: Os critérios de exclusão mencionam gestação.')).toBeOnTheScreen();
    expect(screen.getByText('Atenção: Os critérios de exclusão mencionam tabagismo.')).toBeOnTheScreen();
  });

  it('chama onPress ao tocar em Ver Detalhes', () => {
    const onPress = jest.fn();
    render(<StudyCard study={estudo} onPress={onPress} />);

    fireEvent.press(screen.getByText('Ver Detalhes'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
