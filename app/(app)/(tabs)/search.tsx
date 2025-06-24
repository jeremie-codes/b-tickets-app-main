import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Calendar, MapPin, Filter } from 'lucide-react-native';
import { getEvents, getCategories } from '@/services/api';
import { EventType, CategoryType } from '@/types';
import EventCard from '@/components/EventCard';
import { useNotification } from '@/contexts/NotificationContext';

export default function SearchScreen() {
  const { showNotification } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<EventType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, categoriesData] = await Promise.all([
          getEvents(),
          getCategories()
        ]);
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        setCategories(categoriesData);
      } catch (error) {
        showNotification('Chargement des données échoué !', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, selectedCategory]);

  const filterEvents = () => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(event => event.category_id === selectedCategory);
    }

    setFilteredEvents(filtered);
  };

  const selectCategory = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="p-6 flex-">
        <Text className="text-white font-['Montserrat-Bold'] text-2xl mb-6">
          Découvrir les événements
        </Text>

        <View className="relative mb-6">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Recherche l'événement..."
            placeholderTextColor="#6b7280"
            className="bg-background-card text-white pl-12 p-4 rounded-xl font-['Montserrat-Regular']"
          />
          <View className="absolute left-4 top-0 bottom-0 justify-center">
            <Search size={20} color="#6b7280" />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 0 }}
          className="pb-6"
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => selectCategory(category.id)}
              className={`px-4 py-2 h-9 rounded-full mr-3 ${
                selectedCategory === category.id ? 'bg-primary-600' : 'bg-background-card'
              }`}
            >
              <Text 
                className={`font-['Montserrat-Medium'] ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-400'
                }`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoading ? (
          <View className="h-60 justify-center items-center">
            <ActivityIndicator size="large" color="#8b5cf6" />
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {filteredEvents.length > 0 ? (
              <View className="gap-4">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </View>
            ) : (
              <View className="h-60 justify-center items-center">
                <Text className="text-white font-['Montserrat-Medium'] text-lg">
                  No events found
                </Text>
                <Text className="text-gray-400 font-['Montserrat-Regular'] text-center mt-2">
                  Try adjusting your search or filters
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}