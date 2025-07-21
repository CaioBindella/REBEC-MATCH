import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Link } from 'expo-router';

// Definindo as propriedades que o componente aceitará
interface CardProps {
  imageSource: ImageSourcePropType;
  title: string;
  description: string;
  buttonText: string;
  linkTo: any; // Usamos 'any' para aceitar os tipos de href do Expo Router
}

const InfoCard: React.FC<CardProps> = ({ imageSource, title, description, buttonText, linkTo }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={imageSource} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        {/*
          O componente Link do Expo Router envolve o botão.
          A propriedade 'asChild' faz com que o Link passe as propriedades de navegação
          para o primeiro filho (TouchableOpacity), em vez de renderizar sua própria tag <a>.
        */}
        <Link href={linkTo} asChild>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%', // Ocupará a largura do container pai
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 22,
    marginBottom: 20,
  },
  cardButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: 'center',
    alignSelf: 'center',
  },
  cardButtonText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
});

export default InfoCard;