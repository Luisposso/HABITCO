import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getProducts } from '../../constants/firebaseFunctions';

export default function SearchTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = ['Todas', 'Tecnología', 'Libros', 'Útiles', 'Otros'];

  useFocusEffect(
    useCallback(() => {
      const fetchProducts = async () => {
        const res = await getProducts();
        if (res.success && res.data) {
          setProducts(res.data);
        }
      };
      fetchProducts();
    }, [])
  );

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || p.categoria === selectedCategory;
      const min = Number(minPrice);
      const max = Number(maxPrice);
      const matchesMin = minPrice === '' || isNaN(min) || p.precio >= min;
      const matchesMax = maxPrice === '' || isNaN(max) || p.precio <= max;
      return matchesSearch && matchesCategory && matchesMin && matchesMax;
    });
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="¿Qué estás buscando hoy?"
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categorías */}
        <View style={styles.categoriesWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
            {categories.map((cat, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.categoryBadge, selectedCategory === cat && styles.categoryBadgeActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Precios */}
        <Text style={styles.filterLabel}>Rango de Precio</Text>
        <View style={styles.priceFilterContainer}>
          <TextInput 
            style={styles.priceInput}
            placeholder="Desde ($)"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <Text style={styles.priceSeparator}>-</Text>
          <TextInput 
            style={styles.priceInput}
            placeholder="Hasta ($)"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Resultados</Text>
          <Text style={styles.resultCount}>{filteredProducts.length} items</Text>
        </View>

        <View style={styles.grid}>
          {filteredProducts.map((item) => (
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
          {filteredProducts.length === 0 && (
            <View style={styles.emptyContainer}>
               <Text style={styles.noResultsText}>No hay productos que coincidan con tus filtros de búsqueda.</Text>
            </View>
          )}
        </View>

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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 15,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#1e293b' },
  
  categoriesWrapper: { marginBottom: 15 },
  categoriesContainer: { paddingRight: 20 },
  categoryBadge: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryBadgeActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryText: { color: '#64748b', fontWeight: '600', fontSize: 14 },
  categoryTextActive: { color: '#ffffff' },

  filterLabel: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 5 },
  priceFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  priceSeparator: { marginHorizontal: 10, color: '#94a3b8', fontSize: 18 },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  resultCount: { fontSize: 14, color: '#64748b' },

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
  
  emptyContainer: {
    width: '100%',
    padding: 30,
    alignItems: 'center',
  },
  noResultsText: { textAlign: 'center', color: '#64748b', fontSize: 15 },
});
