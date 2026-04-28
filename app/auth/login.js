import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const [erroUsuario, setErroUsuario] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // animações
  const animErroUsuario = useRef(new Animated.Value(0)).current;
  const animErroSenha = useRef(new Animated.Value(0)).current;

  function animarErro(anim) {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: -1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function handleLogin() {
    setErroUsuario('');
    setErroSenha('');

    if (!usuario) {
      setErroUsuario('Digite o usuário');
      animarErro(animErroUsuario);
      return;
    }

    if (!senha) {
      setErroSenha('Digite a senha');
      animarErro(animErroSenha);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const loggedIn = login(usuario, senha);

      if (!loggedIn) {
        setErroUsuario('Email ou senha inválidos');
        animarErro(animErroUsuario);
        setLoading(false);
        return;
      }

      setLoading(false);
      router.replace('/tabs');
    }, 1500);
  }

  const botaoDesabilitado = !usuario || !senha || loading;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>

          <Image
            source={require("../../assets/logo-fiap.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.titulo}>
            CONECTE-SE COM SUA{' '}
            <Text style={styles.bold}>JORNADA ACADÊMICA</Text>
          </Text>

          {/* USUÁRIO */}
          <Text style={styles.texto}>USUÁRIO</Text>

          <Animated.View
            style={{
              width: '100%',
              alignItems: 'center',
              transform: [{
                translateX: animErroUsuario.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [-6, 6]
                })
              }]
            }}
          >
            <TextInput
              style={[styles.input, erroUsuario && styles.inputErro]}
              placeholder="Digite seu usuário"
              placeholderTextColor="#aaa"
              value={usuario}
              onChangeText={setUsuario}
            />
          </Animated.View>

          {!!erroUsuario && (
            <Text style={styles.erroTexto}>{erroUsuario}</Text>
          )}

          {/* SENHA */}
          <Text style={styles.texto}>SENHA</Text>

          <>
            <Animated.View
              style={{
                transform: [{
                  translateX: animErroSenha.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-6, 6]
                  })
                }]
              }}
            >
              <View style={[
                styles.inputContainer,
                erroSenha && styles.inputErro
              ]}>
                <TextInput
                  style={styles.inputSenha}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#aaa"
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
            </Animated.View>

            {!!erroSenha && (
              <Text style={styles.erroTexto}>{erroSenha}</Text>
            )}
          </>

          {/* BOTÃO */}
          <TouchableOpacity
            style={[
              styles.botao,
              botaoDesabilitado && styles.botaoDesabilitado
            ]}
            onPress={handleLogin}
            disabled={botaoDesabilitado}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.botaoTexto}>LOGAR</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/signin')}>
            <Text style={styles.link}>
              Não possui uma conta? Cadastre-se
            </Text>
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
    backgroundColor: '#0b0b0b'
  },
  logo: {
    height: 150,
    marginTop: 48,
  },
  titulo: {
    fontSize: 32,
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 32,
    color: '#F01259',
    marginLeft: 24,
    marginRight: 24,
    marginTop: 32
  },
  bold: {
    fontFamily: 'Montserrat_700Bold'
  },
  texto: {
    fontSize: 12,
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat_700Bold',
    color: '#E1E1E1',
    marginLeft: 24,
    marginBottom: 8
  },
  input: {
    width: '90%',
    height: 60,
    padding: 12,
    color: '#fff',
    fontFamily: 'Montserrat_400Regular',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    marginBottom: 36
  },
  botao: {
    borderWidth: 1,
    borderColor: '#F01259',
    width: '90%',
    height: 60,
    padding: 12,
    marginTop: 48,
    justifyContent: 'center',
    marginBottom: 12
  },
  botaoTexto: {
    color: '#F01259',
    alignSelf: 'center',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16
  },
  link: {
    fontSize: 10,
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat_700Bold',
    color: '#E1E1E1',
    marginLeft: 24,
    marginTop: 8
  },
  inputContainer: {
    width: '90%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    marginBottom: 36,
    paddingHorizontal: 12
  },
  inputSenha: {
    flex: 1,
    color: '#fff',
    fontFamily: 'Montserrat_400Regular'
  },
  inputErro: {
    borderColor: '#ff4d4f'
  },
  erroTexto: {
    color: '#ff4d4f',
    fontSize: 10,
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginTop: -30,
    marginBottom: 20
  },
  botaoDesabilitado: {
    opacity: 0.2
  }
});
