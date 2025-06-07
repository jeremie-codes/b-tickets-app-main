import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, Clock, MapPin, Heart } from 'lucide-react-native';
import { getEventById, toggleFavorite } from '@/services/api';
import { EventType } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDate, formatTime } from '@/utils/formatters';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showNotification } = useNotification();
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      // console.log('details : ',id)
      if (!id) return;
      
      try {
        const data = await getEventById(id);
        setEvent(data);
        setIsFavorite(data.isFavorite);
      } catch (error) {
        showNotification('Erreur de chargement de l\'evénément !', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!event) return;
    
    setIsTogglingFavorite(true);
    try {
      const result = await toggleFavorite(event.id);
      setIsFavorite(result.isFavorite);
      showNotification(
        result.isFavorite ? 'Ajouté dans favoris' : 'Supprimer dans favoris',
        'success'
      );
    } catch (error) {
      showNotification('Error de mise à jour vers favoris', 'error');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleBookTicket = () => {
    if (event) {
      router.push({
        pathname: '/(app)/payment',
        params: { eventId: event.id }
      });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-dark justify-center items-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 bg-background-dark justify-center items-center p-6">
        <Text className="text-white font-['Montserrat-Medium'] text-lg text-center">
          Evénément non trouvé
        </Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4 bg-primary-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-['Montserrat-SemiBold']">
            Revenir en arrière
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-dark">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image
            source={{ uri: event.image }}
            className="w-full h-72"
            style={styles.heroImage}
          />
          
          <SafeAreaView className="absolute w-full">
            <View className="flex-row justify-between items-center p-6">
              <TouchableOpacity 
                onPress={() => router.back()}
                className="p-2 rounded-full bg-black/30 backdrop-blur-md"
              >
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className="p-2 rounded-full bg-black/30 backdrop-blur-md"
              >
                {isTogglingFavorite ? (
                  <ActivityIndicator size="small" color="#8b5cf6" />
                ) : (
                  <Heart 
                    size={24} 
                    color={isFavorite ? "#8b5cf6" : "#fff"} 
                    fill={isFavorite ? "#8b5cf6" : "transparent"} 
                  />
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
        
        <View className="p-6">
          <View className="bg-background-card rounded-3xl p-5 -mt-8 mb-6" style={styles.eventCard}>
            <Text className="text-white font-['Montserrat-Bold'] text-2xl mb-2">
              {event.title}
            </Text>
            
            <View className="flex-row items-center mb-2">
              <Calendar size={16} color="#8b5cf6" className="mr-2" />
              <Text className="text-gray-300 font-['Montserrat-Regular']">
                {formatDate(event.date)}
              </Text>
            </View>
            
            <View className="flex-row items-center mb-2">
              <Clock size={16} color="#8b5cf6" className="mr-2" />
              <Text className="text-gray-300 font-['Montserrat-Regular']">
                {formatTime(event.time)}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <MapPin size={16} color="#8b5cf6" className="mr-2" />
              <Text className="text-gray-300 font-['Montserrat-Regular']">
                {event.location}
              </Text>
            </View>
          </View>
          
          <View className="mb-6">
            <Text className="text-white font-['Montserrat-Bold'] text-xl mb-4">
              Déscription de l'Événement
            </Text>
            <Text className="text-gray-300 font-['Montserrat-Regular'] leading-6">
              {event.description}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-400 font-['Montserrat-Regular']">
                Price
              </Text>
              <Text className="text-white font-['Montserrat-Bold'] text-2xl">
                ${event.price.toFixed(2)}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleBookTicket}
              className="bg-primary-600 px-8 py-4 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-white font-['Montserrat-SemiBold'] text-base">
                Réserver le Ticket
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    resizeMode: 'cover',
  },
  eventCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});