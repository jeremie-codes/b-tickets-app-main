import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, Save } from 'lucide-react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';

export default function UpdatePasswordScreen() {
  const { updatePassword, user } = useAuth();
  const { showNotification } = useNotification();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      showNotification("Le mot de passe doit avoir au moins 8 caractères !", 'error');
      return;
    }

    if (!newPassword || !confirmPassword) {
      showNotification("Tous les champs sont requis", 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("Les nouveaux mots de passe ne correspondent pas", 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await updatePassword({ password: newPassword });

      if (result) {
        showNotification("Mot de passe mis à jour avec succès", 'success');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      showNotification("Erreur lors de la mise à jour du mot de passe", 'error');
    } finally {
      setIsLoading(false);
    }
  };

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

            <Text className="text-white font-['Montserrat-Bold'] text-2xl mb-8">
              Mise à jour du mot de passe
            </Text>

            <View className="bg-background-card rounded-xl p-5 mb-6">
              <Text className="text-white font-['Montserrat-SemiBold'] text-lg mb-4">
                Changer le mot de passe
              </Text>

              <View className="mb-4">
                <Text className="text-white font-['Montserrat-Medium'] mb-2">
                  Nouveau mot de passe
                </Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Entrez le nouveau mot de passe"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  className="text-white font-['Montserrat-Regular'] bg-background-elevated rounded-xl px-4 py-3"
                />
              </View>

              <View className="mb-6">
                <Text className="text-white font-['Montserrat-Medium'] mb-2">
                  Confirmez le nouveau mot de passe
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirmez le nouveau mot de passe"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  className="text-white font-['Montserrat-Regular'] bg-background-elevated rounded-xl px-4 py-3"
                />
              </View>

              <TouchableOpacity
                onPress={handleUpdatePassword}
                disabled={isLoading}
                className={`flex-row items-center justify-center py-4 rounded-xl ${
                  isLoading ? 'bg-gray-600' : 'bg-primary-600'
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Save size={20} color="white" className="mr-2" />
                    <Text className="text-white font-['Montserrat-SemiBold'] text-base">
                      Mettre à jour
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
