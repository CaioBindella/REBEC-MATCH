import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // Importando o expo-router para navegação
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; // 1. Importar o yupResolver
import * as Yup from 'yup';

// Definindo o tipo dos dados do formulário
type UserData = {
  login: string;
  senha: string;
};

// 2. Schema de validação com nomes corretos e mensagens de erro
const schema = Yup.object().shape({
  login: Yup.string().required('O campo Usuário é obrigatório'),
  senha: Yup.string().required('O campo Senha é obrigatório'),
});

export default function LoginCredentials() {
  // 3. Conectar o schema ao useForm usando o resolver e o tipo correto
  const { control, handleSubmit, formState: { errors } } = useForm<UserData>({
    resolver: yupResolver(schema),
    defaultValues: { // É uma boa prática definir os valores padrão
        login: '',
        senha: '',
    }
  });

  // 4. Criar a função que será chamada no envio do formulário
  const onSubmit = (data: UserData) => {
    console.log(data);
    Alert.alert('Sucesso!', `Usuário: ${data.login}`);
    useRouter().push('/(protected)/home/index'); // Navegando para a página protegida após o login
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Acessar conta</Text>

        <Text style={styles.label}>Usuário</Text>
        <Controller
          control={control}
          name="login" // Nome do campo correto
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.login && styles.inputError]} // Estilo de erro
              placeholder="Digite seu nome de usuário"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {/* Exibição da mensagem de erro específica para o campo 'login' */}
        {errors.login && <Text style={styles.errorText}>{errors.login.message}</Text>}

        <Text style={styles.label}>Senha</Text>
        <Controller
          control={control}
          name="senha" // 6. Corrigido o nome do campo de "Senha" para "senha" (minúsculo)
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.senha && styles.inputError]} // Estilo de erro
              placeholder="Digite sua senha"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry // Importante para campos de senha
            />
          )}
        />
        {/* Exibição da mensagem de erro específica para o campo 'senha' */}
        {errors.senha && <Text style={styles.errorText}>{errors.senha.message}</Text>}
      </View>

      {/* 7. Adicionar um botão para submeter o formulário */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos com pequenas melhorias
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'space-evenly', // Distribui o espaço entre os elementos
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
    marginBottom: 5, // Reduzido para o erro ficar mais próximo
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red', // Adiciona uma borda vermelha em caso de erro
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
});