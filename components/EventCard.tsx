import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Calendar, MapPin, Heart } from 'lucide-react-native';
import { EventType } from '@/types';
import { toggleFavorite } from '@/services/api';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDate } from '@/utils/formatters';

interface EventCardProps {
  event: EventType;
  featured?: boolean;
}

export default function EventCard({ event, featured = false }: EventCardProps) {
  const { showNotification } = useNotification();
  const [isFavorite, setIsFavorite] = useState(event.isFavorite);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handlePress = () => {
    console.log(event.id)
    router.push({
      pathname: '/(app)/event-details',
      params: { id: event.id }
    });
  };

  const handleToggleFavorite = async (e: any) => {
    e.stopPropagation();
    
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

  if (featured) {
    return (
      <TouchableOpacity 
        onPress={handlePress} 
        activeOpacity={0.9}
        className="overflow-hidden rounded-2xl"
        style={styles.card}
      >
        <Image
          source={{ uri: event.image }}
          className="w-full h-40"
          style={{ resizeMode: 'cover' }}
        />
        
        <View className="absolute top-2 right-2">
          <TouchableOpacity 
            onPress={handleToggleFavorite}
            disabled={isTogglingFavorite}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md"
          >
            {isTogglingFavorite ? (
              <ActivityIndicator size="small" color="#8b5cf6" />
            ) : (
              <Heart 
                size={18} 
                color={isFavorite ? "#8b5cf6" : "#fff"} 
                fill={isFavorite ? "#8b5cf6" : "transparent"} 
              />
            )}
          </TouchableOpacity>
        </View>
        
        <View className="p-4 bg-background-card">
          <Text className="text-white font-['Montserrat-Bold'] text-lg mb-2">
            {event.title}
          </Text>
          
          <View className="flex-row items-center mb-2">
            <Calendar size={14} color="#8b5cf6" className="mr-2" />
            <Text className="text-gray-300 font-['Montserrat-Regular'] text-sm">
              {formatDate(event.date)}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <MapPin size={14} color="#8b5cf6" className="mr-2" />
            <Text className="text-gray-300 font-['Montserrat-Regular'] text-sm">
              {event.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      activeOpacity={0.9}
      className="flex-row bg-background-card rounded-xl overflow-hidden"
      style={styles.card}
    >
      <Image
        source={{ uri: event.image }}
        className="w-24 h-24"
        style={{ resizeMode: 'cover' }}
      />
      
      <View className="flex-1 p-3">
        <View className="flex-row justify-between">
          <Text className="text-white font-['Montserrat-Bold'] text-base mb-1 flex-1 pr-6">
            {event.title}
          </Text>
          
          <TouchableOpacity 
            onPress={handleToggleFavorite}
            disabled={isTogglingFavorite}
          >
            {isTogglingFavorite ? (
              <ActivityIndicator size="small" color="#8b5cf6" />
            ) : (
              <Heart 
                size={18} 
                color={isFavorite ? "#8b5cf6" : "#9ca3af"} 
                fill={isFavorite ? "#8b5cf6" : "transparent"} 
              />
            )}
          </TouchableOpacity>
        </View>
        
        <View className="flex-row items-center mb-1">
          <Calendar size={12} color="#8b5cf6" className="mr-1" />
          <Text className="text-gray-400 font-['Montserrat-Regular'] text-xs">
            {formatDate(event.date)}
          </Text>
        </View>
        
        <View className="flex-row items-center mb-2">
          <MapPin size={12} color="#8b5cf6" className="mr-1" />
          <Text className="text-gray-400 font-['Montserrat-Regular'] text-xs">
            {event.location}
          </Text>
        </View>
        
        <Text className="text-primary-500 font-['Montserrat-SemiBold']">
          ${event.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});