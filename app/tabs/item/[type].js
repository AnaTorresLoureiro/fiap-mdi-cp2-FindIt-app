import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useState, useCallback } from 'react';
import { useReports } from '../../../context/reportContext';
import { formatDateInput } from '../../../utils/dateFormat';
import * as ImagePicker from 'expo-image-picker';

const REPORT_TYPE_CONFIG = {
  found: {
    title: 'ACHADOS',
    objectStateLabel: 'Estado em que o objeto foi encontrado',
    identifierPlaceholder: 'ex., ABC123',
    extraInfoPlaceholder: 'Detalhes importantes...',
  },
  lost: {
    title: 'PERDIDOS',
    objectStateLabel: 'Estado em que o objeto foi deixado',
    identifierPlaceholder: 'ex., ABC123XYZ',
    extraInfoPlaceholder: 'Detalhes que diferenciem o item',
  },
};

function getTypeParam(type) {
  if (Array.isArray(type)) {
    return type[0];
  }

  return type;
}

function createEmptyForm() {
  return {
    object: '',
    color: '',
    identifier: '',
    additionalInfo: '',
    brand: '',
    model: '',
    extraInfo: '',
    local: '',
    time: '',
    photo: null,
  };
}

export default function ReportFormScreen() {
  const { type } = useLocalSearchParams();
  const normalizedType = getTypeParam(type) === 'lost' ? 'lost' : 'found';
  const { addFoundReport, addLostReport } = useReports();
  const submitHandler = normalizedType === 'lost' ? addLostReport : addFoundReport;
  const config = REPORT_TYPE_CONFIG[normalizedType];
  const router = useRouter();

  const [form, setForm] = useState(createEmptyForm());
  const [errors, setErrors] = useState({});

  async function selecionarImagem() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setForm((prev) => ({
        ...prev,
        photo: result.assets[0].uri,
      }));
    }
  }

  const resetForm = useCallback(() => {
    setForm(createEmptyForm());
    setErrors({});
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [resetForm])
  );

  const validateRequiredFields = () => {
    const nextErrors = {};

    if (!form.object.trim()) nextErrors.object = true;
    if (!form.color.trim()) nextErrors.color = true;
    if (!form.local.trim()) nextErrors.local = true;
    if (!form.time.trim()) nextErrors.time = true;

    return nextErrors;
  };

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    if (value.trim()) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: false,
      }));
    }
  };

  const handleSubmit = () => {
    const nextErrors = validateRequiredFields();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    submitHandler({
      object: form.object.trim(),
      color: form.color.trim(),
      identifier: form.identifier.trim(),
      additionalInfo: form.additionalInfo.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      extraInfo: form.extraInfo.trim(),
      local: form.local.trim(),
      time: form.time.trim(),
      photo: form.photo,
    });

    resetForm();
    router.push(`/tabs/success/${normalizedType}`);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.titleText}>{config.title}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="image-outline" size={20} color="#F01259" />
            <Text style={styles.sectionTitle}>Foto do Item</Text>
          </View>

          <TouchableOpacity style={styles.photoButton} onPress={selecionarImagem}>
            {form.photo ? (
              <Image source={{ uri: form.photo }} style={styles.photoPreview} />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={32} color="#F01259" />
                <Text style={styles.photoButtonText}>Adicionar foto</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color="#F01259" />
            <Text style={styles.sectionTitle}>Informações</Text>
          </View>

          <Text style={styles.label}>Objeto</Text>
          <TextInput
            placeholder="ex., Garrafa"
            placeholderTextColor="#888"
            style={[styles.input, errors.object && styles.inputError]}
            value={form.object}
            onChangeText={(value) => updateField('object', value)}
          />
          {errors.object && <Text style={styles.errorText}>Inserir dados</Text>}

          <Text style={styles.label}>{config.objectStateLabel}</Text>
          <TextInput
            placeholder="Quebrado, rasgado, sujo..."
            placeholderTextColor="#888"
            style={styles.textarea}
            multiline
            value={form.additionalInfo}
            onChangeText={(value) => updateField('additionalInfo', value)}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color="#F01259" />
            <Text style={styles.sectionTitle}>Quando e Onde</Text>
          </View>

          <Text style={styles.label}>Data</Text>
          <TextInput
            placeholder="dd/mm/aaaa"
            placeholderTextColor="#888"
            style={[styles.input, errors.time && styles.inputError]}
            value={form.time}
            onChangeText={(value) => updateField('time', formatDateInput(value))}
            keyboardType="numeric"
          />
          {errors.time && <Text style={styles.errorText}>Inserir dados</Text>}

          <Text style={styles.label}>Local</Text>
          <TextInput
            placeholder="Sala 201, Cafeteria..."
            placeholderTextColor="#888"
            style={[styles.input, errors.local && styles.inputError]}
            value={form.local}
            onChangeText={(value) => updateField('local', value)}
          />
          {errors.local && <Text style={styles.errorText}>Inserir dados</Text>}
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetag-outline" size={20} color="#F01259" />
            <Text style={styles.sectionTitle}>Detalhes</Text>
          </View>

          <Text style={styles.label}>Cor</Text>
          <TextInput
            placeholder="ex., Black"
            placeholderTextColor="#888"
            style={[styles.input, errors.color && styles.inputError]}
            value={form.color}
            onChangeText={(value) => updateField('color', value)}
          />
          {errors.color && <Text style={styles.errorText}>Inserir dados</Text>}

          <Text style={styles.label}>Marca</Text>
          <TextInput
            placeholder="ex., Nike"
            placeholderTextColor="#888"
            style={styles.input}
            value={form.brand}
            onChangeText={(value) => updateField('brand', value)}
          />

          <Text style={styles.label}>Modelo</Text>
          <TextInput
            placeholder="ex., Jordan"
            placeholderTextColor="#888"
            style={styles.input}
            value={form.model}
            onChangeText={(value) => updateField('model', value)}
          />

          <Text style={styles.label}>Identificador</Text>
          <TextInput
            placeholder={config.identifierPlaceholder}
            placeholderTextColor="#888"
            style={styles.input}
            value={form.identifier}
            onChangeText={(value) => updateField('identifier', value)}
          />

          <Text style={styles.label}>Informações adicionais</Text>
          <TextInput
            placeholder={config.extraInfoPlaceholder}
            placeholderTextColor="#888"
            style={styles.textarea}
            multiline
            value={form.extraInfo}
            onChangeText={(value) => updateField('extraInfo', value)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar relatório</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#131313',
    padding: 16,
    marginTop: 32
  },

  titleText: {
    fontSize: 32,
    color: '#F01259',
    fontFamily: 'Montserrat_800ExtraBold',
    alignSelf: 'center',
    padding: 16,
  },

  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    marginBottom: 20,
    borderLeftColor: '#F01259',
    borderLeftWidth: 4
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    marginLeft: 8,
  },

  label: {
    color: '#ccc',
    fontFamily: 'Montserrat_500Medium',
    marginBottom: 4,
    marginTop: 10,
  },

  input: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    color: '#fff',
    fontFamily: 'Montserrat_400Regular',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },

  inputError: {
    borderColor: '#ff4d4f',
  },

  textarea: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    height: 100,
    color: '#fff',
    fontFamily: 'Montserrat_400Regular',
    textAlignVertical: 'top',
  },

  errorText: {
    color: '#ff4d4f',
    fontSize: 12,
    fontFamily: 'Montserrat_500Medium',
    marginTop: 4,
  },

  button: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#F01259',
    borderWidth: 2
  },

  buttonText: {
    color: '#F01259',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
  },

  photoButton: {
    width: '100%',
    height: 150,
    borderWidth: 2,
    borderColor: '#F01259',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    overflow: 'hidden',
  },

  photoPreview: {
    width: '100%',
    height: '100%',
  },

  photoButtonText: {
    color: '#F01259',
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    marginTop: 8,
  },
});
