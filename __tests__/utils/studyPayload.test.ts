import { StudyFormValues } from '@/components/researcherComponents/StudyForm';
import { EstudoResponseDTO } from '@/types/types';
import { fromEstudo, toCriterioPayload, toEstudoPayload } from '@/utils/studyPayload';

const valores: StudyFormValues = {
  publicTitle: '  Caminhada para hipertensos ',
  scientificTitle: 'Ensaio clínico randomizado',
  trialId: ' RBR-abc123 ',
  recruitmentStatus: 'Recruiting',
  studyType: 'Intervencional',
  phase: '3',
  dateRegistration: '10/01/2026',
  dateEnrolment: '',
  approvalDate: '',
  primarySponsor: 'UERJ',
  hcFreetext: 'Hipertensão',
  iFreetext: 'Caminhada',
  url: '',
  ageMin: '18',
  ageMax: '65y',
  gender: 'FEMININO',
  inclusionCriteria: ' Adultos ',
  exclusionCriteria: 'Gestantes',
};

describe('conversão do formulário de estudo', () => {
  it('monta o corpo do estudo com textos aparados e datas em ISO', () => {
    expect(toEstudoPayload(valores)).toMatchObject({
      publicTitle: 'Caminhada para hipertensos',
      trialId: 'RBR-abc123',
      dateRegistration: '2026-01-10',
      dateEnrolment: null,
      approvalDate: null,
    });
  });

  it('monta o critério com as idades no formato ICTRP', () => {
    expect(toCriterioPayload(valores)).toEqual({
      inclusion_criteria: 'Adultos',
      exclusion_criteria: 'Gestantes',
      agemin: '18Y',
      agemax: '65Y',
      gender: 'FEMININO',
    });
  });

  it('preenche o formulário de edição a partir do estudo da API', () => {
    const estudo = {
      id: 1,
      publicTitle: 'Estudo',
      scientificTitle: null,
      trialId: 'RBR-1',
      recruitmentStatus: 'Recruiting',
      dateRegistration: '2026-01-10',
      dateEnrolment: null,
      criterios: [
        {
          id: 2,
          agemin: '18Y',
          agemax: '',
          gender: 'AMBOS',
          inclusion_criteria: 'Adultos',
          exclusion_criteria: '',
        },
      ],
    } as unknown as EstudoResponseDTO;

    expect(fromEstudo(estudo)).toMatchObject({
      publicTitle: 'Estudo',
      scientificTitle: '',
      dateRegistration: '10/01/2026',
      dateEnrolment: '',
      ageMin: '18Y',
      gender: 'AMBOS',
      inclusionCriteria: 'Adultos',
    });
  });
});
