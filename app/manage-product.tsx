import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../constants/firebase';
import { addProduct, updateProduct, getProductById, uploadImageAsync } from '../constants/firebaseFunctions';
import { Ionicons } from '@expo/vector-icons';

export default function ManageProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.id as string | undefined;

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Tecnología');
  const [estado, setEstado] = useState('Nuevo');
  const [imagen, setImagen] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const categories = ['Tecnología', 'Libros', 'Útiles', 'Ropa', 'Otros'];
  const conditions = ['Nuevo', 'Usado'];

  useEffect(() => {
    if (productId) {
      loadProductData();
    }
  }, [productId]);

  const loadProductData = async () => {
    setInitialLoading(true);
    const result = await getProductById(productId!);
    if (result.success && result.data) {
      const p = result.data;
      setNombre(p.nombre || '');
      setPrecio(p.precio ? p.precio.toString() : '');
      setDescripcion(p.descripcion || '');
      setCategoria(p.categoria || 'Otros');
      setEstado(p.estado || 'Usado');
      setImagen(p.imagen || null);
    } else {
      Alert.alert('Error', 'No se pudo cargar el producto');
      router.back();
    }
    setInitialLoading(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!nombre || !precio || !descripcion || !imagen) {
      Alert.alert('Incompleto', 'Por favor, llena todos los campos y selecciona una imagen.');
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No estás autenticado');

      let imageUrl = imagen;
      
      // Si la imagen no es de firebase/storage asume que es local y hay que subirla
      if (!imagen.startsWith('http') || imagen.includes('file://')) {
        imageUrl = await uploadImageAsync(imagen);
      }

      const productData = {
        nombre,
        precio: parseFloat(precio),
        descripcion,
        categoria,
        estado,
        imagen: imageUrl,
        sellerId: currentUser.uid,
        sellerEmail: currentUser.email,
        sellerName: currentUser.displayName || 'Usuario', // O podemos consultar la DB si lo deseamos
        updatedAt: new Date().toISOString()
      };

      if (productId) {
        await updateProduct(productId, productData);
        Alert.alert('Éxito', 'El producto ha sido actualizado.', [{ text: 'OK', onPress: () => router.back() }]);
      } else {
        const result = await addProduct({ ...productData, createdAt: new Date().toISOString() });
        if (result.success) {
          Alert.alert('Éxito', 'El producto ha sido publicado.', [{ text: 'OK', onPress: () => router.back() }]);
        } else {
          Alert.alert('Error', result.message || 'Error al publicar');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{productId ? 'Editar Producto' : 'Publicar Producto'}</Text>
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imagen ? (
            <Image source={{ uri: imagen }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={40} color="#94a3b8" />
              <Text style={styles.imagePlaceholderText}>Subir Foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre del artículo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Libro de Cálculo"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Precio ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 45000"
            keyboardType="numeric"
            value={precio}
            onChangeText={setPrecio}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.selectorButton, categoria === cat && styles.selectorButtonActive]}
                onPress={() => setCategoria(cat)}
              >
                <Text style={[styles.selectorText, categoria === cat && styles.selectorTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Estado</Text>
          <View style={{ flexDirection: 'row' }}>
            {conditions.map((cond) => (
              <TouchableOpacity
                key={cond}
                style={[styles.selectorButton, estado === cond && styles.selectorButtonActive, { marginRight: 10 }]}
                onPress={() => setEstado(cond)}
              >
                <Text style={[styles.selectorText, estado === cond && styles.selectorTextActive]}>{cond}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalla el estado, si incluye accesorios, etc."
            multiline
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSave} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>{productId ? 'Guardar Cambios' : 'Publicar Ahora'}</Text>
          )}
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20, backgroundColor: '#f8fafc', flexGrow: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: { alignItems: 'center' },
  imagePlaceholderText: { marginTop: 8, color: '#64748b', fontWeight: '500' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1e293b'
  },
  textArea: { height: 100 },
  selectorContainer: { flexDirection: 'row' },
  selectorButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  selectorButtonActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1'
  },
  selectorText: { color: '#64748b', fontWeight: '600' },
  selectorTextActive: { color: '#4f46e5' },
  submitButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
