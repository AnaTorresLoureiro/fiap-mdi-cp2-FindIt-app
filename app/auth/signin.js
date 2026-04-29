import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/authContext';

export default function Cadastro() {
  const router = useRouter();
  const { register, loginWithUser, isEmailTaken } = useAuth();

  const [foto, setFoto] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [erro, setErro] = useState({});
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const anim = useRef(new Animated.Value(0)).current;

  function animarErro() {
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -1, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  }

  async function selecionarImagem() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // ✅ corrigido (nova API)
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  }

  function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function handleCadastro() {
    let erros = {};

    if (!nome) erros.nome = 'Digite seu nome';
    if (!email || !validarEmail(email)) erros.email = 'Email inválido';
    if (isEmailTaken(email)) erros.email = 'Email já cadastrado';
    if (!senha || senha.length < 6) erros.senha = 'Mínimo 6 caracteres';
    if (confirmarSenha !== senha) erros.confirmar = 'Senhas não coincidem';

    if (Object.keys(erros).length > 0) {
      setErro(erros);
      animarErro();
      return;
    }

    setErro({});
    setLoading(true);

    setTimeout(() => {
      try {
        const novoUsuario = register(nome, email, senha, foto);
        const loggedIn = loginWithUser(novoUsuario);

        if (loggedIn) {
          setLoading(false);
          Alert.alert(
            'Cadastro Concluído com Sucesso!',
            'Sua conta foi criada com sucesso. Faça login para continuar.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/auth/login'),
              },
            ]
          );
        } else {
          setErro({ general: 'Erro ao fazer login após cadastro' });
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
        setErro({ general: 'Erro ao realizar cadastro' });
        setLoading(false);
      }
    }, 1500);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>

          {/* FOTO */}
          <TouchableOpacity onPress={selecionarImagem} style={styles.fotoContainer}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.foto} />
            ) : (
              <MaterialIcons name="add-a-photo" size={32} color="#fff" />
            )}
          </TouchableOpacity>

          {/* NOME */}
          <Text style={styles.label}>NOME COMPLETO</Text>
          <Animated.View style={{ width: '100%', alignItems: 'center', transform: [{ translateX: anim }] }}>
            <TextInput
              style={[styles.input, erro.nome && styles.inputErro]}
              value={nome}
              onChangeText={setNome}
            />
          </Animated.View>
          {erro.nome && <Text style={styles.erro}>{erro.nome}</Text>}

          {/* EMAIL */}
          <Text style={styles.label}>E-MAIL</Text>
          <Animated.View style={{ width: '100%', alignItems: 'center', transform: [{ translateX: anim }] }}>
            <TextInput
              style={[styles.input, erro.email && styles.inputErro]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </Animated.View>
          {erro.email && <Text style={styles.erro}>{erro.email}</Text>}

          {/* SENHA */}
          <Text style={styles.label}>SENHA</Text>
          <View style={[styles.inputContainer, erro.senha && styles.inputErro]}>
            <TextInput
              style={styles.inputSenha}
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <MaterialIcons
                name={mostrarSenha ? "visibility" : "visibility-off"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          {erro.senha && <Text style={styles.erro}>{erro.senha}</Text>}

          {/* CONFIRMAR SENHA */}
          <Text style={styles.label}>CONFIRMAR SENHA</Text>
          <View style={[styles.inputContainer, erro.confirmar && styles.inputErro]}>
            <TextInput
              style={styles.inputSenha}
              secureTextEntry={!mostrarSenha}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
          </View>
          {erro.confirmar && <Text style={styles.erro}>{erro.confirmar}</Text>}

          {/* BOTÃO */}
          <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>CADASTRAR</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.voltarBotao}
            onPress={() => router.push('/auth/login')}
            accessibilityRole="button"
            accessibilityLabel="Voltar para login"
          >
            <Text style={styles.voltarTexto}>VOLTAR PARA LOGIN</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0b0b0b',
    paddingTop: 40
  },

  fotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 36,
    overflow: 'hidden'
  },

  foto: {
    width: '100%',
    height: '100%'
  },

  label: {
    color: '#fff',
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginBottom: 6,
    fontSize: 12
  },

  input: {
    width: '90%',
    height: 55,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    padding: 10,
    marginBottom: 20
  },

  inputContainer: {
    width: '90%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 20
  },

  inputSenha: {
    flex: 1,
    color: '#fff'
  },

  inputErro: {
    borderColor: '#ff4d4f'
  },

  erro: {
    color: '#ff4d4f',
    fontSize: 10,
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginTop: -15,
    marginBottom: 10
  },

  botao: {
    width: '90%',
    height: 55,
    borderWidth: 1,
    borderColor: '#F01259',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },

  botaoTexto: {
    color: '#F01259',
    fontWeight: 'bold'
  },

  voltarBotao: {
    width: '90%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24
  },

  voltarTexto: {
    color: '#E1E1E1',
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold'
  }
});