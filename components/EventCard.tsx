import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Calendar, MapPin, Heart, User, ShoppingBag, Ticket } from 'lucide-react-native';
import { EventType } from '@/types';
import { formatDate } from '@/utils/formatters';

interface EventCardProps {
  event: EventType;
  featured?: boolean;
}

export default function EventCard({ event, featured = false }: EventCardProps) {
  
  const handlePress = () => {
    if (!event?.id) return;
    router.push({ pathname: '/(app)/event-details', params: { id: event.id } });
  };

  const mediaUrl = event?.media?.[1]?.original_url || event?.media?.[0]?.original_url || null;
  const standardPrice = event?.prices?.find(p => p.category?.toLowerCase() === 'standard');
  const fallbackPrice = event?.prices?.[0];

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.9}
      className={`overflow-hidden rounded-2xl ${featured ? '' : 'flex-row bg-background-card'}`}
      style={styles.card}
    >
      {mediaUrl ? (
        <Image
          source={{ uri: mediaUrl }}
          className={featured ? 'w-full h-40' : 'w-24'}
          style={{ resizeMode: 'cover' }}
        />
      ) : (
        <View className={featured ? 'w-full h-40 bg-gray-900' : 'w-24 bg-gray-900'} />
      )}

      <View className={`p-4 ${!featured && 'flex-1'} bg-background-card`}>
        <Text className="text-white font-['Montserrat-Bold'] text-base mb-1" numberOfLines={2}>
          {event.title || 'Événement'}
        </Text>

        {featured ? (
          <View className="flex-row items-center mb-2">
            <Calendar size={14} color="#8b5cf6" className="mr-2" />
            <Text className="text-gray-300 font-['Montserrat-Regular'] text-sm">
              {formatDate(event.date)}
            </Text>
            <MapPin size={14} color="#8b5cf6" className="ml-2 mr-1" />
            <Text className="text-gray-300 font-['Montserrat-Regular'] text-sm">
              {event.location || 'Non définie'}
            </Text>
          </View>
        ) : (
          <>
            <View className="flex-row items-center mb-1">
              <User size={12} color="#8b5cf6" className="mr-1" />
              <Text className="text-gray-400 font-['Montserrat-Regular'] text-md">
                {event.author_name || 'Anonyme'}
              </Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Calendar size={12} color="#8b5cf6" className="mr-1" />
              <Text className="text-gray-400 font-['Montserrat-Regular'] text-xs">
                {formatDate(event.date)}
              </Text>
              <MapPin size={12} color="#8b5cf6" className="ml-2 mr-1" />
              <Text className="text-gray-400 font-['Montserrat-Regular'] text-xs">
                {event.location || 'Lieu Non définie'}
              </Text>
            </View>
          </>
        )}

        <Text className="text-primary-500 font-['Montserrat-SemiBold']">
          <Ticket size={12} color="#8b5cf6" className="mr-1" />{" "}
          {standardPrice
            ? `${standardPrice.amount.toFixed(2)} ${standardPrice.currency?.toUpperCase()}`
            : fallbackPrice
            ? `${fallbackPrice.amount.toFixed(2)} ${fallbackPrice.currency?.toUpperCase()} ${fallbackPrice.category}`
            : 'Prix indisponible'}
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
