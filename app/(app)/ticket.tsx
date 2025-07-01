import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, Clock, MapPin, Download, Share2 } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { getTicketById } from '@/services/api';
import { TicketType } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDate, formatTime } from '@/utils/formatters';
import { APP_URL } from '@/configs';

export default function TicketScreen() {
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  const [state, setState] = useState<string>('')
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

  useEffect(() => {

    if (ticket) {
      // const verifyExpire = () => {
      //   const now = new Date();
      //   const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      //   const eventDate = new Date(ticket.event.date);
      //   const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

      //   return eventDateOnly < nowDateOnly;
      // }

      if (ticket?.used_at === null && ticket.success === 1) {
        setState('active');
      } else if ( ticket.success === null) {
        setState('en attente');
      } else if (ticket.success === 0) {
        setState('échoué');
      } else if (ticket.used_at !== null) {
        setState('utilisé');
      } 
    }
    
  }, [ticket])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'utilisé':
        return 'text-gray-400';
      case 'en attente':
        return 'text-yellow-500';
      case 'échoué':
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
                </Text>
                <Text className={`font-['Montserrat-SemiBold'] ${getStatusColor(state)}`}>
                  {state.charAt(0).toUpperCase() + state.slice(1)}
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
                  {formatTime(ticket.event.time_start)} {' - '} {formatTime(ticket.event.time_end)}
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
            
            {ticket.qrcode && <View className="items-center p-6 bg-background-elevated">
              <Text className="text-gray-400 font-['Montserrat-Medium'] mb-4 text-center">
                Présentez ce code QR à l'entrée de l'événement
              </Text>
              
              <View className="bg-white p-2 rounded-lg mb-4 h-72 w-72 flex items-center justify-center">
                <Image source={{ uri: `${APP_URL}/${ticket.qrcode}` }} className='w-full h-full' />
                {/* <QRCode
                  value={`${APP_URL}/ticket/${ticket.id}`}
                  size={200}
                  color="#000"
                  backgroundColor="#fff"
                /> */}
              </View>
              
              <Text className="text-gray-300 font-['Montserrat-SemiBold'] text-center">
                Ticket Réf: {ticket.reference} 
              </Text>
            </View>}
            
            {!ticket.qrcode && <View className="items-center p-6 bg-background-elevated">
              <Text className="text-gray-400 font-['Montserrat-Medium'] mb-4 text-center">
                Pas de QrCode disponible pour ce ticket. {`\n`} si la transaction est réussie, le QrCode sera généré.
              </Text>
            </View>}
          </View>

          {/* <View className="flex-row gap-4">
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
              onPress={() => showNotification('Download functionality is not available in this demo', 'info')}
            >
              <Download size={20} color="#fff" className="mr-2" />
              <Text className="text-white font-['Montserrat-SemiBold']">
                Télécharger
              </Text>
            </TouchableOpacity>
          </View> */}
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