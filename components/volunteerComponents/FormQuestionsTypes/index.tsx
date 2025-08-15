import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Option {
  label: string;
  value: string;
}

interface QuestionProps {
  label: string;
  value: any;
  options?: Option[];
  onValueChange: (value: any) => void;
  placeholder?: string;
  multiline?: boolean;
}

// --- Componente para Respostas de Texto ---
export const TextInputQuestion: React.FC<QuestionProps & TextInputProps> = ({ label, value, onValueChange, ...props }) => (
  <View style={styles.questionContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, props.multiline && styles.textarea]}
      value={value}
      onChangeText={onValueChange}
      placeholderTextColor="#999"
      {...props}
    />
  </View>
);

// --- Componente para Respostas de Escolha Única (Rádio) ---
export const RadioQuestion: React.FC<QuestionProps> = ({ label, options = [], value, onValueChange }) => (
  <View style={styles.questionContainer}>
    <Text style={styles.label}>{label}</Text>
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.optionContainer}
          onPress={() => onValueChange(option.value)}
        >
          <Ionicons
            name={value === option.value ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={value === option.value ? '#15715A' : '#ced4da'}
          />
          <Text style={styles.optionLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

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
  input: {
    backgroundColor: '#fff',
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
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
  },
});
