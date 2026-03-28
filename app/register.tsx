import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { registerUser } from '../constants/firebaseFunctions';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage(''); // Limpiar errores

    if (!name || !email || !password || !confirm) {
      setErrorMessage('Por favor completa todos tus datos personales para el registro.');
      return;
    }

    if (password !== confirm) {
      setErrorMessage('Las contraseñas no coinciden. Intenta escribirlas de nuevo.');
      return;
    }

    const result = await registerUser(name, email, password);

    if (result.success) {
      Alert.alert('¡Bienvenido!', 'Tu cuenta ha sido creada exitosamente.');
      router.replace('/login');
    } else {
      setErrorMessage(result.message || 'Hubo un error al registrarte.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Crea tu cuenta</Text>
            <Text style={styles.subtitleText}>Únete a la mejor comunidad de intercambio universitario</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              placeholder="Ej. Juan Pérez"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              value={name}
              onChangeText={(text) => { setName(text); setErrorMessage(''); }}
            />
            
            <Text style={styles.label}>Correo institucional</Text>
            <TextInput
              placeholder="estudiante@universidad.edu"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              value={email}
              onChangeText={(text) => { setEmail(text); setErrorMessage(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              placeholder="Crea una contraseña segura"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={(text) => { setPassword(text); setErrorMessage(''); }}
            />
            
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              placeholder="Vuelve a escribir tu contraseña"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              secureTextEntry
              value={confirm}
              onChangeText={(text) => { setConfirm(text); setErrorMessage(''); }}
            />

            {/* Mensaje de Error en Pantalla */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.linkText}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flexGrow: 1, paddingHorizontal: 30, justifyContent: 'center', paddingVertical: 40 },
  header: { marginBottom: 35 },
  welcomeText: { fontSize: 32, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  subtitleText: { fontSize: 16, color: '#64748b', fontWeight: '500' },
  formContainer: { width: '100%', marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6, marginLeft: 4 },
  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorText: { color: '#ef4444', fontSize: 14, textAlign: 'center', fontWeight: '600' },
  button: {
    backgroundColor: '#6366f1',
    padding: 18,
    borderRadius: 14,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  buttonText: { color: '#ffffff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { fontSize: 15, color: '#64748b' },
  linkText: { fontSize: 15, color: '#6366f1', fontWeight: '700' },
});
