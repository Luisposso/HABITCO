import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const dummyNotifications = [
  { 
    id: '1', 
    title: 'Nuevo mensaje', 
    description: 'Carlos te ha enviado un mensaje sobre "Libro Cálculo".', 
    time: 'Hace 5 min',
    read: false,
    icon: 'chatbubble-outline' as const,
    color: '#3b82f6'
  },
  { 
    id: '2', 
    title: 'Producto rebajado', 
    description: 'El "Mouse Inalámbrico" que guardaste ahora cuesta menos.', 
    time: 'Hace 2 horas',
    read: true,
    icon: 'pricetag-outline' as const,
    color: '#10b981'
  },
  { 
    id: '3', 
    title: 'Alerta de seguridad', 
    description: 'Nuevo inicio de sesión detectado en un nuevo dispositivo.', 
    time: 'Hace 1 día',
    read: true,
    icon: 'shield-checkmark-outline' as const,
    color: '#f59e0b'
  },
];

export default function NotificationsScreen() {
  const renderItem = ({ item }: { item: typeof dummyNotifications[0] }) => (
    <TouchableOpacity style={[styles.notificationCard, !item.read && styles.unreadCard]} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, !item.read && styles.unreadText]}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={dummyNotifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyText}>No tienes notificaciones</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  unreadCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  unreadText: {
    color: '#1e293b',
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500',
  },
});
