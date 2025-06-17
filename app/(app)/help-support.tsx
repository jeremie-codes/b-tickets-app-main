import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MessageCircle, 
  ChevronRight, 
  ExternalLink,
  FileText,
  Shield,
  Info,
  HelpCircle
} from 'lucide-react-native';

export default function HelpSupportScreen() {
  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@bticket.com?subject=Support Request');
  };

  const handlePhoneSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleLiveChat = () => {
    Alert.alert(
      "Chat en Direct",
      "Le chat en direct sera disponible prochainement. En attendant, vous pouvez nous contacter par email ou téléphone.",
      [{ text: "OK" }]
    );
  };

  const handleExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const ContactOption = ({ 
    icon, 
    title, 
    subtitle, 
    onPress 
  }: { 
    icon: JSX.Element, 
    title: string, 
    subtitle: string, 
    onPress: () => void 
  }) => (
    <TouchableOpacity 
      className="flex-row items-center bg-background-card p-4 rounded-xl mb-3"
      onPress={onPress}
    >
      <View className="mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-white font-['Montserrat-SemiBold'] text-base">
          {title}
        </Text>
        <Text className="text-gray-400 font-['Montserrat-Regular'] text-sm">
          {subtitle}
        </Text>
      </View>
      <ChevronRight size={20} color="#6b7280" />
    </TouchableOpacity>
  );

  const FAQItem = ({ question, answer }: { question: string, answer: string }) => (
    <View className="bg-background-card rounded-xl p-4 mb-3">
      <Text className="text-white font-['Montserrat-SemiBold'] text-base mb-2">
        {question}
      </Text>
      <Text className="text-gray-300 font-['Montserrat-Regular'] leading-5">
        {answer}
      </Text>
    </View>
  );

  const LinkOption = ({ 
    icon, 
    title, 
    onPress 
  }: { 
    icon: JSX.Element, 
    title: string, 
    onPress: () => void 
  }) => (
    <TouchableOpacity 
      className="flex-row items-center bg-background-card p-4 rounded-xl mb-3"
      onPress={onPress}
    >
      <View className="mr-4">
        {icon}
      </View>
      <Text className="text-white font-['Montserrat-Medium'] flex-1">
        {title}
      </Text>
      <ExternalLink size={18} color="#8b5cf6" />
    </TouchableOpacity>
  );

  return (
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

          <Text className="text-white font-['Montserrat-Bold'] text-2xl mb-2">
            Aide & Support
          </Text>
          <Text className="text-gray-400 font-['Montserrat-Regular'] mb-8">
            Nous sommes là pour vous aider
          </Text>

          {/* Contact Options */}
          <View className="mb-8">
            <Text className="text-white font-['Montserrat-Bold'] text-lg mb-4">
              Nous Contacter
            </Text>
            
            <ContactOption
              icon={<Mail size={22} color="#8b5cf6" />}
              title="Email Support"
              subtitle="support@bticket.com"
              onPress={handleEmailSupport}
            />
            
            <ContactOption
              icon={<Phone size={22} color="#8b5cf6" />}
              title="Support Téléphonique"
              subtitle="Lun-Ven, 9h-18h"
              onPress={handlePhoneSupport}
            />
            
            <ContactOption
              icon={<MessageCircle size={22} color="#8b5cf6" />}
              title="Chat en Direct"
              subtitle="Réponse immédiate"
              onPress={handleLiveChat}
            />
          </View>

          {/* FAQ Section */}
          <View className="mb-8">
            <Text className="text-white font-['Montserrat-Bold'] text-lg mb-4">
              Questions Fréquentes
            </Text>
            
            <FAQItem
              question="Comment puis-je annuler mon billet ?"
              answer="Vous pouvez annuler votre billet jusqu'à 24h avant l'événement depuis la section 'Mes Tickets'. Les remboursements sont traités sous 3-5 jours ouvrables."
            />
            
            <FAQItem
              question="Que faire si je ne reçois pas mon billet ?"
              answer="Vérifiez d'abord vos spams. Si vous ne trouvez toujours pas votre billet, contactez notre support avec votre numéro de commande."
            />
            
            <FAQItem
              question="Puis-je transférer mon billet à quelqu'un d'autre ?"
              answer="Oui, vous pouvez transférer votre billet via l'option 'Partager' dans les détails du billet. Le destinataire recevra un nouveau QR code."
            />
            
            <FAQItem
              question="Comment fonctionne la wishlist ?"
              answer="Ajoutez des événements à votre wishlist pour les retrouver facilement plus tard. Vous recevrez des notifications pour les événements en wishlist."
            />
          </View>

          {/* Resources */}
          <View className="mb-8">
            <Text className="text-white font-['Montserrat-Bold'] text-lg mb-4">
              Ressources
            </Text>
            
            <LinkOption
              icon={<FileText size={22} color="#8b5cf6" />}
              title="Guide d'Utilisation"
              onPress={() => handleExternalLink('https://bticket.com/guide')}
            />
            
            <LinkOption
              icon={<Shield size={22} color="#8b5cf6" />}
              title="Politique de Confidentialité"
              onPress={() => handleExternalLink('https://bticket.com/privacy')}
            />
            
            <LinkOption
              icon={<FileText size={22} color="#8b5cf6" />}
              title="Conditions d'Utilisation"
              onPress={() => handleExternalLink('https://bticket.com/terms')}
            />
          </View>

          {/* App Info */}
          <View className="bg-background-card rounded-xl p-5">
            <Text className="text-white font-['Montserrat-SemiBold'] text-lg mb-4">
              Informations de l'Application
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 font-['Montserrat-Regular']">
                  Version
                </Text>
                <Text className="text-white font-['Montserrat-Medium']">
                  1.0.0
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 font-['Montserrat-Regular']">
                  Dernière Mise à Jour
                </Text>
                <Text className="text-white font-['Montserrat-Medium']">
                  Janvier 2025
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 font-['Montserrat-Regular']">
                  Support
                </Text>
                <Text className="text-white font-['Montserrat-Medium']">
                  iOS 14+, Android 8+
                </Text>
              </View>
            </View>
          </View>

          {/* Emergency Contact */}
          <View className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <View className="flex-row items-center mb-2">
              <HelpCircle size={20} color="#ef4444" className="mr-2" />
              <Text className="text-red-400 font-['Montserrat-SemiBold']">
                Urgence
              </Text>
            </View>
            <Text className="text-red-300 font-['Montserrat-Regular'] text-sm">
              Pour les urgences liées aux événements, contactez directement l'organisateur ou les services d'urgence locaux.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}