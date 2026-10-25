import { StyleSheet, View, Text } from 'react-native';


export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Not found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
