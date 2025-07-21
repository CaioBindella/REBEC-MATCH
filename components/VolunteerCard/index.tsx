import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface VolunteerCardProps {
  id: string;
  location: string;
  description: string;
  tags: string[];
}

const VolunteerCard: React.FC<VolunteerCardProps> = ({ id, location, description, tags }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.imagePlaceholder} />
        <View style={styles.headerText}>
          <Text style={styles.volunteerId}>{id}</Text>
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#e9ecef',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  volunteerId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  location: {
    fontSize: 14,
    color: '#6c757d',
  },
  description: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e9ecef',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#495057',
  },
});

export default VolunteerCard;