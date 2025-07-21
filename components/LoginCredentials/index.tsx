import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// Context
import { useAuth } from '@/context/AuthContext';

// Tipos
type FormData = {
  login: string;
  senha: string;
};

type User = {
    id: string;
    name: string;
    userType: 'VOLUNTARIO' | 'PESQUISADOR';
};

const schema = Yup.object().shape({
  login: Yup.string().required('O campo Usuário é obrigatório'),
  senha: Yup.string().required('O campo Senha é obrigatório'),
});

export default function LoginCredentials() {
  const { logIn } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
        login: '',
        senha: '',
    }
  });

  // --- FUNÇÃO 1: Para o formulário real ---
  // Esta função recebe os dados do formulário e faria a chamada para a API.
  const handleFormSubmit = (data: FormData) => {
    console.log('Enviando para a API:', data);
    //
    // AQUI VOCÊ FARIA A CHAMADA PARA A API REAL
    // Ex: const user = await api.login(data.login, data.senha);
    // logIn(user);
    //
    Alert.alert('Login Real', 'Funcionalidade de API a ser implementada.');
  };

  // --- FUNÇÃO 2: Para os botões de desenvolvimento ---
  // Esta função cria um usuário mock e faz o login direto.
  const handleDevLogin = (userType: 'VOLUNTARIO' | 'PESQUISADOR') => {
    const devUser: User = {
      id: userType === 'VOLUNTARIO' ? 'vol-dev-01' : 'pesq-dev-02',
      name: userType === 'VOLUNTARIO' ? 'Dev Voluntário' : 'Dev Pesquisador',
      userType: userType,
    };
    logIn(devUser);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Acessar conta</Text>

        {/* --- Formulário Real --- */}
        <Text style={styles.label}>Usuário</Text>
        <Controller
          control={control}
          name="login"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.login && styles.inputError]}
              placeholder="Digite seu nome de usuário"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.login && <Text style={styles.errorText}>{errors.login.message}</Text>}

        <Text style={styles.label}>Senha</Text>
        <Controller
          control={control}
          name="senha"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.senha && styles.inputError]}
              placeholder="Digite sua senha"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.senha && <Text style={styles.errorText}>{errors.senha.message}</Text>}
      </View>

      {/* Botão de "Entrar" para o formulário real, agora conectado à função correta */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(handleFormSubmit)}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Botões de desenvolvimento, conectados à função de dev */}
      {__DEV__ && (
            <View style={styles.devLoginContainer}>
                <Text style={styles.devLoginTitle}>Acesso Rápido (Dev)</Text>
                <TouchableOpacity
                    style={[styles.devButton, { backgroundColor: '#007bff' }]}
                    onPress={() => handleDevLogin('VOLUNTARIO')}
                >
                    <Text style={styles.buttonText}>Logar como Voluntário</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.devButton, { backgroundColor: '#28a745' }]}
                    onPress={() => handleDevLogin('PESQUISADOR')}
                >
                    <Text style={styles.buttonText}>Logar como Pesquisador</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
  );
}

// Seus estilos permanecem os mesmos
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#161C2D',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#161C2D',
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  button: {
    backgroundColor: '#166865',
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,
  },
  devLoginContainer: {
        marginTop: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    devLoginTitle: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },
    devButton: {
        width: '100%',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 10,
    },
});