import { useState } from 'react';
import { View, Text, Platform, KeyboardAvoidingView, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router, Link } from 'expo-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const { showNotification } = useNotification();

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showNotification('Remplissez tout les champs s\'ils vous plaît !', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNotification('Email invalide !', 'error');
      return;
    }

    if (password.length <= 7) {
      showNotification('Les mot de passe doit avoir au moin 6 caractères !', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showNotification('Les mot de passe ne correspondent pas !', 'error');
      return;
    }

    try {
      await register(name, email, password);
      router.replace('/(app)/(tabs)');
    } catch (error) {
      showNotification('Enregistrement échoué !', 'error');
    }
  };

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
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

          <Text className="text-3xl font-['Montserrat-Bold'] text-white mb-2">Créer un compte</Text>
          <Text className="text-lg font-['Montserrat-Regular'] text-gray-400 mb-10">
            Inscrivez-vous pour commencer
          </Text>

          <View className="gap-5 mb-6">
            <View>
              <Text className="text-white font-['Montserrat-Medium'] mb-2">Nom complèt</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Entrez votre nom complèt"
                placeholderTextColor="#6b7280"
                className="bg-background-card text-white p-4 rounded-xl font-['Montserrat-Regular']"
              />
            </View>

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
              <Text className="text-white font-['Montserrat-Medium'] mb-2">Mot de Passe</Text>
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Créez votre mot de passe"
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

            <View>
              <Text className="text-white font-['Montserrat-Medium'] mb-2">Confirme le mot de passe</Text>
              <View className="relative">
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirmez votre mot de passe"
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
            onPress={handleRegister} 
            className="bg-primary-600 py-4 rounded-xl w-full items-center mb-4"
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-['Montserrat-SemiBold'] text-white text-lg">
                Créer le compte
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-400 font-['Montserrat-Regular']">
              Avez-vous déjà un compte?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary-400 font-['Montserrat-SemiBold']">
                  Se connecter
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}