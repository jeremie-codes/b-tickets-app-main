import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotification } from '@/contexts/NotificationContext';
import { getFavorites } from '@/services/api';
import { EventType } from '@/types';
import EventCard from '@/components/EventCard';

export default function FavoritesScreen() {
  const { showNotification } = useNotification();
  const [favorites, setFavorites] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        showNotification('Chargement des favoris échoué !', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="p-6">
        <Text className="text-white font-['Montserrat-Bold'] text-2xl mb-6">
          Favories
        </Text>

        {isLoading ? (
          <View className="h-60 justify-center items-center">
            <ActivityIndicator size="large" color="#8b5cf6" />
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {favorites.length > 0 ? (
              <View className="gap-4">
                {favorites.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </View>
            ) : (
              <View className="h-60 justify-center items-center">
                <Text className="text-white font-['Montserrat-Medium'] text-lg">
                  Aucun événement favori trouvé
                </Text>
                <Text className="text-gray-400 font-['Montserrat-Regular'] text-center mt-2">
                  Ajoute des événements à tes favoris pour les retrouver ici.
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}