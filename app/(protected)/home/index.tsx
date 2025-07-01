import { View, Text, StyleSheet } from 'react-native';

export default function AuthorizedInitialPage() {
 return (
   <View style={styles.container}> 
        <Text style={styles.title}>Authorized Initial Page</Text>
        {/* Add your authorized initial page content here */}
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#161C2D',
  },
});