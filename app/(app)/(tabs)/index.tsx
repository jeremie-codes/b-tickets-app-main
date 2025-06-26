import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { getEvents, getEventsPopular } from '@/services/api';
import { EventType } from '@/types';
import EventCard from '@/components/EventCard';
import { useNotification } from '@/contexts/NotificationContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [featuredEvents, setFeaturedEvents] = useState<EventType[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      const datap = await getEventsPopular();

      setUpcomingEvents(Array.isArray(data) ? data : []);
      setFeaturedEvents(Array.isArray(datap) ? datap : []);
    } catch (error) {
      showNotification('Chargement des événements échoué !', 'error');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8b5cf6"
            colors={["#8b5cf6"]}
          />
        }
      >
        {isLoading || !user ? (
          <View className="h-60 justify-center items-center">
            <ActivityIndicator size="large" color="#8b5cf6" />
          </View>
        ) : (
          <View className="p-6">
            {/* Header */}
            <View className="flex flex-row justify-between items-center mb-8">
              <View>
                <Text className="text-gray-400 font-['Montserrat-Medium'] text-base">
                  Bienvenue à nouveau,
                </Text>
                <Text className="text-white font-['Montserrat-Bold'] text-2xl">
                  {user?.name || 'Anonyme'}
                </Text>
              </View>
              <View className="w-16">
                <Image
                  source={require('@/assets/images/logo.png')}
                  className="absolue w-full"
                  style={{ height: 40 }}
                />
              </View>
            </View>

            {/* Événements à la une */}
            <View className="mb-8">
              <Text className="text-white font-['Montserrat-Bold'] text-xl mb-4">
                Événements à la une
              </Text>
              {featuredEvents.length === 0 ? (
                <Text className="text-gray-400 font-['Montserrat-Regular']">
                  Aucun événement en vedette pour l’instant.
                </Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {featuredEvents.map((event) => (
                    <View key={event.id} className="mr-4" style={{ width: 280 }}>
                      <EventCard event={event} featured />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Événements à venir */}
            <View>
              <Text className="text-white font-['Montserrat-Bold'] text-xl mb-4">
                Événements à venir
              </Text>
              {upcomingEvents.length === 0 ? (
                <Text className="text-gray-400 font-['Montserrat-Regular']">
                  Aucun événement prévu pour le moment.
                </Text>
              ) : (
                <View className="gap-4">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
