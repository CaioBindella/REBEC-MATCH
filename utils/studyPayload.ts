import { StudyFormValues } from '@/components/researcherComponents/StudyForm';
import { CriterioUpdateDTO, EstudoCreateDTO, EstudoResponseDTO } from '@/types/types';
import { dataBrParaIso, isoParaDataBr, normalizarIdade } from '@/utils/formatters';

/** Converte os valores do formulário no corpo esperado pela API (EstudoCreateDTO/EstudoUpdateDTO). */
export const toEstudoPayload = (v: StudyFormValues): EstudoCreateDTO => ({
  publicTitle: v.publicTitle.trim(),
  scientificTitle: v.scientificTitle.trim(),
  trialId: v.trialId.trim(),
  recruitmentStatus: v.recruitmentStatus,
  studyType: v.studyType.trim(),
  phase: v.phase.trim(),
  dateRegistration: dataBrParaIso(v.dateRegistration)!,
  dateEnrolment: v.dateEnrolment ? dataBrParaIso(v.dateEnrolment) : null,
  approvalDate: v.approvalDate.trim() || null,
  primarySponsor: v.primarySponsor.trim(),
  hcFreetext: v.hcFreetext.trim(),
  iFreetext: v.iFreetext.trim(),
  url: v.url.trim(),
});

/** Converte os valores do formulário no corpo do critério de elegibilidade (formato ICTRP). */
export const toCriterioPayload = (v: StudyFormValues): CriterioUpdateDTO => ({
  inclusion_criteria: v.inclusionCriteria.trim(),
  exclusion_criteria: v.exclusionCriteria.trim(),
  agemin: normalizarIdade(v.ageMin),
  agemax: normalizarIdade(v.ageMax),
  gender: v.gender,
});

/** Preenche o formulário de edição a partir do estudo devolvido pela API. */
export const fromEstudo = (estudo: EstudoResponseDTO): StudyFormValues => {
  const criterio = estudo.criterios[0];
  return {
    publicTitle: estudo.publicTitle ?? '',
    scientificTitle: estudo.scientificTitle ?? '',
    trialId: estudo.trialId ?? '',
    recruitmentStatus: (estudo.recruitmentStatus as StudyFormValues['recruitmentStatus']) ?? 'Recruiting',
    studyType: estudo.studyType ?? '',
    phase: estudo.phase ?? '',
    dateRegistration: isoParaDataBr(estudo.dateRegistration),
    dateEnrolment: isoParaDataBr(estudo.dateEnrolment),
    approvalDate: estudo.approvalDate ?? '',
    primarySponsor: estudo.primarySponsor ?? '',
    hcFreetext: estudo.hcFreetext ?? '',
    iFreetext: estudo.iFreetext ?? '',
    url: estudo.url ?? '',
    ageMin: criterio?.agemin ?? '',
    ageMax: criterio?.agemax ?? '',
    gender: criterio?.gender ?? 'AMBOS',
    inclusionCriteria: criterio?.inclusion_criteria ?? '',
    exclusionCriteria: criterio?.exclusion_criteria ?? '',
  };
};
