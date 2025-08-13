// Exemplo de como o InfoCard poderia ser modificado
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Usaremos ícones do Expo

// A interface agora aceita uma imagem OU um ícone
interface InfoCardProps {
  title: string;
  description: string;
  buttonText: string;
  linkTo: any;
  imageSource?: any; // Torna a imagem opcional
  icon?: { // Adiciona a propriedade de ícone opcional
    name: keyof typeof Ionicons.glyphMap; // Garante que o nome do ícone é válido
    size: number;
    color: string;
  };
}

export default function InfoCard({ title, description, buttonText, linkTo, imageSource, icon }: InfoCardProps) {
  const router = useRouter();

  return (
    <View style={styles.cardContainer}>
      {/* Renderiza o ícone se ele for passado, senão, renderiza a imagem */}
      {icon ? (
        <Ionicons name={icon.name} size={icon.size} color={icon.color} style={styles.icon} />
      ) : (
        <Image source={imageSource} style={styles.image} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push(linkTo)}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Adicione os estilos de card que você já tem, mais o estilo para o ícone
const styles = StyleSheet.create({
  cardContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 16,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#15715A',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});