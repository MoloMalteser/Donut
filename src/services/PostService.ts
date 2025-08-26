import { Post } from '../types';
import DatabaseService from './DatabaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';

class PostService {
  private readonly SPAM_PREVENTION_KEY = 'last_post_timestamp';
  private readonly SPAM_INTERVAL = 2 * 60 * 1000; // 2 minutes in milliseconds
  private readonly MAX_TEXT_LENGTH = 200;

  // Create a new text post
  async createTextPost(content: string): Promise<Post> {
    // Validate content
    if (!content.trim()) {
      throw new Error('Post content cannot be empty');
    }

    if (content.length > this.MAX_TEXT_LENGTH) {
      throw new Error(`Post content cannot exceed ${this.MAX_TEXT_LENGTH} characters`);
    }

    // Check spam prevention
    await this.checkSpamPrevention();

    // Perform moderation check
    const isAppropriate = await this.performModerationCheck(content);
    if (!isAppropriate) {
      throw new Error('Post content was flagged as inappropriate');
    }

    // Create post object
    const post: Post = {
      id: this.generatePostId(),
      content: content.trim(),
      type: 'text',
      timestamp: Date.now(),
      authorId: await this.getAuthorId(),
      hopCount: 0,
      isLocal: true
    };

    // Save to database
    await DatabaseService.savePost(post);

    // Update last post timestamp
    await this.updateLastPostTimestamp();

    return post;
  }

  // Create a new photo post
  async createPhotoPost(): Promise<Post> {
    // Check spam prevention
    await this.checkSpamPrevention();

    // Request camera permissions
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Camera permission is required to take photos');
    }

    // Show image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      throw new Error('No image selected');
    }

    const imageUri = result.assets[0].uri;

    // Perform moderation check on image (simulated)
    const isAppropriate = await this.performImageModerationCheck(imageUri);
    if (!isAppropriate) {
      throw new Error('Image was flagged as inappropriate');
    }

    // Create post object
    const post: Post = {
      id: this.generatePostId(),
      content: '📸 Photo post',
      type: 'photo',
      imageUri,
      timestamp: Date.now(),
      authorId: await this.getAuthorId(),
      hopCount: 0,
      isLocal: true
    };

    // Save to database
    await DatabaseService.savePost(post);

    // Update last post timestamp
    await this.updateLastPostTimestamp();

    return post;
  }

  // Take a photo using camera
  async takePhoto(): Promise<Post> {
    // Check spam prevention
    await this.checkSpamPrevention();

    // Request camera permissions
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Camera permission is required to take photos');
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      throw new Error('No photo taken');
    }

    const imageUri = result.assets[0].uri;

    // Perform moderation check on image (simulated)
    const isAppropriate = await this.performImageModerationCheck(imageUri);
    if (!isAppropriate) {
      throw new Error('Photo was flagged as inappropriate');
    }

    // Create post object
    const post: Post = {
      id: this.generatePostId(),
      content: '📷 Camera photo',
      type: 'photo',
      imageUri,
      timestamp: Date.now(),
      authorId: await this.getAuthorId(),
      hopCount: 0,
      isLocal: true
    };

    // Save to database
    await DatabaseService.savePost(post);

    // Update last post timestamp
    await this.updateLastPostTimestamp();

    return post;
  }

  // Check if user can post (spam prevention)
  private async checkSpamPrevention(): Promise<void> {
    const lastPostTime = await this.getLastPostTimestamp();
    const now = Date.now();

    if (lastPostTime && (now - lastPostTime) < this.SPAM_INTERVAL) {
      const remainingTime = Math.ceil((this.SPAM_INTERVAL - (now - lastPostTime)) / 1000);
      throw new Error(`Please wait ${remainingTime} seconds before creating another post`);
    }
  }

  // Get time until next post is allowed
  async getTimeUntilNextPost(): Promise<number> {
    const lastPostTime = await this.getLastPostTimestamp();
    if (!lastPostTime) return 0;

    const now = Date.now();
    const timeSinceLastPost = now - lastPostTime;
    
    if (timeSinceLastPost >= this.SPAM_INTERVAL) {
      return 0;
    }

    return Math.ceil((this.SPAM_INTERVAL - timeSinceLastPost) / 1000);
  }

  // Perform fake AI moderation check on text
  private async performModerationCheck(content: string): Promise<boolean> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple keyword-based moderation (replace with actual AI service)
    const inappropriateKeywords = [
      'spam', 'scam', 'hack', 'crack', 'illegal', 'harmful'
    ];

    const lowerContent = content.toLowerCase();
    const hasInappropriateContent = inappropriateKeywords.some(keyword => 
      lowerContent.includes(keyword)
    );

    // 95% chance of passing (simulating AI accuracy)
    const randomCheck = Math.random() > 0.05;
    
    return !hasInappropriateContent && randomCheck;
  }

  // Perform fake AI moderation check on image
  private async performImageModerationCheck(imageUri: string): Promise<boolean> {
    // Simulate AI image processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 98% chance of passing (simulating AI accuracy)
    return Math.random() > 0.02;
  }

  // Generate unique post ID
  private generatePostId(): string {
    return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get or generate author ID
  private async getAuthorId(): Promise<string> {
    const storedId = await AsyncStorage.getItem('author_id');
    if (storedId) {
      return storedId;
    }

    const newId = `user_${Math.random().toString(36).substr(2, 9)}`;
    await AsyncStorage.setItem('author_id', newId);
    return newId;
  }

  // Get last post timestamp
  private async getLastPostTimestamp(): Promise<number | null> {
    const timestamp = await AsyncStorage.getItem(this.SPAM_PREVENTION_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  }

  // Update last post timestamp
  private async updateLastPostTimestamp(): Promise<void> {
    await AsyncStorage.setItem(this.SPAM_PREVENTION_KEY, Date.now().toString());
  }

  // Get all posts
  async getAllPosts(): Promise<Post[]> {
    return DatabaseService.getAllPosts();
  }

  // Delete a post (only local posts)
  async deletePost(postId: string): Promise<void> {
    // In a real app, you'd implement post deletion
    // For now, we'll just return (posts auto-expire after 24 hours)
    console.log(`Delete post ${postId} requested`);
  }
}

export default new PostService();