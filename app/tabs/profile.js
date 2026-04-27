import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator
} from 'react-native';

import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/authContext';

export default function Perfil() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState(null);

  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setNome(currentUser.nome || '');
      setEmail(currentUser.email || '');
      if (currentUser.foto) {
        setFoto(currentUser.foto);
      }
    }
  }, [currentUser]);

  async function selecionarImagem() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  }

  function handleSalvar() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setEditando(false);
    }, 1000);
  }

  function handleLogout() {
    logout();
    router.replace('/auth/login');
  }

  return (
    <View style={styles.container}>

      {/* FOTO */}
      <TouchableOpacity
        onPress={editando ? selecionarImagem : null}
        style={styles.fotoContainer}
      >
        {foto ? (
          <Image source={{ uri: foto }} style={styles.foto} />
        ) : (
          <MaterialIcons name="person" size={50} color="#fff" />
        )}
      </TouchableOpacity>

      {editando && (
        <Text style={styles.editarFoto}>Alterar foto</Text>
      )}

      {/* NOME */}
      <Text style={styles.label}>NOME</Text>

      {editando ? (
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
      ) : (
        <Text style={styles.texto}>{nome}</Text>
      )}

      {/* EMAIL */}
      <Text style={styles.label}>E-MAIL</Text>
      <Text style={styles.texto}>{email || 'Email não informado'}</Text>

      {/* BOTÕES */}
      {editando ? (
        <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>SALVAR</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.botao}
          onPress={() => setEditando(true)}
        >
          <Text style={styles.botaoTexto}>EDITAR PERFIL</Text>
        </TouchableOpacity>
      )}

      {/* LOGOUT */}
      {!editando && (
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutTexto}>SAIR</Text>
        </TouchableOpacity>
      )}

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b0b0b',
    paddingTop: 60
  },

  fotoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10
  },

  foto: {
    width: '100%',
    height: '100%'
  },

  editarFoto: {
    color: '#F01259',
    marginBottom: 20,
    fontSize: 12
  },

  label: {
    color: '#aaa',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginTop: 20
  },

  texto: {
    color: '#fff',
    fontSize: 16,
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginTop: 4
  },

  input: {
    width: '90%',
    height: 55,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    padding: 10,
    marginTop: 8
  },

  botao: {
    width: '90%',
    height: 55,
    borderWidth: 1,
    borderColor: '#F01259',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },

  botaoTexto: {
    color: '#F01259',
    fontWeight: 'bold'
  },

  logout: {
    marginTop: 20
  },

  logoutTexto: {
    color: '#ff4d4f',
    fontWeight: 'bold'
  }
});