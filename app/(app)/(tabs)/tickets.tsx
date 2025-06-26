import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotification } from '@/contexts/NotificationContext';
import { router } from 'expo-router';
import { ArrowDownToLine, RefreshCcw , ChevronsDown} from 'lucide-react-native';
import { getUserTickets } from '@/services/api';
import { TicketType } from '@/types';
import TicketItem from '@/components/TicketItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedIcon = Animated.createAnimatedComponent(ChevronsDown);

export default function TicketsScreen() {
  const { showNotification } = useNotification();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'pending' | 'failed' | 'used' | 'expired'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const bounce = useSharedValue(0);

  // Démarre l'animation
  useEffect(() => {
    if (showGuide) {
      bounce.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        true
      );
    }
  }, [showGuide]);

  useEffect(() => {
    const checkGuide = async () => {
      setShowGuide(true);
        setTimeout(async () => {
          setShowGuide(false);
        }, 5000);
    };
    checkGuide();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await getUserTickets();
      setTickets(data);
      if(filteredTickets.length === 0) setFilteredTickets(data);
    } catch (error) {
      showNotification('Failed to load tickets', 'error');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadTickets();
  }, []);

  // Pour un rafraîchissement manuel si besoin
  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
  };

  useEffect(() => {
    filterTickets();
  }, [selectedFilter]);

  // const verifyExpire = (ticket: any) => {
  //   const now = new Date();
  //   const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  //   const eventDate = new Date(ticket.event.date);
  //   const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

  //   return eventDateOnly < nowDateOnly;
  // }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const filterTickets = () => {
    if (selectedFilter === 'all') {
      setFilteredTickets(tickets);
    } else if (selectedFilter === 'active') {
      setFilteredTickets(tickets.filter(ticket => ticket.used_at === null && ticket.success === 1));
    } else if (selectedFilter === 'pending') {
      setFilteredTickets(tickets.filter(ticket => ticket.success === null));
    } else if (selectedFilter === 'used') {
      setFilteredTickets(tickets.filter(ticket => ticket.used_at !== null));
    } else if (selectedFilter === 'failed') {
      setFilteredTickets(tickets.filter(ticket => ticket.success === 0));
    } 
    // else if (selectedFilter === 'expired') {
    //   setFilteredTickets(
    //     tickets.filter(ticket => {
    //       return ticket.used_at === null && verifyExpire(ticket) && ticket.success === 1;
    //     })
    //   );
    // }
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
          className="mb-4">
          {[
            { id: 'all', name: 'Tous' },
            { id: 'active', name: 'Active' },
            { id: 'pending', name: 'En attente' },
            { id: 'used', name: 'Utilisé' },
            { id: 'failed', name: 'Échoué' },
          ].map(filter => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id as any)}
              className={`px-4 h-8 flex-row items-center rounded-full mr-3 ${
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

       {showGuide && (
        <View className="absolute top-16 self-center items-center z-50">
          <AnimatedIcon
            size={40}
            color="white"
            style={animatedStyle}
          />
          <Text className="mt-1 px-3 py-1 text-white bg-black/80 rounded-md text-sm">
            Glissez vers le bas pour actualiser
          </Text>
        </View>
      )}

        {isLoading ? (
          <View className="h-60 justify-center items-center">
            <ActivityIndicator size="large" color="#8b5cf6" />
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
             refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  tintColor="#8b5cf6"
                  colors={["#8b5cf6"]}
                />
              }
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