import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiService, getErrorMessage } from '@/services/api/apiClient';
import { dataBrParaIso } from '@/utils/formatters';

type FormData = {
  nome: string;
  sobrenome: string;
  login: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  sexo: string;
  data_nascimento: string;
  telefone: string;
  cep: string;
  endereco: string;
  tipo_especifico?: 'VOLUNTARIO';
  documento?: string | null;
};

// Regras alinhadas às validações da API (UsuarioCreateDTO)
const schema: Yup.ObjectSchema<FormData> = Yup.object({
  nome: Yup.string().trim().max(50, 'Máximo de 50 caracteres.').required('Informe o seu nome.'),
  sobrenome: Yup.string().trim().max(50, 'Máximo de 50 caracteres.').required('Informe o seu sobrenome.'),
  login: Yup.string().trim().max(50, 'Máximo de 50 caracteres.').required('Crie um nome de usuário.'),
  email: Yup.string().trim().email('Informe um e-mail válido.').max(100, 'Máximo de 100 caracteres.').required('Informe o seu e-mail.'),
  senha: Yup.string().min(6, 'A senha deve ter ao menos 6 caracteres.').required('Crie uma senha.'),
  confirmarSenha: Yup.string()
    .oneOf([Yup.ref('senha')], 'As senhas não coincidem.')
    .required('Confirme a senha.'),
  sexo: Yup.mixed<'FEMININO' | 'MASCULINO' | 'OUTRO'>()
    .oneOf(['FEMININO', 'MASCULINO', 'OUTRO'], 'Selecione o sexo.')
    .required('Selecione o sexo.'),
  // Data de nascimento e sexo são usados na compatibilidade automática com os estudos
  data_nascimento: Yup.string()
    .required('Informe a data de nascimento.')
    .test('data-valida', 'Use o formato DD/MM/AAAA com uma data passada.', (valor) => {
      const iso = valor ? dataBrParaIso(valor) : null;
      return !!iso && new Date(iso) < new Date();
    }),
  telefone: Yup.string().trim().max(25, 'Máximo de 25 caracteres.').required('Informe o telefone.'),
  cep: Yup.string().matches(/^\d{8}$/, 'O CEP deve conter 8 dígitos.').required('Informe o CEP.'),
  endereco: Yup.string().trim().max(255, 'Máximo de 255 caracteres.').required('Informe o endereço.'),
  tipo_especifico: Yup.mixed<'VOLUNTARIO'>().optional(),
  documento: Yup.string().nullable().optional(),
});

export default function RegisterForm() {
  const router = useRouter();
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } =
  useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      sexo: '',
      documento: null,
    },
  });


  const onSubmit = async (data: FormData) => {
    if (!aceitoTermos) {
      Alert.alert('Atenção', 'Você precisa aceitar os termos para continuar.');
      return;
    }

    setLoading(true);

    try {
      // Monta o payload conforme a Entity do Java
      // Monta o payload conforme o UsuarioCreateDTO da API
      const payload = {
        nome: data.nome.trim(),
        sobrenome: data.sobrenome.trim(),
        login: data.login.trim(),
        email: data.email.trim(),
        senha: data.senha,
        tipoEspecifico: 'VOLUNTARIO' as const,
        sexo: data.sexo as 'FEMININO' | 'MASCULINO' | 'OUTRO',
        dataNascimento: dataBrParaIso(data.data_nascimento) ?? undefined,
        telefone: data.telefone.trim(),
        cep: data.cep,
        endereco: data.endereco.trim(),
      };

      await apiService.usuario.create(payload);

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);

    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error, 'Ocorreu um erro ao realizar o cadastro.'));
    } finally {
      setLoading(false);
    }
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
      <Text style={styles.label}>Login (Nome de Usuário)</Text>
      <Controller
        control={control}
        name="login"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Crie um nome de usuário único"
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

      {/* Confirmar Senha */}
      <Text style={styles.label}>Confirmar Senha</Text>
      <Controller
        control={control}
        name="confirmarSenha"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Repita a senha"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.confirmarSenha && <Text style={styles.errorText}>{errors.confirmarSenha.message}</Text>}

      {/* Sexo */}
      <Text style={styles.label}>Sexo</Text>
      <Controller
        control={control}
        name="sexo"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
              <Picker.Item label="Escolha o sexo" value="" color="#999"/>
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
            placeholder="DD/MM/AAAA"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
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
            placeholder="DDD + Número"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.telefone && <Text style={styles.errorText}>{errors.telefone.message}</Text>}

      {/* CEP */}
      <Text style={styles.label}>CEP</Text>
      <Controller
        control={control}
        name="cep"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="00000000 (Apenas números)"
            onBlur={onBlur}
            onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
            value={value}
            keyboardType="numeric"
            maxLength={8}
          />
        )}
      />
      {errors.cep && <Text style={styles.errorText}>{errors.cep.message}</Text>}

      {/* Endereço */}
      <Text style={styles.label}>Endereço Completo</Text>
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

      {/* Termos de Uso */}
      <TouchableOpacity 
        style={styles.termosContainer} 
        onPress={() => setAceitoTermos(!aceitoTermos)} // Clicar na linha toda marca/desmarca
        activeOpacity={0.8}
      >
        <View style={[styles.checkboxBase, aceitoTermos && styles.checkboxChecked]}>
          {aceitoTermos && <Ionicons name="checkmark" size={18} color="#fff" />}
        </View>
        <Text style={styles.termosText}>
            Eu aceito os{' '}
            <Text 
              style={{ textDecorationLine: 'underline', fontWeight: 'bold', color: '#166865' }}
              onPress={(e) => {
                e.stopPropagation(); 
                router.push('/(public)/terms/page');
              }}
            >
              Termos de Ciência
            </Text>
        </Text>
      </TouchableOpacity>

      {/* Botão de Envio */}
      <TouchableOpacity 
        style={[styles.button, (!aceitoTermos || loading) && { opacity: 0.5 }]} 
        onPress={handleSubmit(onSubmit)}
        disabled={!aceitoTermos || loading}
      >
        {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
      
      {/* Botão Voltar */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
         <Ionicons name="arrow-back" size={20} color="#166865" style={{ marginRight: 8 }} />
         <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.termosText}>Já tem uma conta? 
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={{ color: '#166865', fontWeight: 'bold', textDecorationLine: 'underline', top: 3 }}> Acesse</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
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
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#166865',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 50,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#166865',
    backgroundColor: '#fff',
  },
  backButtonText: {
    color: '#166865',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 10,
    marginTop: -10,
    marginLeft: 5,
    fontSize: 14,
  },
  termosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,    
  },
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#166865',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#166865',
  },
  termosText: {
    fontSize: 14,
    color: '#333',
  },
});