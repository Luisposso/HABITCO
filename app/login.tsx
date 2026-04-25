import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginUser } from '../constants/firebaseFunctions';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage(''); // Limpiar errores previos

    if (!email || !password) {
      setErrorMessage('Por favor completa todos los campos para ingresar.');
      return;
    }

    const result = await loginUser(email, password);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setErrorMessage(result.message || 'No se pudo iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar contraseña', 'Si el correo existe, enviaremos un enlace de recuperación (Simulación).');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>¡Hola de nuevo!</Text>
          <Text style={styles.subtitleText}>Nos alegra verte, inicia sesión para continuar</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Correo estudiantil</Text>
          <TextInput
            placeholder="Introduce tu correo"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            value={email}
            onChangeText={(text) => { setEmail(text); setErrorMessage(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={(text) => { setPassword(text); setErrorMessage(''); }}
          />

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Mensaje de Error en Pantalla */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Eres nuevo aquí? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.linkText}>Crea tu cuenta</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  header: { marginBottom: 40 },
  welcomeText: { fontSize: 32, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  subtitleText: { fontSize: 16, color: '#64748b', fontWeight: '500' },
  formContainer: { width: '100%', marginBottom: 30 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8, marginLeft: 4 },
  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
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
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { fontSize: 14, color: '#6366f1', fontWeight: '600' },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
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
  },
  buttonText: { color: '#ffffff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 15, color: '#64748b' },
  linkText: { fontSize: 15, color: '#6366f1', fontWeight: '700' },
});
