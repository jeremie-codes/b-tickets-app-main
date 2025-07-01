import { useState, useEffect } from 'react';
import { View, Text, Platform, KeyboardAvoidingView, RefreshControl, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Camera, User, Mail, Save } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
// import * as Image from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { APP_URL } from '@/configs';

export default function AccountSettingsScreen() {
  const { user, updateUser, updatePicture } = useAuth();
  const { showNotification } = useNotification();
  const [name, setName] = useState(user?.name || '');
  const [first_name, setFirstName] = useState(user?.profile?.first_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [picture, setPicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const nameChanged = name !== user?.name;
    const emailChanged = email !== user?.email;
    setHasChanges(nameChanged || emailChanged);
  }, [name, email, picture, user]);

  const formatImage = () => {
    const imagePath = user?.profile?.picture;
    if (imagePath) {
      const relativePath = imagePath.split('/public/')[1];
      const imageUrl = `${APP_URL}/${relativePath}`;
      setPicture(imageUrl);
    } else {
      setPicture(null);
    }
  };


  useEffect(() => {
    formatImage();
  }, [user]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showNotification('Permission d\'accès à la galerie requise', 'error');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const formData = new FormData();

        formData.append('picture', {
          uri: asset.uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);

        setIsUploadingImage(true);
        try {
          const uploadResult = await updatePicture(formData);
          if (uploadResult) {
            showNotification('Image mise à jour', 'success');
          } else {
            showNotification('Erreur', 'error');
          }
        } catch (e) {
          showNotification('Erreur lors de la mise à jour', 'error');
        } finally {
          formatImage()
          setIsUploadingImage(false);
        }
      }
    } catch (error) {
      showNotification('Erreur lors de la sélection de l\'image', 'error');
      setIsUploadingImage(false);
    }
  };

  const takePhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showNotification('Permission d\'accès à la caméra requise', 'error');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          setIsUploadingImage(true);
          const formData = new FormData();

        formData.append('picture', {
          uri: asset.uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);

        setIsUploadingImage(true);
        try {
          const uploadResult = await updatePicture(formData);
          if (uploadResult) {
            showNotification('Image mise à jour', 'success');
          } else {
            showNotification('Erreur', 'error');
          }
        } catch (e) {
          showNotification('Erreur lors de la mise à jour', 'error');
        } finally {
          setIsUploadingImage(false);
        }
        }
      }
    } catch (error) {
      showNotification('Erreur lors de la prise de photo', 'error');
      setIsUploadingImage(false);
    }
  };

  const handlepicturePress = () => {
    Alert.alert(
      "Photo de Profil",
      "Choisissez une option",
      [
        {
          text: "Galerie",
          onPress: pickImage
        },
        {
          text: "Caméra",
          onPress: takePhoto
        },
        {
          text: "Annuler",
          style: "cancel"
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showNotification('Le nom est requis', 'error');
      return;
    }

    if (!email.trim()) {
      showNotification('L\'email est requis', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showNotification('Format d\'email invalide', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUser({
        name: name.trim(),
        first_name: first_name.trim(),
        last_name: '_',
        email: email.trim(),
      });

      if (result) {
        console.log(user);
        
        showNotification('Profil mis à jour avec succès', 'success');
        setHasChanges(false);
      }
    } catch (error) {
      showNotification('Erreur lors de la mise à jour du profil', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // loadEvents();
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
              onPress={() => router.push('/(app)/(tabs)/profile')}
              className="p-2 rounded-full bg-background-elevated self-start mb-6"
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>

            <Text className="text-white font-['Montserrat-Bold'] text-2xl mb-8">
              Paramètres de Compte
             </Text>

            {/* Profile Picture Section */}
            <View className="items-center mb-8">
              <TouchableOpacity 
                onPress={handlepicturePress}
                className="relative"
                disabled={isUploadingImage}
              >
                {picture ? (
                  <Image
                    source={{ uri: picture }}
                    style={{ width: 96, height: 96, borderRadius: 48 }}
                    className='border border-pink-500'
                    resizeMode="cover"
                  />
                ) : (
                  <View className="bg-primary-600 w-24 h-24 rounded-full items-center justify-center border border-pink-500">
                    <Text className="text-white font-['Montserrat-Bold'] text-3xl">
                      {name.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                )}
                
                <View className="absolute -bottom-2 -right-2 bg-background-card p-2 rounded-full border-2 border-background-dark">
                  {isUploadingImage ? (
                    <ActivityIndicator size="small" color="#8b5cf6" />
                  ) : (
                    <Camera size={16} color="#8b5cf6" />
                  )}
                </View>
              </TouchableOpacity>
              <Text className="text-gray-400 font-['Montserrat-Regular'] text-sm mt-2">
                Appuyez pour changer la photo
              </Text>
            </View>

            {/* Form Section */}
            <View className="bg-background-card rounded-xl p-5 mb-6">
              <Text className="text-white font-['Montserrat-SemiBold'] text-lg mb-4">
                Informations Personnelles
              </Text>

              <View className="mb-4">
                <Text className="text-white font-['Montserrat-Medium'] mb-2">
                  Prénom
                </Text>
                <View className="flex-row items-center bg-background-elevated rounded-xl px-4 py-2">
                  <User size={20} color="#8b5cf6" className="mr-3" />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Entrez votre nom complet"
                    placeholderTextColor="#6b7280"
                    className="text-white font-['Montserrat-Regular'] flex-1"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-white font-['Montserrat-Medium'] mb-2">
                  Nom
                </Text>
                <View className="flex-row items-center bg-background-elevated rounded-xl px-4 py-2">
                  <User size={20} color="#8b5cf6" className="mr-3" />
                  <TextInput
                    value={first_name}
                    onChangeText={setFirstName}
                    placeholder="Entrez votre nom complet"
                    placeholderTextColor="#6b7280"
                    className="text-white font-['Montserrat-Regular'] flex-1"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-white font-['Montserrat-Medium'] mb-2">
                  Adresse Email
                </Text>
                <View className="flex-row items-center bg-background-elevated rounded-xl px-4 py-2">
                  <Mail size={20} color="#8b5cf6" className="mr-3" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Entrez votre email"
                    placeholderTextColor="#6b7280"
                    className="text-white font-['Montserrat-Regular'] flex-1"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSave}
                disabled={!hasChanges || isLoading || isUploadingImage}
                className={`flex-row items-center justify-center py-4 rounded-xl ${
                  hasChanges && !isLoading && !isUploadingImage
                    ? 'bg-primary-600' 
                    : 'bg-gray-600'
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Save size={20} color="white" className="mr-2" />
                    <Text className="text-white font-['Montserrat-SemiBold'] text-base">
                      Sauvegarder les Modifications
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Info Section */}
            <View className="bg-background-card rounded-xl p-5">
              <Text className="text-white font-['Montserrat-SemiBold'] text-lg mb-3">
                Informations du Compte
              </Text>
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 font-['Montserrat-Regular']">
                    ID du Compte
                  </Text>
                  <Text className="text-white font-['Montserrat-Medium']">
                    #{user?.id || 'N/A'}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 font-['Montserrat-Regular']">
                    Membre depuis
                  </Text>
                  <Text className="text-white font-['Montserrat-Medium']">
                    {new Date(user?.created_at || '').toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) || 'N/A'
                     }
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-400 font-['Montserrat-Regular']">
                    Statut du Compte
                  </Text>
                  <View className="bg-green-500/10 px-3 py-1 rounded-full">
                    <Text className="text-green-500 font-['Montserrat-Medium'] text-sm">
                      Actif
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}