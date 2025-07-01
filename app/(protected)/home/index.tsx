import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Context
import { useAuth } from '@/context/AuthContext';

export default function AuthorizedInitialPage() {
  const { logOut } = useAuth(); // Hook para acessar o contexto de autenticação

  // Função para lidar com o logout
  const handleLogout = () => {
    logOut();
  };

  // Exemplo de uso do handleLogout
  // Você pode chamar handleLogout em um botão ou outro evento
  // <Button title="Logout" onPress={handleLogout} />

 return (
   <View style={styles.container}> 
        <Text style={styles.title}>Authorized Initial Page</Text>
        <TouchableOpacity>
          <Text style={styles.title} onPress={handleLogout}>CheckOut</Text>
        </TouchableOpacity>
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