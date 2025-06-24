import { useState, useEffect, useRef } from 'react';
import { View, Text, Platform, KeyboardAvoidingView, TextInput, TouchableOpacity, ScrollView, Modal, Animated, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, CreditCard, Smartphone, Plus, Minus, Currency } from 'lucide-react-native';
import { getEventById, processPayment, getPayToken } from '@/services/api';
import { EventType, EventPrice } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';
import { formatDate, formatTime } from '@/utils/formatters';
import { WebView } from 'react-native-webview';
import { APP_URL } from '@/configs/index';
const { height } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { showNotification } = useNotification();
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [tickectId, setTickectId] = useState<number | null>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Ticket selection state
  const [selectedPriceCategory, setSelectedPriceCategory] = useState<EventPrice | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;
      
      try {
        const data = await getEventById(eventId);
        setEvent(data);
        if (data.prices && data.prices.length > 0) {
          setSelectedPriceCategory(data.prices[0]);
        }
      } catch (error) {
        showNotification('Failed to load event details', 'error');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setTicketQuantity(prev => Math.min(prev + 1, 10)); // Max 10 tickets
    } else {
      setTicketQuantity(prev => Math.max(prev - 1, 1)); // Min 1 ticket
    }
  };

  const getTotalPrice = () => {
    if (!selectedPriceCategory) return 0;
    return selectedPriceCategory.amount * ticketQuantity;
  };

  const redirectToTicket = (idTicket: number) => {
    router.push({
      pathname: '/(app)/ticket',
      params: { ticketId: idTicket }
    });
  }

  const handlePayment = async () => {
    if (!event || !selectedPriceCategory) return;

    // Basic validation
    if (paymentMethod === 'mobile') {
      if (!mobileNumber) {
        showNotification('Veuillez saisir votre numéro de téléphone !', 'error');
        return;
      }
    }

    setIsProcessing(true);
    try {
      const paymentData = {
        event_id: event.id,
        amount: selectedPriceCategory.amount,
        currency: selectedPriceCategory.currency.toUpperCase(),
        quantity: ticketQuantity,
        price_id: selectedPriceCategory.id,
        type: paymentMethod,
        phone: paymentMethod == 'mobile' ? mobileNumber : undefined
      };

      const result = await processPayment(paymentData);
      setTickectId(result.data.data.original.data.id);
      
      if (paymentMethod == 'card') {
        setPaymentUrl(result.data.redirect.url)
        openModal()
      }
      else {
        redirectToTicket(result.data.data.original.data.id)
      }

      showNotification('Réservation effectué, veillez finaliser votre paiement !', 'success');
    } catch (error) {
      showNotification('Réservation échoué', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhoneChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, '');
    setMobileNumber(digitsOnly);

    if (digitsOnly.length != 12 && !digitsOnly.startsWith('243') && digitsOnly != "" || digitsOnly.length == 12 && !digitsOnly.startsWith('243') && digitsOnly != "") {
      setError("Le numéro doit commencer par '243'");
    } else {
      setError('');
    }
  };

  const openModal = () => {
    setShowModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
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
          Événement non trouvé !
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
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
              Réservation de Billets
            </Text>

            {/* Event Info */}
            <View className="bg-background-card rounded-xl p-4 mb-6">
              <Text className="text-gray-400 font-['Montserrat-Medium'] mb-2">
                Événement
              </Text>
              <Text className="text-white font-['Montserrat-SemiBold'] text-lg mb-1">
                {event.title}
              </Text>
              <Text className="text-gray-300 font-['Montserrat-Regular'] mb-3">
                {formatDate(event.date)} • {formatDate(event.time_start)}
              </Text>
            </View>

            {/* Ticket Type Selection */}
            <View className="mb-6">
              <Text className="text-white font-['Montserrat-Bold'] text-lg mb-4">
                Type de Billet
              </Text>
              <View className="gap-3">
                {event.prices.map((price) => (
                  <TouchableOpacity
                    key={price.id}
                    onPress={() => setSelectedPriceCategory(price)}
                    className={`p-4 rounded-xl border-2 mt-1 ${
                      selectedPriceCategory?.id === price.id
                        ? 'bg-primary-600/20 border-primary-600'
                        : 'bg-background-card border-gray-700'
                    }`}
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
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quantity Selection */}
            <View className="mb-6">
              <Text className="text-white font-['Montserrat-Bold'] text-lg mb-4">
                Nombre de Billets
              </Text>
              <View className="bg-background-card rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(false)}
                    className="w-10 h-10 bg-background-elevated rounded-full items-center justify-center"
                    disabled={ticketQuantity <= 1}
                  >
                    <Minus size={20} color={ticketQuantity <= 1 ? "#6b7280" : "#fff"} />
                  </TouchableOpacity>
                  
                  <View className="items-center">
                    <Text className="text-white font-['Montserrat-Bold'] text-2xl">
                      {ticketQuantity}
                    </Text>
                    <Text className="text-gray-400 font-['Montserrat-Regular'] text-sm">
                      {ticketQuantity === 1 ? 'billet' : 'billets'}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(true)}
                    className="w-10 h-10 bg-background-elevated rounded-full items-center justify-center"
                    disabled={ticketQuantity >= 10}
                  >
                    <Plus size={20} color={ticketQuantity >= 10 ? "#6b7280" : "#fff"} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Total Price */}
            <View className="bg-background-card rounded-xl p-4 mb-6">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-300 font-['Montserrat-Regular']">
                  Total ({ticketQuantity} {ticketQuantity === 1 ? 'billet' : 'billets'})
                </Text>
                <Text className="text-white font-['Montserrat-Bold'] text-xl">
                  {getTotalPrice().toFixed(2)} {selectedPriceCategory?.currency.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Payment Method */}
            <Text className="text-white font-['Montserrat-Bold'] text-lg mb-4">
              Méthode de Paiement
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

            {/* Payment Form */}
            {paymentMethod === 'card' ? (
              <View className="gap-4 mb-8">
                {/* <View>
                  <Text className="text-white font-['Montserrat-Medium'] mb-2">Numéro de la Carte</Text>
                  <TextInput
                    value={cardNumber}
                    onChangeText={handleNumberChange}
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
                      onChangeText={handleExpiryChange}
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
                </View> */}
              </View>
            ) : (
              <View className="mb-8">
                <Text className="text-white font-['Montserrat-Medium'] mb-2">Numéro de Téléphone</Text>
                <TextInput
                  value={mobileNumber}
                  onChangeText={handlePhoneChange}
                  placeholder="Exemple : 243xxxxxxxxx"
                  placeholderTextColor="#6b7280"
                  maxLength={12}
                  className={`bg-background-elevated text-white p-4 rounded-xl font-['Montserrat-Regular']
                    ${error ? 'border border-red-500' : ''}`}
                  keyboardType="phone-pad"
                />
                {error ? (
                  <Text className="text-red-500 text-sm mt-1 px-1">{error}</Text>
                ) : null}
              </View>
            )}

            <TouchableOpacity
              onPress={handlePayment}
              className="bg-primary-600 py-4 rounded-xl w-full items-center"
              disabled={isProcessing || !selectedPriceCategory}
              activeOpacity={0.8}
            >
              {isProcessing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-['Montserrat-SemiBold'] text-white text-lg">
                  Payer {getTotalPrice().toFixed(2)} {selectedPriceCategory?.currency.toUpperCase()}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {paymentUrl && (
        <Modal transparent visible={showModal} animationType="none">
          <Pressable className="flex-1 bg-black/40" onPress={closeModal} />
          <Animated.View
            style={{ transform: [{ translateY: slideAnim }], height: height * 0.9 }}
            className="absolute bottom-0 w-full bg-white rounded-t-2xl overflow-hidden"
          >
            <View className="w-16 h-1.5 bg-gray-300 rounded-full self-center mt-2" />
            <WebView source={{ uri: paymentUrl }} 
              className="flex-1" 
              onNavigationStateChange={(navState) => {
                
                if (navState.url.includes('/approve')) {
                  // Paiement approuvé → vérifie le statut
                  closeModal();
                  redirectToTicket(tickectId as number)
                  showNotification("Paiement Approuvé !", 'error');
                }
                if (navState.url.includes('/cancel')) {
                  // Paiement annulé
                  closeModal();
                  redirectToTicket(tickectId as number)
                  showNotification("Paiement Annulé !", 'error');
                }
                if (navState.url.includes('/decline')) {
                  // Paiement annulé
                  closeModal();
                  redirectToTicket(tickectId as number)
                  showNotification("Paiement Refusé !", 'error');
                }
              }}
            />
          </Animated.View>
        </Modal>
      )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}                                                                                                                                                                                                                                                                                                                                                                                