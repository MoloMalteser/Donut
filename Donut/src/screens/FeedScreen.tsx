import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Post from '../components/Post';
import PostCreation from '../components/PostCreation';
import { Post as PostType } from '../types';
import DatabaseService from '../services/DatabaseService';

const FeedScreen: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
    // Set up periodic cleanup of expired posts
    const cleanupInterval = setInterval(() => {
      cleanupExpiredPosts();
    }, 300000); // Every 5 minutes

    return () => clearInterval(cleanupInterval);
  }, []);

  const loadPosts = async () => {
    try {
      const loadedPosts = await DatabaseService.getPosts();
      setPosts(loadedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cleanupExpiredPosts = async () => {
    try {
      await DatabaseService.deleteExpiredPosts();
      // Reload posts after cleanup
      await loadPosts();
    } catch (error) {
      console.error('Error cleaning up expired posts:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPosts();
    setIsRefreshing(false);
  };

  const handlePostCreated = useCallback((newPost: PostType) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  const renderPost = ({ item }: { item: PostType }) => (
    <Post post={item} />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.loadingGradient}
        >
          <Text style={styles.loadingIcon}>🍩</Text>
          <Text style={styles.loadingText}>Loading Donut posts...</Text>
          <ActivityIndicator color="#fff" size="large" style={styles.spinner} />
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.title}>🍩 Donut</Text>
        <Text style={styles.subtitle}>Share posts offline with nearby devices</Text>
      </LinearGradient>

      <PostCreation onPostCreated={handlePostCreated} />

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
        ListEmptyComponent={
          <LinearGradient
            colors={['#95a5a6', '#7f8c8d']}
            style={styles.emptyState}
          >
            <Text style={styles.emptyStateIcon}>🍩</Text>
            <Text style={styles.emptyStateTitle}>No posts yet!</Text>
            <Text style={styles.emptyStateText}>
              Create your first post or wait for nearby devices to share content with you.
            </Text>
          </LinearGradient>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingGradient: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '600',
  },
  spinner: {
    marginTop: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    margin: 20,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default FeedScreen;