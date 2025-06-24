import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Heart, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotification } from '@/contexts/NotificationContext';
import { getFavorites, toggleFavorite } from '@/services/api';
import { EventType } from '@/types';
import EventCard from '@/components/EventCard';

export default function FavoritesScreen() {
  const { showNotification } = useNotification();
  const [favorites, setFavorites] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());

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

    const handleRemoveFromFavorite = (item: EventType) => {
      Alert.alert(
        "Supprimer de la Favoris",
        `Êtes-vous sûr de vouloir supprimer "${item.title}" de vos favoris ?`,
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: () => confirmRemoveFromFavorite(item.id)
          }
        ]
      );
    };
  
    const confirmRemoveFromFavorite = async (itemId: number) => {
      setRemovingItems(prev => new Set(prev).add(itemId));
      try {
        await toggleFavorite(itemId, true);
        setFavorites(prev => prev.filter(item => item.id !== itemId));
        showNotification('Supprimé des favoris avec succès !', 'success');
      } catch (error) {
        showNotification('Erreur lors de la suppression', 'error');
      } finally {
        setRemovingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    };
  

    const FavoriteItemCard = ({ item }: { item: EventType }) => (
      <View className="bg-background-card rounded-xl overflow-hidden">
        <EventCard event={item} />
        <View className="p-4 border-t border-gray-700">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-400 font-['Montserrat-Regular'] text-sm">
                Ajouté le {new Date(item.created_at).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleRemoveFromFavorite(item)}
                disabled={removingItems.has(item.id)}
                className="bg-red-500/10 border border-red-500 px-3 py-2 rounded-lg"
              >
                {removingItems.has(item.id) ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <Trash2 size={16} color="#ef4444" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );

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
                  <FavoriteItemCard key={event.id} item={event} />
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