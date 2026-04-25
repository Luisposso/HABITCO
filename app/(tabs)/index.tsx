import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../constants/firebase';
import { getProducts, getUserProfile, seedProducts } from '../../constants/firebaseFunctions';

export default function HomeTab() {
  const [userName, setUserName] = useState('Estudiante');
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const res = await getProducts();
    if (res.success && res.data) {
      if (res.data.length === 0 || !res.data.some((p: any) => p.nombre === 'Mouse Inalámbrico')) {
        // Auto-seed inteligente para forzar la restauración solicitada
        await seedProducts();
        const newRes = await getProducts();
        if (newRes.success && newRes.data) {
          setProducts(newRes.data);
        }
      } else {
        setProducts(res.data);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const result = await getUserProfile(currentUser.uid);
          if (result.success && result.data && result.data.name) {
            const firstName = result.data.name.split(' ')[0];
            setUserName(firstName);
          }
        }
      };
      fetchProfile();
      fetchProducts();
    }, [])
  );

  // Se eliminó `handleSeed` manual

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {userName} </Text>
          <Text style={styles.subGreeting}>Descubre artículos nuevos hoy</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color="#1e293b" />
            <View style={styles.badge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.8}>
            <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Banner o Hero decorativo */}
        <View style={styles.heroCard}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Mercado Estudiantil</Text>
            <Text style={styles.heroSubtitle}>Compra y vende fácil y seguro con tu comunidad.</Text>
            <TouchableOpacity style={styles.heroButton} onPress={() => router.push('/(tabs)/search')}>
              <Text style={styles.heroButtonText}>Explorar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Publicaciones Recientes</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search')}><Text style={styles.seeAll}>Ver todo</Text></TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {products.slice(0, 6).map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.productCard} 
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
            >
              <View style={styles.productImageContainer}>
                <Image 
                  source={item.imagen === 'local:calculadora.png' ? require('../../assets/images/calculadora.png') : { uri: item.imagen }} 
                  style={styles.productImage} 
                  resizeMode="cover" 
                />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.nombre}</Text>
                <Text style={styles.productPrice}>${item.precio?.toLocaleString('es-CO')}</Text>
                <Text style={styles.productStatus}>{item.estado}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {products.length === 0 && (
             <Text style={{ textAlign: 'center', width: '100%', color: '#64748b' }}>No hay productos por el momento.</Text>
          )}
        </View>

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
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  greeting: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  subGreeting: { fontSize: 14, color: '#64748b', marginTop: 2 },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 50,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
  },
  profileButton: {
    padding: 2,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 50,
  },
  avatar: { width: 45, height: 45, borderRadius: 25 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
  
  heroCard: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTextContainer: { width: '80%' },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 5 },
  heroSubtitle: { fontSize: 14, color: '#e0e7ff', marginBottom: 15 },
  heroButton: { backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignSelf: 'flex-start' },
  heroButtonText: { color: '#6366f1', fontWeight: 'bold' },



  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAll: { color: '#6366f1', fontWeight: '600', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productImageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  productImage: { width: '100%', height: '100%' },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#6366f1', marginBottom: 4 },
  productStatus: { fontSize: 12, color: '#64748b' },
});
