import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Switch, Alert
} from 'react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

// Define o formato dos dados do formulário baseado na estrutura JSON
type FormData = {
  nome: string;
  sobrenome: string;
  login: string;
  email: string;
  senha: string;
  tipo: 'USER' | 'ADMIN';
  tipo_especifico: 'VOLUNTARIO' | 'PESQUISADOR';
  sexo: 'FEMININO' | 'MASCULINO' | 'OUTRO' | '';
  data_nascimento: string;
  telefone: string;
  endereco: string;
  documento: string;
  tester?: boolean;
};

// Define o esquema de validação para os campos do formulário
const schema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  sobrenome: Yup.string().required('Sobrenome é obrigatório'),
  login: Yup.string().required('Login é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: Yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
  tipo: Yup.string().oneOf(['USER', 'ADMIN'], 'Tipo de usuário inválido').required('O tipo de usuário é obrigatório'),
  tipo_especifico: Yup.string().oneOf(['VOLUNTARIO', 'PESQUISADOR'], 'Tipo específico inválido').required('O tipo específico é obrigatório'),
  sexo: Yup.string().oneOf(['FEMININO', 'MASCULINO', 'OUTRO'], 'Sexo inválido').required('Sexo é obrigatório'),
  data_nascimento: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido. Use AAAA-MM-DD').required('Data de nascimento é obrigatória'),
  telefone: Yup.string().required('Telefone é obrigatório'),
  endereco: Yup.string().required('Endereço é obrigatório'),
  documento: Yup.string().required('Documento (CPF/CNPJ) é obrigatório'),
  tester: Yup.boolean(),
});

export default function RegisterForm() {
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({});
  const router = useRouter();

  // Função para lidar com o envio do formulário
  const onSubmit = (data: FormData) => {
    console.log('Dados do Formulário:', data);
    // Em um aplicativo real, você enviaria esses dados para seu servidor
    Alert.alert('Cadastro Realizado!', 'Seus dados foram enviados com sucesso.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cadastro de Voluntário</Text>

      {/* Nome */}
      <Text style={styles.label}>Nome</Text>
      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Digite seu primeiro nome"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.nome && <Text style={styles.errorText}>{errors.nome.message}</Text>}

      {/* Sobrenome */}
      <Text style={styles.label}>Sobrenome</Text>
      <Controller
        control={control}
        name="sobrenome"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Digite seu sobrenome"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.sobrenome && <Text style={styles.errorText}>{errors.sobrenome.message}</Text>}

      {/* Login */}
      <Text style={styles.label}>Login</Text>
      <Controller
        control={control}
        name="login"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Crie um nome de usuário"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
      />
      {errors.login && <Text style={styles.errorText}>{errors.login.message}</Text>}

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="seu.email@example.com"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* Senha */}
      <Text style={styles.label}>Senha</Text>
      <Controller
        control={control}
        name="senha"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Crie uma senha forte"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.senha && <Text style={styles.errorText}>{errors.senha.message}</Text>}

      {/* Sexo */}
      <Text style={styles.label}>Sexo</Text>
      <Controller
        control={control}
        name="sexo"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
              <Picker.Item label="Escolha o sexo" value="" />
              <Picker.Item label="Feminino" value="FEMININO" />
              <Picker.Item label="Masculino" value="MASCULINO" />
              <Picker.Item label="Outro" value="OUTRO" />
            </Picker>
          </View>
        )}
      />
      {errors.sexo && <Text style={styles.errorText}>{errors.sexo.message}</Text>}

      {/* Data de Nascimento */}
      <Text style={styles.label}>Data de Nascimento</Text>
      <Controller
        control={control}
        name="data_nascimento"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.data_nascimento && <Text style={styles.errorText}>{errors.data_nascimento.message}</Text>}

      {/* Telefone */}
      <Text style={styles.label}>Telefone</Text>
      <Controller
        control={control}
        name="telefone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="(XX) XXXXX-XXXX"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.telefone && <Text style={styles.errorText}>{errors.telefone.message}</Text>}

      {/* Endereço */}
      <Text style={styles.label}>Endereço</Text>
      <Controller
        control={control}
        name="endereco"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Rua, Número, Bairro - Cidade/UF"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.endereco && <Text style={styles.errorText}>{errors.endereco.message}</Text>}

      {/* Documento */}
      <Text style={styles.label}>Documento (CPF/CNPJ)</Text>
      <Controller
        control={control}
        name="documento"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="XXX.XXX.XXX-XX"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numeric"
          />
        )}
      />
      {errors.documento && <Text style={styles.errorText}>{errors.documento.message}</Text>}

       {/* Termos */}
      <View style={styles.termosContainer}>
        <Switch value={aceitoTermos} onValueChange={setAceitoTermos} />
        <Text style={styles.termosText}>Eu aceito os <Text style={{ textDecorationLine: 'underline' }}>Termos de Ciência</Text>
        </Text>
      </View>

      {/* Botão de Envio */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      
      <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.termosText}>Já tem uma conta? 
          <TouchableOpacity 
            onPress={() => router.push("/(auth)/login")}
            >
            <Text style={{ color: '#166865', fontWeight: 'bold', textDecorationLine: 'underline' }}> Acesse</Text>
            </TouchableOpacity>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    paddingBottom: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#161C2D',
    textAlign: 'left',
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
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 5,
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
    marginTop: -10,
    marginLeft: 5,
  },
  termosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,    
  },
  termosText: {
    fontSize: 14,
    color: '#333',
  },
});