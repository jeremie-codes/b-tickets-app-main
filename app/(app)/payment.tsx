import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react-native';
import { getEventById, processPayment } from '@/services/api';
import { EventType } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';

export default function PaymentScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { showNotification } = useNotification();
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;
      
      try {
        const data = await getEventById(eventId);
        setEvent(data);
      } catch (error) {
        showNotification('Failed to load event details', 'error');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const handlePayment = async () => {
    if (!event) return;

    // Basic validation
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) { 
        showNotification('Remplissez tout les details de votre carte !', 'error');
        return;
      }
    } else if (paymentMethod === 'mobile') {
      if (!mobileNumber) {
        showNotification('Veillez saisir votre numéro de téléphone !', 'error');
        return;
      }
    }

    setIsProcessing(true);
    try {
      const paymentData = {
        eventId: event.id,
        method: paymentMethod,
        ...(paymentMethod === 'card' ? {
          cardNumber,
          cardName,
          cardExpiry,
          cardCvv
        } : {
          mobileNumber
        })
      };

      const result = await processPayment(paymentData);
      router.push({
        pathname: '/(app)/ticket',
        params: { ticketId: result.ticketId }
      });
      showNotification('Paiement effectué avec succès!', 'success');
    } catch (error) {
      showNotification('Paiement échoué', 'error');
    } finally {
      setIsProcessing(false);
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
          Evénement non trouvé !
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
    <SafeAreaView className="flex-1 bg-background-dark">
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 rounded-full bg-background-elevated self-start mb-6"
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white font-['Montserrat-Bold'] text-2xl mb-6">
            Paiement
          </Text>

          <View className="bg-background-card rounded-xl p-4 mb-6">
            <Text className="text-gray-400 font-['Montserrat-Medium'] mb-2">
              Evénement
            </Text>
            <Text className="text-white font-['Montserrat-SemiBold'] text-lg mb-1">
              {event.title}
            </Text>
            <Text className="text-gray-300 font-['Montserrat-Regular'] mb-3">
              {event.date} • {event.time}
            </Text>
            <View className="flex-row justify-between items-center pt-3 border-t border-gray-700">
              <Text className="text-gray-300 font-['Montserrat-Regular']">
                Prix du Ticket 
              </Text>
              <Text className="text-white font-['Montserrat-Bold'] text-lg">
                ${event.price.toFixed(2)}
              </Text>
            </View>
          </View>

          <Text className="text-white font-['Montserrat-Bold'] text-lg mb-4">
            Methode de Paiement
          </Text>

          <View className="flex-row gap-4 mb-6">
            <TouchableOpacity 
              onPress={() => setPaymentMethod('card')}
              className={`flex-1 p-4 rounded-xl flex-row items-center justify-center ${
                paymentMethod === 'card' ? 'bg-primary-600' : 'bg-background-card'
              }`}
            >
              <CreditCard size={20} color={paymentMethod === 'card' ? '#fff' : '#8b5cf6'} className="mr-2" />
              <Text className={`font-['Montserrat-SemiBold'] ${
                paymentMethod === 'card' ? 'text-white' : 'text-gray-300'
              }`}>
                Carte
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setPaymentMethod('mobile')}
              className={`flex-1 p-4 rounded-xl flex-row items-center justify-center ${
                paymentMethod === 'mobile' ? 'bg-primary-600' : 'bg-background-card'
              }`}
            >
              <Smartphone size={20} color={paymentMethod === 'mobile' ? '#fff' : '#8b5cf6'} className="mr-2" />
              <Text className={`font-['Montserrat-SemiBold'] ${
                paymentMethod === 'mobile' ? 'text-white' : 'text-gray-300'
              }`}>
                Mobile
              </Text>
            </TouchableOpacity>
          </View>

          {paymentMethod === 'card' ? (
            <View className="gap-4 mb-8">
              <View>
                <Text className="text-white font-['Montserrat-Medium'] mb-2">Numéro de la Carte</Text>
                <TextInput
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor="#6b7280"
                  className="bg-background-elevated text-white p-4 rounded-xl font-['Montserrat-Regular']"
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>
              
              <View>
                <Text className="text-white font-['Montserrat-Medium'] mb-2">Nom du titulaire de la carte</Text>
                <TextInput
                  value={cardName}
                  onChangeText={setCardName}
                  placeholder="John Doe"
                  placeholderTextColor="#6b7280"
                  className="bg-background-elevated text-white p-4 rounded-xl font-['Montserrat-Regular']"
                />
              </View>
              
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-white font-['Montserrat-Medium'] mb-2">Date d'Expiration</Text>
                  <TextInput
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                    placeholder="MM/YY"
                    placeholderTextColor="#6b7280"
                    className="bg-background-elevated text-white p-4 rounded-xl font-['Montserrat-Regular']"
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                
                <View className="flex-1">
                  <Text className="text-white font-['Montserrat-Medium'] mb-2">CVV</Text>
                  <TextInput
                    value={cardCvv}
                    onChangeText={setCardCvv}
                    placeholder="123"
                    placeholderTextColor="#6b7280"
                    className="bg-background-elevated text-white p-4 rounded-xl font-['Montserrat-Regular']"
                    keyboardType="number-pad"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          ) : (
            <View className="mb-8">
              <Text className="text-white font-['Montserrat-Medium'] mb-2">Numéro de Téléphone</Text>
              <TextInput
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="Entrer votre numéro de téléphone"
                placeholderTextColor="#6b7280"
                className="bg-background-elevated text-white p-4 rounded-xl font-['Montserrat-Regular']"
                keyboardType="phone-pad"
              />
            </View>
          )}

          <TouchableOpacity
            onPress={handlePayment}
            className="bg-primary-600 py-4 rounded-xl w-full items-center"
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-['Montserrat-SemiBold'] text-white text-lg">
                Payer ${event.price.toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}