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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PostService from '../services/PostService';
import { validatePostContent } from '../utils/helpers';

interface PostCreationProps {
  onPostCreated: () => void;
}

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
      {/* Text Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="What's happening? (max 200 chars)"
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={200}
          editable={canPost}
        />
        <Text style={styles.characterCount}>
          {content.length}/200
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.textButton, !canPost && styles.disabledButton]}
            onPress={handleCreateTextPost}
            disabled={!canPost || !content.trim()}
          >
            {isCreating ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Ionicons name="create-outline" size={20} color="#ffffff" />
                <Text style={styles.buttonText}>Post Text</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.photoButton, !canPost && styles.disabledButton]}
            onPress={() => setShowImageOptions(true)}
            disabled={!canPost}
          >
            <Ionicons name="camera-outline" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Spam Prevention Timer */}
        {timeUntilNextPost > 0 && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              ⏰ Wait {timeUntilNextPost}s to post again
            </Text>
          </View>
        )}
      </View>

      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Photo Option</Text>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.galleryButton]}
              onPress={handleCreatePhotoPost}
              disabled={isCreating}
            >
              <Ionicons name="images-outline" size={24} color="#ffffff" />
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cameraButton]}
              onPress={handleTakePhoto}
              disabled={isCreating}
            >
              <Ionicons name="camera" size={24} color="#ffffff" />
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowImageOptions(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionContainer: {
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: 'center',
    gap: 8,
  },
  textButton: {
    backgroundColor: '#4CAF50',
  },
  photoButton: {
    backgroundColor: '#2196F3',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  timerText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    minWidth: 200,
    justifyContent: 'center',
    gap: 12,
  },
  galleryButton: {
    backgroundColor: '#9C27B0',
  },
  cameraButton: {
    backgroundColor: '#FF9800',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PostCreation;