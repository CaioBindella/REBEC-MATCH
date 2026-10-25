import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, TextInputProps } from 'react-native';
import { useForm, Controller, Control, FieldErrors } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import FilterPicker from '@/components/reusable/FilterPicker';
import { GeneroElegivel, StatusRecrutamento } from '@/types/types';
import { dataBrParaIso, GENERO_ELEGIVEL, IDADE_VALIDA, STATUS_RECRUTAMENTO } from '@/utils/formatters';

export interface StudyFormValues {
  publicTitle: string;
  scientificTitle: string;
  trialId: string;
  recruitmentStatus: StatusRecrutamento;
  studyType: string;
  phase: string;
  dateRegistration: string; // DD/MM/AAAA
  dateEnrolment: string;    // DD/MM/AAAA (opcional)
  approvalDate: string;
  primarySponsor: string;
  hcFreetext: string;
  iFreetext: string;
  url: string;
  ageMin: string;
  ageMax: string;
  gender: GeneroElegivel;
  inclusionCriteria: string;
  exclusionCriteria: string;
}

export const STUDY_FORM_DEFAULTS: StudyFormValues = {
  publicTitle: '',
  scientificTitle: '',
  trialId: '',
  recruitmentStatus: 'Recruiting',
  studyType: '',
  phase: '',
  dateRegistration: '',
  dateEnrolment: '',
  approvalDate: '',
  primarySponsor: '',
  hcFreetext: '',
  iFreetext: '',
  url: '',
  ageMin: '',
  ageMax: '',
  gender: 'AMBOS',
  inclusionCriteria: '',
  exclusionCriteria: '',
};

const dataObrigatoria = Yup.string()
  .required('Informe a data.')
  .test('data', 'Use o formato DD/MM/AAAA.', (v) => !!v && !!dataBrParaIso(v));
const dataOpcional = Yup.string().test('data', 'Use o formato DD/MM/AAAA.', (v) => !v || !!dataBrParaIso(v));
const idade = Yup.string().test(
  'idade',
  'Use um número seguido da unidade: Y (anos), M (meses), W (semanas), D (dias) ou H (horas). Ex.: 18Y.',
  (v) => !v || IDADE_VALIDA.test(v)
);

// Regras alinhadas às validações da API (EstudoCreateDTO/CriterioCreateDTO)
const schema: Yup.ObjectSchema<StudyFormValues> = Yup.object({
  publicTitle: Yup.string().trim().required('Informe o título público.'),
  scientificTitle: Yup.string().trim().required('Informe o título científico.'),
  trialId: Yup.string().trim().required('Informe o número de registro (ex.: RBR-xxxxxx).'),
  recruitmentStatus: Yup.mixed<StatusRecrutamento>()
    .oneOf(STATUS_RECRUTAMENTO.map((s) => s.value), 'Selecione o status.')
    .required('Selecione o status.'),
  studyType: Yup.string().default(''),
  phase: Yup.string().default(''),
  dateRegistration: dataObrigatoria,
  dateEnrolment: dataOpcional.default(''),
  approvalDate: Yup.string().default(''),
  primarySponsor: Yup.string().default(''),
  hcFreetext: Yup.string().trim().required('Descreva a condição de saúde estudada.'),
  iFreetext: Yup.string().default(''),
  url: Yup.string().default(''),
  ageMin: idade.default(''),
  ageMax: idade.default(''),
  gender: Yup.mixed<GeneroElegivel>().oneOf(['AMBOS', 'FEMININO', 'MASCULINO']).required(),
  inclusionCriteria: Yup.string().trim().required('Informe os critérios de inclusão.'),
  exclusionCriteria: Yup.string().default(''),
});

type Field = keyof StudyFormValues;

const InputField = ({
  control, errors, name, label, ...props
}: { control: Control<StudyFormValues>; errors: FieldErrors<StudyFormValues>; name: Field; label: string } & TextInputProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={[styles.input, props.multiline && styles.textarea, errors[name] && styles.inputError]}
          value={String(value ?? '')}
          onChangeText={onChange}
          onBlur={onBlur}
          placeholderTextColor="#999"
          {...props}
        />
      )}
    />
    {errors[name] && <Text style={styles.errorText}>{errors[name]?.message as string}</Text>}
  </View>
);

interface StudyFormProps {
  initialValues?: StudyFormValues;
  submitLabel: string;
  onSubmit: (values: StudyFormValues) => Promise<void>;
}

/**
 * Formulário de estudo clínico reutilizado no cadastro e na edição. Reúne os dados do registro
 * e os critérios de elegibilidade, incluindo os atributos estruturados (idade e sexo) usados na
 * compatibilidade automática.
 */
export default function StudyForm({ initialValues = STUDY_FORM_DEFAULTS, submitLabel, onSubmit }: StudyFormProps) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<StudyFormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const props = { control, errors };

  return (
    <View>
      <Text style={styles.sectionTitle}>Dados do Registro</Text>
      <InputField {...props} name="publicTitle" label="Título Público" placeholder="Título em linguagem acessível" />
      <InputField {...props} name="scientificTitle" label="Título Científico" placeholder="Título técnico do protocolo" multiline />
      <InputField {...props} name="trialId" label="Número de Registro" placeholder="Ex.: RBR-abc123" autoCapitalize="characters" />

      <View style={styles.inputGroup}>
        <Controller
          control={control}
          name="recruitmentStatus"
          render={({ field: { onChange, value } }) => (
            <FilterPicker
              label="Status de Recrutamento"
              value={value}
              onValueChange={(v) => v && onChange(v)}
              items={STATUS_RECRUTAMENTO}
              placeholder={{ label: 'Selecione o status', value: null }}
            />
          )}
        />
        {errors.recruitmentStatus && <Text style={styles.errorText}>{errors.recruitmentStatus.message}</Text>}
      </View>

      <InputField {...props} name="dateRegistration" label="Data de Registro" placeholder="DD/MM/AAAA" keyboardType="numbers-and-punctuation" maxLength={10} />
      <InputField {...props} name="dateEnrolment" label="Data de Início da Inclusão (opcional)" placeholder="DD/MM/AAAA" keyboardType="numbers-and-punctuation" maxLength={10} />
      <InputField {...props} name="approvalDate" label="Data de Aprovação Ética - CEP (opcional)" placeholder="DD/MM/AAAA" />
      <InputField {...props} name="studyType" label="Tipo de Estudo (opcional)" placeholder="Ex.: Intervention" />
      <InputField {...props} name="phase" label="Fase (opcional)" placeholder="Ex.: 3" />
      <InputField {...props} name="primarySponsor" label="Patrocinador Principal (opcional)" />
      <InputField {...props} name="hcFreetext" label="Condição de Saúde" placeholder="Doença ou condição estudada" multiline />
      <InputField {...props} name="iFreetext" label="Intervenção (opcional)" multiline />
      <InputField {...props} name="url" label="Link do Registro (opcional)" placeholder="https://ensaiosclinicos.gov.br/rg/..." autoCapitalize="none" />

      <Text style={styles.sectionTitle}>Critérios de Elegibilidade</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <InputField {...props} name="ageMin" label="Idade Mínima" placeholder="Ex.: 18Y" autoCapitalize="characters" />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <InputField {...props} name="ageMax" label="Idade Máxima" placeholder="Ex.: 65Y" autoCapitalize="characters" />
        </View>
      </View>
      <Text style={styles.hint}>Deixe em branco para não limitar. Número sem unidade é interpretado em anos.</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sexo Elegível</Text>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <View style={styles.selector}>
              {GENERO_ELEGIVEL.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.selectorButton, value === g.value && styles.selectorButtonActive]}
                  onPress={() => onChange(g.value)}
                >
                  <Text style={[styles.selectorText, value === g.value && styles.selectorTextActive]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      </View>

      <InputField {...props} name="inclusionCriteria" label="Critérios de Inclusão" multiline />
      <InputField {...props} name="exclusionCriteria" label="Critérios de Exclusão (opcional)" multiline />

      <TouchableOpacity style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>{submitLabel}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#343a40', marginTop: 8, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 8 },
  inputGroup: { width: '100%', marginBottom: 16 },
  label: { fontSize: 15, fontWeight: '600', color: '#495057', marginBottom: 8 },
  input: { backgroundColor: '#fff', minHeight: 50, borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, paddingHorizontal: 15, fontSize: 16 },
  inputError: { borderColor: '#dc3545' },
  textarea: { height: 110, textAlignVertical: 'top', paddingTop: 12 },
  errorText: { color: '#dc3545', fontSize: 13, marginTop: 4 },
  hint: { fontSize: 12, color: '#6c757d', marginTop: -8, marginBottom: 16 },
  row: { flexDirection: 'row' },
  selector: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#ced4da' },
  selectorButton: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#eee' },
  selectorButtonActive: { backgroundColor: '#15715A' },
  selectorText: { fontSize: 13, fontWeight: 'bold', color: '#6c757d' },
  selectorTextActive: { color: '#fff' },
  submitButton: { backgroundColor: '#15715A', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
