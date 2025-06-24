import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ticket } from 'lucide-react-native';

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={ require('@/assets/images/casque.png') }
      resizeMode="cover"
      style={styles.background}
    >
      {/* Dégradé pour assombrir l'image */}
      <LinearGradient
        colors={['rgba(108, 40, 217, 0)', 'rgba(17, 24, 39, 0.12)']}
        className="absolute top-0 left-0 right-0 bottom-0"
      />

      <View className="flex-1 flex-col justify-end gap-4 items-center px-6 pb-8">

        <View className="w-full gap-4 mt-4">
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            className="bg-primary-600 py-4 rounded-xl w-full items-center border"
            activeOpacity={0.8}
          >
            <Text className="font-['Montserrat-SemiBold'] text-white text-lg">
              Se connecter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            className="bg-transparent border border-white py-4 rounded-xl w-full items-center"
            activeOpacity={0.8}
          >
            <Text className="font-['Montserrat-SemiBold'] text-white text-lg">
              S'inscrire
            </Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mb-10">
          <View className="w-36 h-20 rounded-2xl items-center justify-center mb-8"></View>

          <Text className="text-lg font-['Montserrat-Medium'] text-gray-200 text-center">
            Découvrez, réservez et profitez d'événements exceptionnels.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
