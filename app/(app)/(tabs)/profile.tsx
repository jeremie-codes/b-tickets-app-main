import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight, LogOut, Settings, Ticket, ShoppingBag, CircleHelp as HelpCircle, Heart } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { APP_URL } from '@/configs';

export default function ProfileScreen() {
  const { user, logout, deleteAccount, isLoading } = useAuth();
  const [picture, setPicture] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/welcome');
    } catch (error) {
      showNotification('Déconnexion échouée !', 'error');
    }
  };

  useEffect(() => {
    if (user?.profile?.picture) {
      const imagePath = user?.profile.picture
      const relativePath = imagePath?.split('/public/')[1];
      const imageUrl = `${APP_URL}/${relativePath}`;
      setPicture(imageUrl);
    } else {
      setPicture(null);
    }
  }, [])

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Suppression de Compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: handleDeleteAccount
        }
      ]
    );
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      router.replace('/(auth)/welcome');
    } catch (error) {
      showNotification('Suppression de compte échoué !', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const ProfileOption = ({ icon, title, onPress }: { icon: JSX.Element, title: string, onPress?: () => void }) => (
    <TouchableOpacity 
      className="flex-row items-center bg-background-card p-4 rounded-xl mb-3"
      onPress={onPress}
    >
      <View className="mr-4">
        {icon}
      </View>
      <Text className="text-white font-['Montserrat-Medium'] flex-1">
        {title}
      </Text>
      <ChevronRight size={20} color="#6b7280" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView>
        <View className="p-6">
          <Text className="text-white font-['Montserrat-Bold'] text-2xl mb-6">
            Profile
          </Text>

          <View className="items-center mb-8">
            <View className="bg-primary-600 w-24 h-24 rounded-full items-center justify-center mb-4">
              {picture ? (
                  <Image
                    source={{ uri: picture }}
                    className='border border-pink-500'
                    style={{ width: 96, height: 96, borderRadius: 48 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-white font-['Montserrat-Bold'] text-3xl">
                    {user?.name.charAt(0).toUpperCase() || 'U'}
                  </Text>
                )}
            </View>
            <Text className="text-white font-['Montserrat-Bold'] text-xl">
              {user?.name}
            </Text>
            <Text className="text-gray-400 font-['Montserrat-Regular']">
              {user?.email}
            </Text>
          </View>

          <View className="mb-8">
            <Text className="text-gray-400 font-['Montserrat-SemiBold'] mb-3">
              COMPTE
            </Text>
            <ProfileOption 
              icon={<Settings size={22} color="#8b5cf6" />} 
              title="Paramètres de Compte" 
              onPress={() => router.push('/(app)/account-settings')}
            />
            <ProfileOption 
              icon={<Ticket size={22} color="#8b5cf6" />} 
              title="Mes Tickets" 
              onPress={() => router.push('/(app)/(tabs)/tickets')}
            />
            <ProfileOption 
              icon={<ShoppingBag size={22} color="#8b5cf6" />} 
              title="Wishlist" 
              onPress={() => router.push('/(app)/wishlist')}
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-400 font-['Montserrat-SemiBold'] mb-3">
              SUPPORT
            </Text>
            <ProfileOption 
              icon={<HelpCircle size={22} color="#8b5cf6" />} 
              title="Aide & Support" 
              onPress={() => router.push('/(app)/help-support')}
            />
          </View>

          <View className="gap-3">
            <TouchableOpacity 
              onPress={handleLogout}
              disabled={isLoading}
              className="flex-row items-center justify-center bg-background-card p-4 rounded-xl"
            >
              {isLoading ? (
                <ActivityIndicator color="#8b5cf6" />
              ) : (
                <>
                  <LogOut size={20} color="#8b5cf6" className="mr-2" />
                  <Text className="text-white font-['Montserrat-SemiBold']">
                    Deconnexion
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={confirmDeleteAccount}
              disabled={isDeleting}
              className="flex-row items-center justify-center p-4 rounded-xl"
            >
              {isDeleting ? (
                <ActivityIndicator color="#ef4444" />
              ) : (
                <Text className="text-red-400 font-['Montserrat-SemiBold']">
                  Supprimer le compte
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}