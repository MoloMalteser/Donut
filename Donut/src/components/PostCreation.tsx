import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PostService from '../services/PostService';
import { Post } from '../types';

interface PostCreationProps {
  onPostCreated: (post: Post) => void;
}

const PostCreation: React.FC<PostCreationProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const checkSpamTimer = async () => {
      try {
        const lastPostTime = await PostService.getLastPostTimestamp?.() || 0;
        const now = Date.now();
        const timeSinceLastPost = now - lastPostTime;
        const spamInterval = PostService.getSpamInterval();
        
        if (timeSinceLastPost < spamInterval) {
          setTimeRemaining(Math.ceil((spamInterval - timeSinceLastPost) / 1000));
        } else {
          setTimeRemaining(0);
        }
      } catch (error) {
        console.error('Error checking spam timer:', error);
      }
    };

    checkSpamTimer();
    const interval = setInterval(checkSpamTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateTextPost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    setIsLoading(true);
    try {
      const post = await PostService.createTextPost(content.trim());
      setContent('');
      onPostCreated(post);
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePhotoPost = async () => {
    setIsLoading(true);
    try {
      const post = await PostService.createPhotoPost();
      onPostCreated(post);
      Alert.alert('Success', 'Photo post created successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create photo post');
    } finally {
      setIsLoading(false);
      setShowImageOptions(false);
    }
  };

  const handleTakePhotoPost = async () => {
    setIsLoading(true);
    try {
      const post = await PostService.takePhotoPost();
      onPostCreated(post);
      Alert.alert('Success', 'Photo post created successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create photo post');
    } finally {
      setIsLoading(false);
      setShowImageOptions(false);
    }
  };

  const canCreatePost = timeRemaining === 0 && !isLoading;

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Create Post</Text>
        {timeRemaining > 0 && (
          <LinearGradient
            colors={['#ff6b6b', '#ee5a24']}
            style={styles.timer}
          >
            <Text style={styles.timerText}>Wait {timeRemaining}s</Text>
          </LinearGradient>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="What's on your mind? (max 200 chars)"
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        value={content}
        onChangeText={setContent}
        maxLength={200}
        multiline
        editable={canCreatePost}
      />

      <View style={styles.characterCount}>
        <Text style={styles.characterCountText}>
          {content.length}/200
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !canCreatePost && styles.buttonDisabled]}
          onPress={handleCreateTextPost}
          disabled={!canCreatePost}
        >
          <LinearGradient
            colors={canCreatePost ? ['#4ecdc4', '#44a08d'] : ['#ccc', '#999']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating...' : 'Post Text'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !canCreatePost && styles.buttonDisabled]}
          onPress={() => setShowImageOptions(true)}
          disabled={!canCreatePost}
        >
          <LinearGradient
            colors={canCreatePost ? ['#ff6b6b', '#ee5a24'] : ['#ccc', '#999']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Photo</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showImageOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Choose Photo Option</Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCreatePhotoPost}
            >
              <LinearGradient
                colors={['#4ecdc4', '#44a08d']}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>Select from Gallery</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleTakePhotoPost}
            >
              <LinearGradient
                colors={['#ff6b6b', '#ee5a24']}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>Take New Photo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowImageOptions(false)}
            >
              <LinearGradient
                colors={['#95a5a6', '#7f8c8d']}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  timer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  characterCount: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  characterCountText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PostCreation;