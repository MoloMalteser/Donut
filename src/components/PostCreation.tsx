import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PostService from '../services/PostService';
import { validatePostContent } from '../utils/helpers';

interface PostCreationProps {
  onPostCreated: () => void;
}

const { width } = Dimensions.get('window');

const PostCreation: React.FC<PostCreationProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [timeUntilNextPost, setTimeUntilNextPost] = useState(0);
  const [showImageOptions, setShowImageOptions] = useState(false);

  useEffect(() => {
    const checkTimeUntilNextPost = async () => {
      const timeRemaining = await PostService.getTimeUntilNextPost();
      setTimeUntilNextPost(timeRemaining);
    };

    checkTimeUntilNextPost();
    const interval = setInterval(checkTimeUntilNextPost, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateTextPost = async () => {
    if (timeUntilNextPost > 0) {
      Alert.alert('Spam Prevention', `Please wait ${timeUntilNextPost} seconds before creating another post`);
      return;
    }

    const validationError = validatePostContent(content, 200);
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    setIsCreating(true);
    try {
      await PostService.createTextPost(content);
      setContent('');
      onPostCreated();
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreatePhotoPost = async () => {
    if (timeUntilNextPost > 0) {
      Alert.alert('Spam Prevention', `Please wait ${timeUntilNextPost} seconds before creating another post`);
      return;
    }

    setIsCreating(true);
    try {
      await PostService.createPhotoPost();
      onPostCreated();
      Alert.alert('Success', 'Photo post created successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create photo post');
    } finally {
      setIsCreating(false);
      setShowImageOptions(false);
    }
  };

  const handleTakePhoto = async () => {
    if (timeUntilNextPost > 0) {
      Alert.alert('Spam Prevention', `Please wait ${timeUntilNextPost} seconds before creating another post`);
      return;
    }

    setIsCreating(true);
    try {
      await PostService.takePhoto();
      onPostCreated();
      Alert.alert('Success', 'Photo taken and posted successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to take photo');
    } finally {
      setIsCreating(false);
      setShowImageOptions(false);
    }
  };

  const canPost = timeUntilNextPost === 0 && !isCreating;

  return (
    <View style={styles.container}>
      {/* Modern Card Design */}
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.card}
      >
        {/* Text Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="What's happening? (max 200 chars)"
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={200}
            editable={canPost}
          />
          <View style={styles.characterCountContainer}>
            <LinearGradient
              colors={content.length > 180 ? ['#FF6B6B', '#FF8E8E'] : ['#4CAF50', '#66BB6A']}
              style={styles.characterCountGradient}
            >
              <Text style={styles.characterCount}>
                {content.length}/200
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.textButton, !canPost && styles.disabledButton]}
              onPress={handleCreateTextPost}
              disabled={!canPost || !content.trim()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={canPost && content.trim() ? ['#4CAF50', '#66BB6A'] : ['#ccc', '#ddd']}
                style={styles.buttonGradient}
              >
                {isCreating ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="create-outline" size={20} color="#ffffff" />
                    <Text style={styles.buttonText}>Post Text</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.photoButton, !canPost && styles.disabledButton]}
              onPress={() => setShowImageOptions(true)}
              disabled={!canPost}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={canPost ? ['#2196F3', '#42A5F5'] : ['#ccc', '#ddd']}
                style={styles.buttonGradient}
              >
                <Ionicons name="camera-outline" size={20} color="#ffffff" />
                <Text style={styles.buttonText}>Photo</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Spam Prevention Timer */}
          {timeUntilNextPost > 0 && (
            <View style={styles.timerContainer}>
              <LinearGradient
                colors={['#fff3cd', '#ffeaa7']}
                style={styles.timerGradient}
              >
                <Ionicons name="time-outline" size={16} color="#856404" />
                <Text style={styles.timerText}>
                  Wait {timeUntilNextPost}s to post again
                </Text>
              </LinearGradient>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#ffffff', '#f8f9fa']}
              style={styles.modalGradient}
            >
              <Text style={styles.modalTitle}>Choose Photo Option</Text>
              
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCreatePhotoPost}
                disabled={isCreating}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#9C27B0', '#BA68C8']}
                  style={styles.modalButtonGradient}
                >
                  <Ionicons name="images-outline" size={24} color="#ffffff" />
                  <Text style={styles.modalButtonText}>Choose from Gallery</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleTakePhoto}
                disabled={isCreating}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FF9800', '#FFB74D']}
                  style={styles.modalButtonGradient}
                >
                  <Ionicons name="camera" size={24} color="#ffffff" />
                  <Text style={styles.modalButtonText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowImageOptions(false)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#666', '#888']}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    fontWeight: '500',
  },
  characterCountContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  characterCountGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  characterCount: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  actionContainer: {
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  button: {
    borderRadius: 28,
    overflow: 'hidden',
    minWidth: 140,
    height: 56,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  textButton: {
    // Styles handled by gradient
  },
  photoButton: {
    // Styles handled by gradient
  },
  disabledButton: {
    // Styles handled by gradient
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  timerContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  timerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  timerText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
  },
  modalGradient: {
    padding: 32,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 32,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    height: 56,
  },
  modalButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default PostCreation;