import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { QuestaoResponseDTO } from '@/types/types';
import { parseOpcoes } from '@/utils/formatters';

interface QuestionProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

const Label = ({ label, required }: { label: string; required?: boolean }) => (
  <Text style={styles.label}>
    {label}
    {required && <Text style={styles.required}> *</Text>}
  </Text>
);

// --- Componente para Respostas de Texto ---
export const TextInputQuestion: React.FC<QuestionProps & TextInputProps> = ({ label, value, onValueChange, required, error, ...props }) => (
  <View style={styles.questionContainer}>
    <Label label={label} required={required} />
    <TextInput
      style={[styles.input, props.multiline && styles.textarea, !!error && styles.inputError]}
      value={value}
      onChangeText={onValueChange}
      placeholderTextColor="#999"
      placeholder="Digite sua resposta"
      {...props}
    />
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// --- Componente para Respostas de Escolha Única (Rádio) ---
export const RadioQuestion: React.FC<QuestionProps & { options: string[] }> = ({ label, options, value, onValueChange, required, error }) => (
  <View style={styles.questionContainer}>
    <Label label={label} required={required} />
    <View>
      {options.map((option) => (
        <TouchableOpacity key={option} style={styles.optionContainer} onPress={() => onValueChange(option)}>
          <Ionicons
            name={value === option ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={value === option ? '#15715A' : '#ced4da'}
          />
          <Text style={styles.optionLabel}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

/**
 * Renderiza uma questão cadastrada no banco interpretando o seu tipo em tempo de execução:
 * TEXTO gera um campo de texto e OPCOES gera uma lista de escolha única com as opções do JSON.
 * Assim, novas perguntas podem ser incluídas no formulário sem alterar o código do aplicativo.
 */
export const DynamicQuestion: React.FC<{
  questao: QuestaoResponseDTO;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}> = ({ questao, value, onValueChange, error }) => {
  if (questao.tipo === 'OPCOES') {
    return (
      <RadioQuestion
        label={questao.texto}
        options={parseOpcoes(questao.opcoes)}
        value={value}
        onValueChange={onValueChange}
        required={questao.obrigatorio}
        error={error}
      />
    );
  }
  return (
    <TextInputQuestion
      label={questao.texto}
      value={value}
      onValueChange={onValueChange}
      required={questao.obrigatorio}
      error={error}
    />
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  required: {
    color: '#dc3545',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: '#343a40',
    flex: 1,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 13,
    marginTop: 6,
  },
});
