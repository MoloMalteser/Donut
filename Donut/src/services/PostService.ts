import { launchImageLibrary, launchCamera, ImagePickerResponse, Image } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '../types';
import DatabaseService from './DatabaseService';
import { generateId, validatePostContent } from '../utils/helpers';

class PostService {
  private readonly SPAM_INTERVAL = 2 * 60 * 1000; // 2 minutes in milliseconds

  async createTextPost(content: string): Promise<Post> {
    // Validate content
    if (!validatePostContent(content)) {
      throw new Error('Invalid post content');
    }

    // Check spam prevention
    await this.checkSpamPrevention();

    // Simulate AI moderation check
    if (await this.isContentInappropriate(content)) {
      throw new Error('Content flagged as inappropriate');
    }

    const post: Post = {
      id: generateId(),
      content,
      type: 'text',
      imageUri: null,
      timestamp: Date.now(),
      authorId: await this.getAuthorId(),
      hopCount: 0,
      isLocal: true,
    };

    await DatabaseService.savePost(post);
    await this.updateLastPostTimestamp();

    return post;
  }

  async createPhotoPost(): Promise<Post> {
    // Check spam prevention
    await this.checkSpamPrevention();

    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      });

      if (result.didCancel || result.errorCode) {
        throw new Error('Photo selection cancelled or failed');
      }

      if (!result.assets || result.assets.length === 0) {
        throw new Error('No photo selected');
      }

      const asset = result.assets[0];
      if (!asset.uri) {
        throw new Error('Photo URI not found');
      }

      // Simulate AI moderation check for images
      if (await this.isImageInappropriate(asset.uri)) {
        throw new Error('Image flagged as inappropriate');
      }

      const post: Post = {
        id: generateId(),
        content: '📸 Photo post',
        type: 'photo',
        imageUri: asset.uri,
        timestamp: Date.now(),
        authorId: await this.getAuthorId(),
        hopCount: 0,
        isLocal: true,
      };

      await DatabaseService.savePost(post);
      await this.updateLastPostTimestamp();

      return post;
    } catch (error) {
      console.error('Error creating photo post:', error);
      throw error;
    }
  }

  async takePhotoPost(): Promise<Post> {
    // Check spam prevention
    await this.checkSpamPrevention();

    try {
      const result: ImagePickerResponse = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
        saveToPhotos: true,
      });

      if (result.didCancel || result.errorCode) {
        throw new Error('Photo capture cancelled or failed');
      }

      if (!result.assets || result.assets.length === 0) {
        throw new Error('No photo captured');
      }

      const asset = result.assets[0];
      if (!asset.uri) {
        throw new Error('Photo URI not found');
      }

      // Simulate AI moderation check for images
      if (await this.isImageInappropriate(asset.uri)) {
        throw new Error('Image flagged as inappropriate');
      }

      const post: Post = {
        id: generateId(),
        content: '📸 Photo post',
        type: 'photo',
        imageUri: asset.uri,
        timestamp: Date.now(),
        authorId: await this.getAuthorId(),
        hopCount: 0,
        isLocal: true,
      };

      await DatabaseService.savePost(post);
      await this.updateLastPostTimestamp();

      return post;
    } catch (error) {
      console.error('Error taking photo post:', error);
      throw error;
    }
  }

  private async checkSpamPrevention(): Promise<void> {
    const lastPostTime = await this.getLastPostTimestamp();
    const now = Date.now();
    
    if (lastPostTime && (now - lastPostTime) < this.SPAM_INTERVAL) {
      const remainingTime = Math.ceil((this.SPAM_INTERVAL - (now - lastPostTime)) / 1000);
      throw new Error(`Please wait ${remainingTime} seconds before creating another post`);
    }
  }

  private async getAuthorId(): Promise<string> {
    try {
      let authorId = await AsyncStorage.getItem('authorId');
      if (!authorId) {
        authorId = `user_${generateId()}`;
        await AsyncStorage.setItem('authorId', authorId);
      }
      return authorId;
    } catch (error) {
      console.error('Error getting author ID:', error);
      return `user_${generateId()}`;
    }
  }

  private async getLastPostTimestamp(): Promise<number | null> {
    try {
      const timestamp = await AsyncStorage.getItem('last_post_timestamp');
      return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
      console.error('Error getting last post timestamp:', error);
      return null;
    }
  }

  private async updateLastPostTimestamp(): Promise<void> {
    try {
      await AsyncStorage.setItem('last_post_timestamp', Date.now().toString());
    } catch (error) {
      console.error('Error updating last post timestamp:', error);
    }
  }

  private async isContentInappropriate(content: string): Promise<boolean> {
    // Simulate AI moderation check
    const inappropriateWords = ['spam', 'inappropriate', 'bad'];
    const lowerContent = content.toLowerCase();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return inappropriateWords.some(word => lowerContent.includes(word));
  }

  private async isImageInappropriate(imageUri: string): Promise<boolean> {
    // Simulate AI image moderation check
    // In a real app, this would send the image to an AI service
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // For demo purposes, randomly flag some images as inappropriate
    return Math.random() < 0.1; // 10% chance of being flagged
  }

  getSpamInterval(): number {
    return this.SPAM_INTERVAL;
  }
}

export default new PostService();