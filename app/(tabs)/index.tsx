import { Text, View, StyleSheet } from 'react-native';


export default function HomeScreen() {
  return (
    <View>
      <Text style={styles.text}>index screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
  },
});
