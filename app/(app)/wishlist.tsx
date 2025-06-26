import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react-native';
import { ChevronsDown} from 'lucide-react-native';
import { useNotification } from '@/contexts/NotificationContext';
import { getWishlist, toggleWishlist } from '@/services/api';
import { EventType, WishlistItem } from '@/types';
import EventCard from '@/components/EventCard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';

const AnimatedIcon = Animated.createAnimatedComponent(ChevronsDown);

export default function WishlistScreen() {
  const { wishRefrListReshKey } = useAuth();
  const { showNotification } = useNotification();
  const [wishlist, setWishlist] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const bounce = useSharedValue(0);

  const loadWishlist = async () => {
    try {
      const { data } = await getWishlist();
      setWishlist(data);
    } catch (error) {
      showNotification('Erreur lors du chargement de la wishlist', 'error');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [wishRefrListReshKey]);

   useEffect(() => {
    if (showGuide) {
      bounce.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        true
      );
    }
  }, [showGuide]);

  useEffect(() => {
    const checkGuide = async () => {
      setShowGuide(true);
        setTimeout(async () => {
          setShowGuide(false);
        }, 5000);
    };
    checkGuide();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const handleRemoveFromWishlist = (item: EventType) => {
    Alert.alert(
      "Supprimer de la Wishlist",
      `Êtes-vous sûr de vouloir supprimer "${item.title}" de votre wishlist ?`,
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => confirmRemoveFromWishlist(item.id)
        }
      ]
    );
  };

  const confirmRemoveFromWishlist = async (itemId: number) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    try {
      await toggleWishlist(itemId, true);
      setWishlist(prev => prev.filter(item => item.id !== itemId));
      showNotification('Supprimé de la wishlist', 'success');
    } catch (error) {
      showNotification('Erreur lors de la suppression', 'error');
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const WishlistItemCard = ({ item }: { item: EventType }) => (
    <View className="bg-background-card rounded-xl overflow-hidden mb-4">
      <EventCard event={item} />
      <View className="p-4 border-t border-gray-700">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 font-['Montserrat-Regular'] text-sm">
              Ajouté le {new Date(item.created_at).toLocaleDateString('fr-FR')}
            </Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/(app)/payment',
                params: { eventId: item.id }
              })}
              className="bg-primary-600 px-4 py-2 rounded-lg flex-row items-center"
            >
              <ShoppingBag size={16} color="white" className="mr-1" />
              <Text className="text-white font-['Montserrat-SemiBold'] text-sm">
                Réserver
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleRemoveFromWishlist(item)}
              disabled={removingItems.has(item.id)}
              className="bg-red-500/10 border border-red-500 px-3 py-2 rounded-lg"
            >
              {removingItems.has(item.id) ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <Trash2 size={16} color="#ef4444" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadWishlist();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <StatusBar style="light" />
      <View className="flex-1">
        <View className="p-6 border-b border-gray-800">
          <View className="flex-row items-center justify-between mb-2">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-2 rounded-full bg-background-elevated"
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View className="flex-row items-center">
              <ShoppingBag size={24} color="#8b5cf6" />
              {wishlist.length > 0 && (
                <View className="bg-primary-600 rounded-full w-6 h-6 items-center justify-center ml-2">
                  <Text className="text-white font-['Montserrat-Bold'] text-xs">
                    {wishlist.length}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Text className="text-white font-['Montserrat-Bold'] text-2xl">
            Ma Liste de Souhait 
          </Text>
          <Text className="text-gray-400 font-['Montserrat-Regular']">
            Événements que vous souhaitez réserver plus tard
          </Text>
        </View>

        {showGuide && (
          <View className="absolute top-8 self-center items-center z-50">
            <AnimatedIcon
              size={40}
              color="white"
              style={animatedStyle}
            />
            <Text className="mt-1 px-3 py-1 text-white bg-black/80 rounded-md text-sm">
              Glissez vers le bas pour actualiser
            </Text>
          </View>
        )}

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text className="text-gray-400 font-['Montserrat-Medium'] mt-4">
              Chargement de votre wishlist...
            </Text>
          </View>
        ) : (
          <ScrollView 
            className="flex-1 p-6"
            showsVerticalScrollIndicator={false}
            refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#8b5cf6"
              colors={["#8b5cf6"]}
            />
          }
          >
            {wishlist.length > 0 ? (
              <>
                {wishlist.map(item => (
                  <WishlistItemCard key={item.id} item={item} />
                ))}
              </>
            ) : (
              <View className="flex-1 justify-center items-center py-20">
                <View className="bg-background-card p-8 rounded-full mb-6">
                  <ShoppingBag size={48} color="#6b7280" />
                </View>
                <Text className="text-white font-['Montserrat-Bold'] text-xl mb-2">
                  Votre wishlist est vide
                </Text>
                <Text className="text-gray-400 font-['Montserrat-Regular'] text-center mb-6 px-4">
                  Explorez les événements et ajoutez ceux qui vous intéressent à votre wishlist
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(app)/(tabs)/search')}
                  className="bg-primary-600 px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-['Montserrat-SemiBold']">
                    Explorer les Événements
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}