import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useNotification } from '@/contexts/NotificationContext';

export default function NotificationBanner() {
  const { notification, hideNotification } = useNotification();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (notification) {
      // Slide in
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // Slide out
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [notification]);

  if (!notification) {
    return null;
  }

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Animated.View 
      className={`absolute top-0 left-0 right-0 z-50 px-4 pt-12 pb-4 ${getBackgroundColor()}`}
      style={[styles.container, { transform: [{ translateY }] }]}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-white font-['Montserrat-SemiBold'] flex-1 pr-4">
          {notification.message}
        </Text>
        <TouchableOpacity onPress={hideNotification}>
          <X size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});