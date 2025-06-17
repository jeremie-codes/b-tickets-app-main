import { useState } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Heart } from 'lucide-react-native';
import { addToWishlist, removeFromWishlist } from '@/services/api';
import { useNotification } from '@/contexts/NotificationContext';

interface WishlistButtonProps {
  eventId: string;
  isInWishlist: boolean;
  onToggle?: (isInWishlist: boolean) => void;
  size?: number;
  color?: string;
}

export default function WishlistButton({ 
  eventId, 
  isInWishlist, 
  onToggle, 
  size = 20, 
  color = "#8b5cf6" 
}: WishlistButtonProps) {
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(isInWishlist);

  const handleToggleWishlist = async () => {
    setIsLoading(true);
    try {
      if (inWishlist) {
        // Note: In a real app, you'd need the wishlist item ID
        // For now, we'll simulate the removal
        await removeFromWishlist(`wish_${eventId}`);
        setInWishlist(false);
        showNotification('Supprimé de la wishlist', 'success');
      } else {
        await addToWishlist(eventId);
        setInWishlist(true);
        showNotification('Ajouté à la wishlist', 'success');
      }
      onToggle?.(inWishlist);
    } catch (error) {
      showNotification('Erreur lors de la mise à jour de la wishlist', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleToggleWishlist}
      disabled={isLoading}
      className="p-2"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Heart 
          size={size} 
          color={inWishlist ? color : "#6b7280"} 
          fill={inWishlist ? color : "transparent"} 
        />
      )}
    </TouchableOpacity>
  );
}