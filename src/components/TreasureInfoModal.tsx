import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { Treasure } from '../data/treasures';

interface TreasureInfoModalProps {
  treasure: Treasure;
  visible: boolean;
  onClose: () => void;
}

export default function TreasureInfoModal({
  treasure,
  visible,
  onClose,
}: TreasureInfoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ImageBackground
            source={require('@assets/images/bg.png')}
            style={styles.modalBackground}
            resizeMode="cover"
          >
            <View style={styles.content}>
              <Image
                source={treasure.image}
                style={styles.treasureImage}
                resizeMode="contain"
              />
              <Text style={styles.title}>{treasure.name}</Text>
              <Text style={styles.description}>{treasure.description}</Text>
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFE777',
  },
  modalBackground: {
    width: '100%',
  },
  content: {
    alignItems: 'center',
  },
  treasureImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Knewave-Regular',
    color: '#FFE777',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    width: '100%',
    backgroundColor: '#FFE777',
    padding: 8,
    fontSize: 16,
    fontFamily: 'Fredoka',
    color: '#3e2105ff',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    textShadowColor: '#FFE777',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  closeButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE777',
    marginBottom: 20
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: 'Knewave-Regular',
    color: '#8B4513',
    fontWeight: 'bold',
  },
});

