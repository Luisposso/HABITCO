import { router } from 'expo-router';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop' }} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Text style={styles.title}>HABITO</Text>
              <Text style={styles.subtitle}>
                La plataforma de compra, venta e intercambio exclusiva para tu comunidad estudiantil.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => router.push('/login')}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonTextPrimary}>Iniciar Sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => router.push('/register')}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonTextSecondary}>Crear Cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)', // Tono azul oscuro/negro
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30,
    paddingTop: 80,
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: '#e2e8f0',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  buttonPrimary: {
    backgroundColor: '#6366f1', // Indigo premium
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonTextPrimary: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  buttonTextSecondary: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
