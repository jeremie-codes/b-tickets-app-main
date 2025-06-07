import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AppLayout() {
  return (
    <View className="flex-1 bg-background-dark">
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' }
      }}>
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="ticket" />
        <Stack.Screen name="event-details" />
        <Stack.Screen name="payment" />
      </Stack>
    </View>
  );
}