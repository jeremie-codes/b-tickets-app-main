import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Clock } from 'lucide-react-native';
import { TicketType } from '@/types';
import { formatDate, formatTime } from '@/utils/formatters';

interface TicketItemProps {
  ticket: TicketType;
}

export default function TicketItem({ ticket }: TicketItemProps) {
  const handlePress = () => {
    console.log('Ticket pressed:', ticket.id);
    router.push({
      pathname: "/(app)/ticket",
      // params: { ticketId: 1 }
      params: { ticketId: ticket.id }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 border-green-500';
      case 'used':
        return 'bg-gray-500/10 border-gray-500';
      case 'expired':
        return 'bg-red-500/10 border-red-500';
      default:
        return 'bg-gray-500/10 border-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'used':
        return 'text-gray-400';
      case 'expired':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

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
          <View className={`px-3 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
            <Text className={`font-['Montserrat-Medium'] text-xs ${getStatusTextColor(ticket.status)}`}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
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
            {formatTime(ticket.event.time)}
          </Text>
        </View>
      </View>
      
      <View className="p-4 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-400 font-['Montserrat-Regular'] text-xs">
            Ticket ID
          </Text>
          <Text className="text-white font-['Montserrat-Medium']">
            #{ticket.id.substring(0, 8)}...
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