import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../constants/firebase';
import { getUserProfile } from '../constants/firebaseFunctions';

const bestSelling = {
  id: '0',
  nombre: 'Calculadora Offi-Esco OE-985',
  precio: '$55.000',
  estado: 'En perfecto estado',
  imagenLocal: require('../assets/images/calculadora.png'),
};

const productos = [
  { id: '1', nombre: 'Libro de Cálculo', precio: '$45.000', estado: 'Usado', imagen: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop' },
  { id: '2', nombre: 'iPad Pro 11"', precio: '$1.800.000', estado: 'Usado', imagen: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop' },
  { id: '3', nombre: 'Audífonos Sony', precio: '$250.000', estado: 'Nuevo', imagen: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop' },
  { id: '4', nombre: 'Mouse Inalámbrico', precio: '$35.000', estado: 'Nuevo', imagen: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop' },
];

export default function Home() {
  const [userName, setUserName] = useState('Estudiante');

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const result = await getUserProfile(currentUser.uid);
        if (result.success && result.data && result.data.name) {
          // Extraer el primer nombre para el saludo
          const firstName = result.data.name.split(' ')[0];
          setUserName(firstName);
        }
      }
    };
    fetchProfile();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {userName} </Text>
          <Text style={styles.subGreeting}>¿Qué buscas hoy?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')} activeOpacity={0.8}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* RF-21 Artículo más vendido */}
        <Text style={styles.sectionTitle}>Artículo más vendido</Text>
        <TouchableOpacity style={styles.heroCard} activeOpacity={0.9}>
          <View style={styles.heroTextContainer}>
            <View style={styles.badgeTop}><Text style={styles.badgeTopText}>🌟 Destacado</Text></View>
            <View style={styles.heroDetails}>
              <Text style={styles.heroName} numberOfLines={2}>{bestSelling.nombre}</Text>
              <Text style={styles.heroStatus}>{bestSelling.estado}</Text>
              <Text style={styles.heroPrice}>{bestSelling.precio}</Text>
            </View>
          </View>
          <Image source={bestSelling.imagenLocal} style={styles.heroImage} resizeMode="contain" />
        </TouchableOpacity>

        {/* RF-15, 16 Publicaciones Recientes */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Publicaciones Recientes</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Ver todo</Text></TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {productos.map((item) => (
            <TouchableOpacity key={item.id} style={styles.productCard} activeOpacity={0.8}>
              <View style={styles.productImageContainer}>
                <Image source={{ uri: item.imagen }} style={styles.productImage} resizeMode="contain" />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.nombre}</Text>
                <Text style={styles.productPrice}>{item.precio}</Text>
                <Text style={styles.productStatus}>{item.estado}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  greeting: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  subGreeting: { fontSize: 14, color: '#64748b', marginTop: 2 },
  profileButton: {
    padding: 2,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 50,
  },
  avatar: { width: 45, height: 45, borderRadius: 25 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 15 },
  
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 170,
    borderRadius: 20,
    marginBottom: 30,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    padding: 20,
    justifyContent: 'space-between'
  },
  heroTextContainer: { flex: 1, height: '100%', justifyContent: 'space-between', paddingRight: 10 },
  heroDetails: { marginTop: 'auto' },
  heroImage: { width: 120, height: '100%' },
  badgeTop: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeTopText: { color: '#d97706', fontWeight: '800', fontSize: 12 },
  heroName: { color: '#0f172a', fontSize: 18, fontWeight: '800', marginBottom: 2 },
  heroPrice: { color: '#6366f1', fontSize: 20, fontWeight: '900', marginTop: 4 },
  heroStatus: { color: '#64748b', fontSize: 13, fontWeight: '500' },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAll: { color: '#6366f1', fontWeight: '600', fontSize: 14 },

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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  productImage: { width: '100%', height: '100%' },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#6366f1', marginBottom: 4 },
  productStatus: { fontSize: 12, color: '#64748b' },
});
