import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Clock } from 'lucide-react-native';
import { TicketType } from '@/types';
import { formatDate, formatTime } from '@/utils/formatters';
import { useState, useEffect } from 'react';

interface TicketItemProps {
  ticket: TicketType;
}

export default function TicketItem({ ticket }: TicketItemProps) {
  const [state, setState] = useState<string>('')
  const handlePress = () => {
    router.push({
      pathname: "/(app)/ticket",
      params: { ticketId: ticket.id }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 border-green-500';
      case 'utilisé':
        return 'bg-gray-500/10 border-gray-500';
      case 'en attente':
        return 'bg-yellow-500/10 border-yellow-500';
      case 'expiré':
        return 'bg-red-400/10 border-red-400';
      case 'échoué':
        return 'bg-red-500/10 border-red-500';
      default:
        return 'bg-gray-500/10 border-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'en attente':
        return 'text-yellow-400';
      case 'utilisé':
        return 'text-gray-400';
      case 'expiré':
        return 'text-red-400';
      case 'échoué':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  useEffect(() => {

    // const verifyExpire = () => {
    //   const now = new Date();
    //   const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    //   const eventDate = new Date(ticket.event.date);
    //   const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    //   return eventDateOnly < nowDateOnly;
    // }

    if (ticket.used_at === null && ticket.success === 1) {
      setState('active');
    } else if ( ticket.success === null) {
      setState('en attente');
    } else if (ticket.success === 0) {
      setState('échoué');
    } else if (ticket.used_at !== null) {
      setState('utilisé');
    } 
    // else if (ticket.used_at === null && verifyExpire() && ticket.success === 1) {
    //   setState('expiré');
    // }
  }, [])

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      className="bg-background-card rounded-xl overflow-hidden"
      style={styles.card}
    >
      <View className="p-4 border-b border-gray-700">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white font-['Montserrat-Bold'] text-lg">
            {ticket.event.title}
          </Text>
          <View className={`px-3 py-1 rounded-full border ${getStatusColor(state)}`}>
            <Text className={`font-['Montserrat-Medium'] text-xs ${getStatusTextColor(state)}`}>
              {state.charAt(0).toUpperCase() + state.slice(1)}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-2">
          <Calendar size={14} color="#8b5cf6" className="mr-2" />
          <Text className="text-gray-300 font-['Montserrat-Regular']">
            {formatDate(ticket.event.date)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Clock size={14} color="#8b5cf6" className="mr-2" />
          <Text className="text-gray-300 font-['Montserrat-Regular']">
            {formatTime(ticket.event.time_start)}
          </Text>
        </View>
      </View>

      <View className="p-4 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-400 font-['Montserrat-Regular'] text-xs">
            Ticket Réf
          </Text>
          <Text className="text-white font-['Montserrat-Medium']">
            #{ticket.reference.substring(0, 8)}...
          </Text>
        </View>

        <TouchableOpacity
          className="bg-primary-600 px-4 py-2 rounded-lg"
          onPress={handlePress}
        >
          <Text className="text-white font-['Montserrat-SemiBold']">
            Voir le Ticket
          </Text>
        </TouchableOpacity>
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