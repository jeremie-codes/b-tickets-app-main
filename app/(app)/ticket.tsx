import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, Clock, MapPin, Download, Share2 } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { getTicketById } from '@/services/api';
import { TicketType } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDate, formatTime } from '@/utils/formatters';

export default function TicketScreen() {
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  // const ticketId = '12';
  const { showNotification } = useNotification();
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTicket = async () => {
      if (!ticketId) return;
      
      try {
        const data = await getTicketById(ticketId);
        setTicket(data);
      } catch (error) {
        showNotification('Failed to load ticket', 'error');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadTicket();
  }, [ticketId]);

  const getStatusColor = (status: string) => {
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

  const handleShare = () => {
    showNotification('Sharing functionality is not available in this demo', 'info');
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-dark justify-center items-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View className="flex-1 bg-background-dark justify-center items-center p-6">
        <Text className="text-white font-['Montserrat-Medium'] text-lg text-center">
          Ticket non trouvé !
        </Text>
        <TouchableOpacity 
          onPress={() => router.push('/(app)/(tabs)/tickets')}
          className="mt-4 bg-primary-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-['Montserrat-SemiBold']">
            Retourner vers Tickets
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-6 mt-8">
          <TouchableOpacity 
            onPress={() => router.push('/(app)/(tabs)/tickets')}
            className="p-2 rounded-full bg-background-elevated self-start mb-6"
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white font-['Montserrat-Bold'] text-2xl mb-6">
            Votre Ticket
          </Text>

          <View className="bg-background-card rounded-xl overflow-hidden mb-6" style={styles.ticketCard}>
            <View className="p-5 border-b border-gray-700">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white font-['Montserrat-Bold'] text-xl">
                  {ticket.event.title}
                  {/* Concert Humanitaire  */}
                </Text>
                <Text className={`font-['Montserrat-SemiBold'] ${getStatusColor(ticket.status)}`}>
                {/* <Text className={`font-['Montserrat-SemiBold'] text-green-400`}> */}
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  {/* Non utiliser */}
                </Text>
              </View>
              
              <View className="flex-row items-center mb-2">
                <Calendar size={16} color="#8b5cf6" className="mr-2" />
                <Text className="text-gray-300 font-['Montserrat-Regular']">
                  {formatDate(ticket.event.date)}
                  {/* Octob. 12, 2023 */}
                </Text>
              </View>
              
              <View className="flex-row items-center mb-2">
                <Clock size={16} color="#8b5cf6" className="mr-2" />
                <Text className="text-gray-300 font-['Montserrat-Regular']">
                  {formatTime(ticket.event.time)} 
                  {/* 10:00 AM */}
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <MapPin size={16} color="#8b5cf6" className="mr-2" />
                <Text className="text-gray-300 font-['Montserrat-Regular']">
                  {ticket.event.location}
                  {/* Kinshsa, Centre culturel */}
                </Text>
              </View>
            </View>
            
            <View className="items-center p-6 bg-background-elevated">
              <Text className="text-gray-400 font-['Montserrat-Medium'] mb-4 text-center">
                Présentez ce code QR à l'entrée de l'événement
              </Text>
              
              <View className="bg-white p-4 rounded-lg mb-4">
                {/* <QRCode
                  value={"numero ticket"}
                  size={200}
                  color="#000"
                  backgroundColor="#fff"
                /> */}
                <QRCode
                  value={ticket.qrCode}
                  size={200}
                  color="#000"
                  backgroundColor="#fff"
                />
              </View>
              
              <Text className="text-gray-300 font-['Montserrat-SemiBold'] text-center">
                Ticket ID: {ticket.id} 
                {/* 123456789 */}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <TouchableOpacity 
              className="flex-1 bg-background-card py-4 rounded-xl flex-row items-center justify-center"
              onPress={handleShare}
            >
              <Share2 size={20} color="#8b5cf6" className="mr-2" />
              <Text className="text-white font-['Montserrat-SemiBold']">
                Partager
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-primary-600 py-4 rounded-xl flex-row items-center justify-center"
              // onPress={() => showNotification('Download functionality is not available in this demo', 'info')}
            >
              <Download size={20} color="#fff" className="mr-2" />
              <Text className="text-white font-['Montserrat-SemiBold']">
                Télécharger
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  ticketCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});