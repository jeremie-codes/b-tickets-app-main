import React, { createContext, useState, useContext } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('info');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  const translateY = new Animated.Value(-100);

  const showNotification = (
    notificationMessage: string,
    notificationType: NotificationType = 'info',
    duration: number = 3000
  ) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set the message and type
    setMessage(notificationMessage);
    setType(notificationType);
    setVisible(true);

    // Animate in
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Set timeout to hide
    const id = setTimeout(() => {
      hideNotification();
    }, duration);
    
    setTimeoutId(id);
  };

  const hideNotification = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500 ';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {visible && (
        <Animated.View 
          className={`absolute top-0 left-0 px-4 z-50 w-full h-24 flex justify-center ${getBgColor()}`}
          style={[
            styles.notification,
            {  }
          ]}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-medium flex-1">{message}</Text>
            <TouchableOpacity onPress={hideNotification} className="ml-2">
              <X size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
}

const styles = StyleSheet.create({
  notification: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// Custom hook to use notification context
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}