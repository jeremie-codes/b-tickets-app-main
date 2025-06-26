import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, Clock, MapPin, Heart, ShoppingBag } from 'lucide-react-native';
import { getEventById, toggleFavorite, toggleWishlist } from '@/services/api';
import { EventType } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDate, formatTime } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';

export default function EventDetailsScreen() {
  const { triggerFavoritesRefresh, triggerWisshRefresh } = useAuth();
  const { id } = useLocalSearchParams<{ id: any }>();
  const { showNotification } = useNotification();
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWishList, setIsWishList] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      try {
        const data = await getEventById(id);
        setEvent(data);
        setIsFavorite(data.is_favorite);
        setIsWishList(data.is_wishlist);
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
      const result = await toggleFavorite(event.id, isFavorite);
      setIsFavorite(result.isFavorite);
      showNotification(
        result.isFavorite ? 'Évenément ajouté dans favoris' : 'Évenément supprimer dans favoris',
        'success'
      );
      triggerFavoritesRefresh();
    } catch (error) {
      showNotification('Error de mise à jour des favoris', 'error');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleToggleWishList = async () => {
    if (!event) return;
    
    setIsTogglingWishlist(true);
    try {
      const result = await toggleWishlist(event.id, isWishList);
      setIsWishList(result.isWishlist);
      showNotification(
        result.isWishlist ? 'Évenément ajouté dans la list de souhait' : 'Évenément supprimer dans la list de souhait',
        'success'
      );
      triggerWisshRefresh();
    } catch (error) {
      showNotification('Error de mise à jour des souhaits', 'error');
    } finally {
      setIsTogglingWishlist(false);
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
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={{ paddingBottom: 32 }}
      >
      <StatusBar style="light" />
        <View >
          <Image
            source={{ uri: event.media[1].original_url }}
            className="w-full"
            resizeMode='cover'
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
              
              <View className='flex flex-row items-center gap-4'>
                <TouchableOpacity 
                  onPress={handleToggleWishList}
                  disabled={isTogglingWishlist}
                  className="p-2 rounded-full bg-black/30 backdrop-blur-md"
                >
                  {isTogglingWishlist ? (
                    <ActivityIndicator size="small" color="#8b5cf6" />
                  ) : (
                    <ShoppingBag 
                      size={24} 
                      color={isWishList ? "rgb(246, 203, 86)" : "#fff"} 
                      fill={isWishList ? "rgb(190, 141, 6)" : "transparent"} 
                    />
                  )}
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
                      color={isFavorite ? "rgb(255, 43, 43)" : "#fff"} 
                      fill={isFavorite ? "rgb(255, 43, 43)" : "transparent"} 
                    />
                  )}
                </TouchableOpacity>
              </View>
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
              {formatTime(event.time_start)} {' - '} {formatTime(event.time_end)}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <MapPin size={16} color="#8b5cf6" className="mr-2" />
              <Text className="text-gray-300 font-['Montserrat-Regular']">
                {event.location}
              </Text>
            </View>
            
            <View className="flex-row items-center gap-4">
              {event.media[0].original_url ? (
                  <Image
                    source={{ uri: event.media[0].original_url }}
                    resizeMode="cover"
                    className="bg-primary-600 w-12 h-12 rounded-full items-center justify-center mt-3" />
                ) : (
                  <View className="bg-primary-600 w-12 h-12 rounded-full items-center justify-center mt-3">
                    <Text className="text-white font-['Montserrat-Bold'] text-3xl">
                      {event.author_name.charAt(0).toUpperCase() || 'A'}
                    </Text>
                  </View>
                )}

                <View className="justify-center mt-3">
                  <Text className="text-white font-['Montserrat-Medium'] text-lg">
                    {event.author_name}
                  </Text>
                  <Text className="text-gray-400 font-['Montserrat-Regular'] text-md">
                    Organisateur
                  </Text>
                </View>
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
          
          <View className="flex-col justify-between">
            <View>
              <Text className="text-gray-400 font-['Montserrat-Bold'] text-md">
                Prix de billet
              </Text>

              {event.prices.map((price, index) => (
                  <View
                    key={index}
                    className={`p-4 rounded-xl borde bg-background-card border-gray-700 mt-1`}
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-white font-['Montserrat-SemiBold'] text-base">
                          {price.category.charAt(0).toUpperCase() + price.category.slice(1)}
                        </Text>
                        <Text className="text-gray-400 font-['Montserrat-Regular'] text-sm">
                          Billet {price.category}
                        </Text>
                      </View>
                      <Text className="text-white font-['Montserrat-Bold'] text-lg">
                        {price.amount.toFixed(2)} {price.currency.toUpperCase()}
                      </Text>
                    </View>
                  </View>
              ))}
            </View>
            
            <TouchableOpacity
              onPress={handleBookTicket}
              className="bg-primary-600 px-8 py-4 rounded-xl mt-3"
              activeOpacity={0.8}
            >
              <Text className="text-white font-['Montserrat-SemiBold'] text-base text-center">
                Réserver Le Billet
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
    height: 450
  },
  eventCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});