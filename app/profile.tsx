import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { logoutUser, getUserProfile } from '../constants/firebaseFunctions';
import { auth } from '../constants/firebase';

export default function Profile() {
  const [userName, setUserName] = useState('Cargando...');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserEmail(currentUser.email || '');
        const result = await getUserProfile(currentUser.uid);
        if (result.success && result.data) {
          setUserName(result.data.name || 'Estudiante');
        } else {
          setUserName('Usuario (Sin nombre)');
        }
      } else {
        setUserName('Invitado');
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    router.replace('/');
  };

  const handleEdit = () => {
    Alert.alert('Editar Perfil', 'Pronto podrás editar tu información y foto de perfil.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleEdit} activeOpacity={0.8}>
            <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>✏️</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.major}>{userEmail}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>4.8 / 5.0</Text>
              <Text style={styles.statLabel}>Calificación Promedio</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Productos Publicados</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleEdit} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>Editar Información</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Mis Productos</Text>
        
        {/* Mock user products */}
        <TouchableOpacity style={styles.productCard} activeOpacity={0.8}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop' }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>Libro de Cálculo</Text>
            <Text style={styles.productPrice}>$45.000</Text>
            <Text style={styles.productStatus}>Usado</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: { width: 60 },
  backText: { color: '#6366f1', fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  container: { paddingHorizontal: 20, paddingTop: 30 },
  
  profileSection: { alignItems: 'center', marginBottom: 25 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#6366f1' },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    backgroundColor: '#ffffff',
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  editBadgeText: { fontSize: 14 },
  name: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  major: { fontSize: 15, color: '#64748b', fontWeight: '500', marginBottom: 20 },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#6366f1', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#64748b', textAlign: 'center', fontWeight: '500' },

  actionButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginBottom: 30,
  },
  actionButtonText: { color: '#1e293b', fontSize: 16, fontWeight: '700', textAlign: 'center' },

  divider: { height: 1, backgroundColor: '#e2e8f0', marginBottom: 30 },
  
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 15 },

  productCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    padding: 10,
  },
  productImage: { width: 80, height: 80, borderRadius: 10 },
  productInfo: { marginLeft: 15, flex: 1 },
  productName: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  productPrice: { fontSize: 15, fontWeight: '800', color: '#6366f1', marginBottom: 4 },
  productStatus: { fontSize: 13, color: '#64748b' },

  logoutButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutButtonText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
