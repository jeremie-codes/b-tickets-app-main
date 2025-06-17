import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotification } from '@/contexts/NotificationContext';
import { router } from 'expo-router';
import { getUserTickets } from '@/services/api';
import { TicketType } from '@/types';
import TicketItem from '@/components/TicketItem';

export default function TicketsScreen() {
  const { showNotification } = useNotification();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'used' | 'expired'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getUserTickets();
        // console.log(data);
        setTickets(data);
        setFilteredTickets(data);
      } catch (error) {
        showNotification('Failed to load tickets', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [selectedFilter]);

  const filterTickets = () => {
    if (selectedFilter === 'all') {
      setFilteredTickets(tickets);
    } else if (selectedFilter === 'active') {
      setFilteredTickets(tickets.filter(ticket => ticket.status === 'active'));
    } else if (selectedFilter === 'used') {
      setFilteredTickets(tickets.filter(ticket => ticket.status === 'used'));
    } else if (selectedFilter === 'expired') {
      setFilteredTickets(tickets.filter(ticket => ticket.status === 'expired'));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="p-6">
        <Text className="text-white font-['Montserrat-Bold'] text-2xl mb-6">
          Mes Tickets
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
          className="mb-4"
        >
          {[
            { id: 'all', name: 'Tout Afficher' },
            { id: 'active', name: 'Actives' },
            { id: 'used', name: 'Utilisés' },
            { id: 'expired', name: 'Expirés' }
          ].map(filter => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id as any)}
              className={`px-4 py-2 rounded-full mr-3 ${
                selectedFilter === filter.id ? 'bg-primary-600' : 'bg-background-card'
              }`}
            >
              <Text 
                className={`font-['Montserrat-Medium'] ${
                  selectedFilter === filter.id ? 'text-white' : 'text-gray-400'
                }`}
              >
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoading ? (
          <View className="h-60 justify-center items-center">
            <ActivityIndicator size="large" color="#8b5cf6" />
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {filteredTickets.length > 0 ? (
              <View className="gap-4">
                {filteredTickets.map(ticket => (
                  <TicketItem key={ticket.id} ticket={ticket} />
                ))}
              </View>
            ) : (
              <View className="h-60 justify-center items-center">
                <Text className="text-white font-['Montserrat-Medium'] text-lg">
                  Aucun tickets trouvé
                </Text>
                <Text className="text-gray-400 font-['Montserrat-Regular'] text-center mt-2">
                  Réservez un événement pour voir vos billets ici
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}