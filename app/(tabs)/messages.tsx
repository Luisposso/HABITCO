import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Datos de prueba: Conversaciones falsas
const MOCK_CONVERSATIONS = [
  {
    id: '1',
    userName: 'Carlos Ruiz',
    userAvatar: 'https://ui-avatars.com/api/?name=Carlos+Ruiz&background=e2e8f0&color=475569',
    lastMessage: '¿Aún tienes el iPad Pro disponible?',
    time: '12:30 PM',
    unread: 2,
  },
  {
    id: '2',
    userName: 'Maria Gonzalez',
    userAvatar: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=e2e8f0&color=475569',
    lastMessage: 'Perfecto, nos vemos en la biblioteca.',
    time: 'Ayer',
    unread: 0,
  },
  {
    id: '3',
    userName: 'Juan Pérez',
    userAvatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=e2e8f0&color=475569',
    lastMessage: 'Te ofrezco $40.000 por la calculadora, ¿qué dices?',
    time: 'Lunes',
    unread: 1,
  },
  {
    id: '4',
    userName: 'Sofia Arias',
    userAvatar: 'https://ui-avatars.com/api/?name=Sofia+Arias&background=e2e8f0&color=475569',
    lastMessage: 'Gracias por los audífonos, suenan súper bien.',
    time: '15 Mar',
    unread: 0,
  }
];

export default function MessagesTab() {
  const [searchQuery, setSearchQuery] = useState('');

  // RF-64, RF-65: Filtrado reactivo de conversaciones por nombre de usuario.
  const filteredConversations = useMemo(() => {
    return MOCK_CONVERSATIONS.filter(chat => 
      chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleMenuPress = () => {
    Alert.alert('Menú', 'El menú lateral se abriría aquí (En construcción).');
  };

  const handleChatPress = (userName: string) => {
    Alert.alert('Chat', `Abriendo conversación con ${userName}...`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* RF-60, RF-61, RF-62: Custom Header */}
      <View style={styles.header}>
        {/* Menú a la izquierda */}
        <TouchableOpacity style={styles.headerIconContainer} onPress={handleMenuPress}>
          <Ionicons name="menu" size={28} color="#1e293b" />
        </TouchableOpacity>
        
        {/* Título en el centro */}
        <Text style={styles.headerTitle}>Mensajes</Text>

        {/* Foto de perfil a la derecha */}
        <TouchableOpacity style={styles.headerIconContainer}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* RF-63: Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Buscar conversaciones..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Lista de Conversaciones */}
        <View style={styles.listContainer}>
          {filteredConversations.map((chat) => (
            <TouchableOpacity 
              key={chat.id} 
              style={styles.chatCard} 
              activeOpacity={0.7}
              onPress={() => handleChatPress(chat.userName)}
            >
              <Image source={{ uri: chat.userAvatar }} style={styles.chatAvatar} />
              
              <View style={styles.chatInfo}>
                <View style={styles.chatRowBetween}>
                  <Text style={styles.chatUserName} numberOfLines={1}>{chat.userName}</Text>
                  <Text style={[styles.chatTime, chat.unread > 0 && styles.chatTimeUnread]}>{chat.time}</Text>
                </View>
                
                <View style={styles.chatRowBetween}>
                  <Text style={[styles.chatPreview, chat.unread > 0 && styles.chatPreviewUnread]} numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                  {chat.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{chat.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filteredConversations.length === 0 && (
             <View style={styles.emptyContainer}>
               <Text style={styles.noResultsText}>No se encontraron conversaciones con "{searchQuery}".</Text>
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
  
  // Custom Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerIconContainer: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  avatar: { width: 36, height: 36, borderRadius: 18 },

  container: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
  
  // Barra de búsqueda
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#1e293b' },

  // Lista
  listContainer: { paddingBottom: 20 },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  chatAvatar: { width: 55, height: 55, borderRadius: 27.5, marginRight: 15 },
  chatInfo: { flex: 1, justifyContent: 'center' },
  chatRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  
  chatUserName: { fontSize: 16, fontWeight: '700', color: '#0f172a', flex: 1 },
  chatTime: { fontSize: 12, color: '#94a3b8', marginLeft: 10 },
  chatTimeUnread: { color: '#6366f1', fontWeight: 'bold' },
  
  chatPreview: { fontSize: 14, color: '#64748b', flex: 1, paddingRight: 10 },
  chatPreviewUnread: { color: '#1e293b', fontWeight: '600' },
  
  unreadBadge: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },

  emptyContainer: { padding: 40, alignItems: 'center' },
  noResultsText: { fontSize: 15, color: '#64748b', textAlign: 'center' },
});
