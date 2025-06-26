import { useCallback, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, ActivityIndicator } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ErrorBoundary } from 'react-error-boundary';
import '../global.css';

// Keep the splash screen visible until we're ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);


  if (!fontsLoaded && !fontError) {
    return (
      <View className="flex-1 items-center justify-center bg-background-dark">
        <ActivityIndicator size={'large'} color={'#8b5cf6'} />
      </View>
    );
  }

  function Fallback({ error }: { error: Error }) {
    return (
      <View className="flex-1 items-center justify-center bg-red-900 px-6">
        <Text className="text-white text-lg font-bold">Erreur critique</Text>
        <Text className="text-white mt-4">{error.message}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <ErrorBoundary FallbackComponent={Fallback}>
        <View className="flex-1" onLayout={onLayoutRootView}>
          <AuthProvider>
            <NotificationProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
                <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
              </Stack>
              <StatusBar style="light" />
            </NotificationProvider>
          </AuthProvider>
        </View>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );

}