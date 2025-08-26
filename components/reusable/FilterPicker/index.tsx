import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect, { Item } from "react-native-picker-select";

type FilterPickerProps = {
  label: string;
  value: string | number | null;
  onValueChange: (value: string | number | null) => void;
  items: Item[];
  placeholder?: { label: string; value: string | null };
};

export default function FilterPicker({
  label,
  value,
  onValueChange,
  items,
  placeholder,
}: FilterPickerProps) {
  return (
    <View style={styles.filterItem}>
      <Text style={styles.filterLabel}>{label}</Text>
      <RNPickerSelect
        value={value}
        onValueChange={onValueChange}
        items={items}
        placeholder={placeholder ?? { label: "Selecione...", value: null }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        Icon={() => <Ionicons name="chevron-down" size={20} color="#495057" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterItem: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#333",
    paddingRight: 30, // Aumenta o padding para o texto não ficar por cima da seta
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "#333",
    paddingRight: 30, // Aumenta o padding para o texto não ficar por cima da seta
  },
  iconContainer: {
    top: '50%', // Alinha verticalmente no centro
    right: 12,   // Ajusta a posição horizontal da seta
    marginTop: -10, // Compensa metade da altura do ícone para centralizar perfeitamente
  },
  // Certifique-se de que este estilo existe se você estiver usando placeholder
  placeholder: {
    color: '#6c757d',
  },
});