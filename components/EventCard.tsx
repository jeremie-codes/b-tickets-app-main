import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Calendar, MapPin, Heart, User, ShoppingBag, Ticket } from 'lucide-react-native';
import { EventType } from '@/types';
import { toggleFavorite } from '@/services/api';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDate } from '@/utils/formatters';

interface EventCardProps {
  event: EventType;
  featured?: boolean;
}

export default function EventCard({ event, featured = false }: EventCardProps) {

  const handlePress = () => {
    router.push({
      pathname: '/(app)/event-details',
      params: { id: event.id }
    });
  };

  const standardPrice = event.prices.find(
    price => price.category.toLowerCase() === 'standard'
  );

  if (featured) {
    return (
      <TouchableOpacity 
        onPress={handlePress} 
        activeOpacity={0.9}
        className="overflow-hidden rounded-2xl"
        style={styles.card}
      >
        <Image
        source={{ uri: event.media[0].original_url }}
          className="w-full h-40"
          style={{ resizeMode: 'cover' }}
        />
        
        <View className="p-4 bg-background-card">
          <Text className="text-white font-['Montserrat-Bold'] text-lg mb-2">
            {event.title}
          </Text>
          
          <View className="flex-row items-center mb-2">
            <Calendar size={14} color="#8b5cf6" className="mr-2" />
            <Text className="text-gray-300 font-['Montserrat-Regular'] text-sm">
              {/* {formatDate(event.date)} {'  '} */}
            </Text>
  
            <MapPin size={14} color="#8b5cf6" className="mr-2" />
            <Text className="text-gray-300 font-['Montserrat-Regular'] text-sm">
              {event.location}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-primary-500 font-['Montserrat-SemiBold']">
              {/* ${event.price.toFixed(2)} */}
              <Ticket size={14} color="#8b5cf6" className="mr-1" /> {"  "}
              {standardPrice ? `${standardPrice.amount.toFixed(2)} ${standardPrice.currency.toUpperCase()}` : `${event.prices[0].amount.toFixed(2)} ${event.prices[0].currency.toUpperCase()}  ${event.prices[0].category}` }
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
        source={{ uri: event.media[0].original_url }}
        className="w-24"
        style={{ resizeMode: 'cover' }}
      />
      
      <View className="flex-1 p-3">
        <View className="flex-row justify-between">
          <Text className="text-white font-['Montserrat-Bold'] text-base mb-1 flex-1 pr-6">
            {event.title}
          </Text>
        </View>
        
        <View className="flex-row items-center mb-1">
          <User size={12} color="#8b5cf6" className="mr-1" />
          <Text className="text-gray-400 font-['Montserrat-Regular'] text-md">
            {event.author_name}
          </Text>
        </View>
        
        <View className="flex-row items-center mb-2">
          <Calendar size={12} color="#8b5cf6" className="mr-1" />
          <Text className="text-gray-400 font-['Montserrat-Regular'] text-xs">
            {formatDate(event.date)} {'  '}
          </Text>
          <MapPin size={12} color="#8b5cf6" className="mr-1" />
          <Text className="text-gray-400 font-['Montserrat-Regular'] text-xs">
            {event.location}
          </Text>
        </View>
        
        <Text className="text-primary-500 font-['Montserrat-SemiBold']">
          {/* ${event.price.toFixed(2)} */}
          <Ticket size={12} color="#8b5cf6" className="mr-1" /> {"  "}
          {standardPrice ? `${standardPrice.amount.toFixed(2)} ${standardPrice.currency.toUpperCase()}` : `${event.prices[0].amount.toFixed(2)} ${event.prices[0].currency.toUpperCase()}  ${event.prices[0].category}` }
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