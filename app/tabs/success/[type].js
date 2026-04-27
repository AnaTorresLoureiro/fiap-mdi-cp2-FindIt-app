import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const SCREEN_CONTENT = {
  found: {
    title: 'Obrigado por informar o item encontrado!',
    description:
      'Para que possamos ajudar a localizar o dono, pedimos que o objeto seja entregue na secretaria do 6º andar dentro do prazo de 24 horas. Caso o item não seja entregue nesse período, o relatório será desconsiderado.',
  },
  lost: {
    title: 'Sentimos muito pelo ocorrido!',
    description:
      'Sua solicitação foi registrada e ajudará a comunidade a identificar possíveis itens encontrados no campus. Fique de olho pelo aplicativo para verificar se alguma descrição corresponde ao seu item. Caso alguém encontre o objeto, a secretaria entrará em contato para orientar sobre a retirada.',
  },
};

function getTypeParam(type) {
  if (Array.isArray(type)) {
    return type[0];
  }

  return type;
}

export default function ReportSuccessScreen() {
  const { type } = useLocalSearchParams();
  const normalizedType = getTypeParam(type) === 'lost' ? 'lost' : 'found';
  const content = SCREEN_CONTENT[normalizedType];

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/logo-fiap.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.description}>{content.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#131313',
    paddingHorizontal: 16,
  },
  logo: {
    height: 80,
    alignSelf: 'flex-end'
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 16,
    color: '#E1E1E1',
    alignSelf: 'stretch',
  },
  description: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#E1E1E1',
    marginBottom: 50,
    alignSelf: 'stretch',
  },
});
