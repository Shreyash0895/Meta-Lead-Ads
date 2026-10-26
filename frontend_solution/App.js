import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import io from 'socket.io-client';

// Replace with your backend URL (e.g. Ngrok HTTPS URL or local IP)
const BACKEND_URL = 'https://xxxx.ngrok-free.app';
export default function App() {
  const [leads, setLeads] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize Socket.io client connection
    const socket = io(BACKEND_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    socket.on('new_lead', (incomingLead) => {
      console.log('New lead event received:', incomingLead);
      setLeads((prevLeads) => [incomingLead, ...prevLeads]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const clearLeads = () => {
    setLeads([]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.leadTag}>META LEAD</Text>
        <Text style={styles.statusBadge}>{item.status}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.fieldLabel}>Lead ID:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Form ID:</Text>
        <Text style={styles.fieldValue}>{item.form_id}</Text>

        <Text style={styles.fieldLabel}>Received At:</Text>
        <Text style={styles.fieldValue}>{item.created_time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meta Lead Stream</Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? '#2e7d32' : '#d32f2f' }
            ]}
          />
          <Text style={styles.statusText}>
            {isConnected ? 'Listening for leads...' : 'Disconnected'}
          </Text>
        </View>
      </View>

      {/* Action Toolbar */}
      {leads.length > 0 && (
        <View style={styles.toolbar}>
          <Text style={styles.countText}>{leads.length} Lead(s) Captured</Text>
          <TouchableOpacity onPress={clearLeads} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear Screen</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Live Lead List */}
      <FlatList
        data={leads}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Leads Received Yet</Text>
            <Text style={styles.emptySubtext}>
              Submit a test lead from Meta Lead Ads Testing Tool to see it appear live here without touching the device.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1f36',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#4f566b',
    fontWeight: '500',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#eef2f6',
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f566b',
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#e0e6ed',
    borderRadius: 4,
  },
  clearBtnText: {
    fontSize: 12,
    color: '#4f566b',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e6eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f3f6',
    paddingBottom: 8,
    marginBottom: 10,
  },
  leadTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0066cc',
    letterSpacing: 0.5,
  },
  statusBadge: {
    fontSize: 11,
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },
  cardBody: {},
  fieldLabel: {
    fontSize: 11,
    color: '#8792a2',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginTop: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: '#1a1f36',
    fontWeight: '500',
    marginBottom: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3c4257',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8792a2',
    textAlign: 'center',
    lineHeight: 20,
  },
});
