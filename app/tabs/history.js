import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useReports } from '../../context/reportContext';
import { formatDateDisplay } from '../../utils/dateFormat';

function buildDescription(report) {
  const descriptionParts = [report.object, report.color].filter(Boolean);

  if (report.identifier) {
    descriptionParts.push(`identificador ${report.identifier}`);
  }

  if (report.additionalInfo) {
    descriptionParts.push(report.additionalInfo);
  }

  if (descriptionParts.length === 0) {
    return 'Descrição não informada';
  }

  return descriptionParts.join(', ');
}

function buildStatus(report, type) {
  if (report.status) return report.status;

  if (type === 'lost') {
    return 'Aguardando novas informações';
  }

  return 'Aguardando entrega na secretaria';
}

function buildLocationInfo(report, type) {
  const formattedDate = formatDateDisplay(report.time);
  const localAndTime = [report.local, formattedDate].filter(Boolean).join(' em ');

  if (!localAndTime) {
    return type === 'lost'
      ? 'Local da última visualização não informado'
      : 'Local do achado não informado';
  }

  if (type === 'lost') {
    return `Última vez visto em ${localAndTime}`;
  }

  return `Encontrado em ${localAndTime}`;
}

function ReportCard({ report, type }) {
  return (
    <View style={styles.cardItem}>
      <View style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.description}>
          Descrição: {buildDescription(report)}
        </Text>

        <Text style={styles.text}>
          Marca: {report.brand || 'Não informada'}
        </Text>

        <Text style={styles.text}>
          Modelo: {report.model || 'Não informado'}
        </Text>

        <Text style={styles.extra}>
          {report.extraInfo || 'Sem informações adicionais'}
        </Text>

        <Text style={styles.location}>
          {buildLocationInfo(report, type)}
        </Text>

        <Text style={styles.status}>
          {buildStatus(report, type)}
        </Text>
      </View>
    </View>
  );
}

function EmptyState({ message }) {
  return <Text style={styles.emptyText}>{message}</Text>;
}

export default function HistoryScreen() {
  const { foundReports, lostReports } = useReports();
  const [activeTab, setActiveTab] = useState('lost');

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Text
          onPress={() => setActiveTab('lost')}
          style={[
            styles.tab,
            activeTab === 'lost' && styles.tabActive,
          ]}
        >
          PERDIDOS
        </Text>

        <Text
          onPress={() => setActiveTab('found')}
          style={[
            styles.tab,
            activeTab === 'found' && styles.tabActive,
          ]}
        >
          ACHADOS
        </Text>
      </View>
      <ScrollView>
        {activeTab === 'lost' ? (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="help-circle-outline"
                size={22}
                color="#F01259"
              />
              <Text style={styles.sectionTitle}>
                Histórico de perdidos
              </Text>
            </View>

            {lostReports.length === 0 ? (
              <EmptyState message="Nenhum item perdido foi registrado ainda." />
            ) : (
              lostReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  type="lost"
                />
              ))
            )}
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color="#F01259"
              />
              <Text style={styles.sectionTitle}>
                Histórico de achados
              </Text>
            </View>

            {foundReports.length === 0 ? (
              <EmptyState message="Nenhum item encontrado foi registrado ainda." />
            ) : (
              foundReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  type="found"
                />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
    paddingTop: 64,
    paddingHorizontal: 16,
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
    marginBottom: 16,
  },

  tab: {
    color: '#aaa',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    paddingBottom: 6,
  },

  tabActive: {
    color: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#F01259',
  },

  /* CARDS */
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
  },

  cardItem: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
  },

  info: {
    flex: 1,
  },

  description: {
    color: '#fff',
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 4,
  },

  text: {
    color: '#ccc',
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
  },

  extra: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    fontStyle: 'italic',
    marginTop: 2,
  },

  location: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 6,
  },

  status: {
    color: '#F01259',
    fontSize: 12,
    marginTop: 6,
    fontFamily: 'Montserrat_500Medium',
  },

  emptyText: {
    color: '#aaa',
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 8,
  },
});