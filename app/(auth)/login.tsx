import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { router, Link } from 'expo-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { showNotification } = useNotification();

  const handleLogin = async () => {
    if (!email || !password) {
      showNotification('Remplissez tout le champ s\'ils vous plaît !', 'error');
      return;
    }

    try {
      await login(email, password);
      router.replace('/(app)/(tabs)');
    } catch (error) {
      showNotification( error?.message , 'error');
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-background-dark mt-5" 
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 p-6">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="p-2 rounded-full bg-background-elevated self-start mb-8"
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>

        <Text className="text-3xl font-['Montserrat-Bold'] text-white mb-2">Bienvenue à nouveau</Text>
        <Text className="text-lg font-['Montserrat-Regular'] text-gray-400 mb-10">
          Connectez-vous à votre compte
        </Text>

        <View className="gap-5 mb-6">
          <View>
            <Text className="text-white font-['Montserrat-Medium'] mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Entrez votre email"
              placeholderTextColor="#6b7280"
              className="bg-background-card text-white p-4 rounded-xl font-['Montserrat-Regular']"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-white font-['Montserrat-Medium'] mb-2">Password</Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Entrez votre Mot de passe"
                placeholderTextColor="#6b7280"
                className="bg-background-card text-white p-4 pr-12 rounded-xl font-['Montserrat-Regular']"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                className="absolute right-4 top-0 bottom-0 justify-center"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleLogin} 
          className="bg-primary-600 py-4 rounded-xl w-full items-center mb-4"
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-['Montserrat-SemiBold'] text-white text-lg">
              Se connecter
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-400 font-['Montserrat-Regular']">
            N'avez-vous pas de compte?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/register')}>
              <Text className="text-primary-400 font-['Montserrat-SemiBold']">
                S'inscrire
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}