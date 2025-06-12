import { Image } from 'expo-image';
import { StyleSheet, View, Text } from 'react-native';

export default function TabTwoScreen() {
  return (
    <View>
      <Text style={styles.text}>Explore screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
  },
});
