import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { auth } from '../../constants/firebase';
import { getUserProfile, getUserProducts, deleteProduct } from '../../constants/firebaseFunctions';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileTab() {
  const [userName, setUserName] = useState('Cargando...');
  const [userEmail, setUserEmail] = useState('');
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const fetchProfileAndProducts = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          if (isMounted) setUserEmail(currentUser.email || '');
          const result = await getUserProfile(currentUser.uid);
          if (result.success && result.data) {
            if (isMounted) setUserName(result.data.name || 'Estudiante');
          } else {
            if (isMounted) setUserName('Usuario (Sin nombre)');
          }

          // Fetch products
          if (isMounted) setLoadingProducts(true);
          const prResult = await getUserProducts(currentUser.uid);
          if (prResult.success && prResult.data) {
            if (isMounted) setUserProducts(prResult.data);
          }
          if (isMounted) setLoadingProducts(false);
        } else {
          if (isMounted) setUserName('Invitado');
        }
      };
      fetchProfileAndProducts();
      return () => { isMounted = false; };
    }, [])
  );

  const handleLogout = async () => {
    router.replace('/');
  };

  const handleEdit = () => {
    Alert.alert('Editar Perfil', 'Pronto podrás editar tu información y foto de perfil.');
  };

  const handleDeleteProduct = (id: string) => {
    Alert.alert(
      'Eliminar Publicación',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
             const res = await deleteProduct(id);
             if (res.success) {
               setUserProducts(prev => prev.filter(p => p.id !== id));
               Alert.alert('Éxito', 'Publicación eliminada');
             } else {
               Alert.alert('Error', res.message || 'Error al eliminar');
             }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
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
              <Text style={styles.statNumber}>{userProducts.length}</Text>
              <Text style={styles.statLabel}>Productos Publicados</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleEdit} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>Editar Información</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis Publicaciones</Text>
          <TouchableOpacity onPress={() => router.push('/manage-product')} style={styles.addButton}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Publicar</Text>
          </TouchableOpacity>
        </View>

        {loadingProducts ? (
          <ActivityIndicator size="small" color="#6366f1" style={{ marginVertical: 20 }} />
        ) : userProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={40} color="#cbd5e1" />
            <Text style={styles.emptyText}>No has publicado ningún producto aún.</Text>
          </View>
        ) : (
          userProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image source={{ uri: product.imagen }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{product.nombre}</Text>
                <Text style={styles.productPrice}>${product.precio?.toLocaleString('es-CO')}</Text>
                <View style={styles.productActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => router.push(`/manage-product?id=${product.id}`)}>
                    <Ionicons name="pencil" size={14} color="#2563eb" />
                    <Text style={styles.editBtnText}> Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteProduct(product.id)}>
                    <Ionicons name="trash" size={14} color="#dc2626" />
                    <Text style={styles.deleteBtnText}> Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        <View style={styles.divider} />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
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

  logoutButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutButtonText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  addButton: { flexDirection: 'row', backgroundColor: '#6366f1', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 13, fontWeight: '600', marginLeft: 4 },

  emptyContainer: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#f1f5f9', borderRadius: 12 },
  emptyText: { marginTop: 10, color: '#64748b', fontSize: 14 },

  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  productImage: { width: 90, height: 90 },
  productInfo: { flex: 1, padding: 10, justifyContent: 'space-between' },
  productName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  productPrice: { fontSize: 14, fontWeight: '600', color: '#059669', marginVertical: 4 },
  productActions: { flexDirection: 'row', marginTop: 5 },
  editBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 15, backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  editBtnText: { color: '#2563eb', fontSize: 12, fontWeight: '600' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  deleteBtnText: { color: '#dc2626', fontSize: 12, fontWeight: '600' }
});
