import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, KeyboardAvoidingView} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
export default function Home() {
  const router = useRouter();
  return (
    <View style={styles.container}>
        <Image
        source={require("../../assets/logo-fiap.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titulo}>CONECTE-SE COM SUA JORNADA ACADÊMICA</Text>
        <TextInput style={styles.input}
        placeholderTextColor="#ffffff"
        />
        <TextInput style={styles.input}
        placeholderTextColor="#ffffff"
        />
    </View>
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
        marginTop: 48
    },
    titulo:{
        fontSize: 32,
        fontFamily: 'Montserrat_700Bold',
        marginBottom: 32,
        color: '#F01259',
        marginLeft: 24,
        marginRight: 24,
        marginTop: 32
    },
    texto:{
        fontSize: 12,
        alignSelf: 'center',
        fontFamily: 'Montserrat_400Regular',
        color: '#E1E1E1',
        marginBottom: 50,
        marginLeft: 24,
        marginRight: 24
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
    }
});
