import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PostComponent from '../components/Post';
import PostCreation from '../components/PostCreation';
import PostService from '../services/PostService';
import { Post } from '../types';

const { width } = Dimensions.get('window');

const FeedScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasPosts, setHasPosts] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      const allPosts = await PostService.getAllPosts();
      setPosts(allPosts);
      setHasPosts(allPosts.length > 0);
    } catch (error) {
      console.error('Failed to load posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadPosts();
  }, [loadPosts]);

  const handlePostCreated = useCallback(async () => {
    await loadPosts();
  }, [loadPosts]);

  const handlePostPress = useCallback((post: Post) => {
    // In a real app, you might want to show post details or actions
    console.log('Post pressed:', post.id);
  }, []);

  const renderPost = useCallback(({ item }: { item: Post }) => (
    <PostComponent post={item} onPress={() => handlePostPress(item)} />
  ), [handlePostPress]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <LinearGradient
          colors={['#e0e0e0', '#f5f5f5']}
          style={styles.emptyIconGradient}
        >
          <Ionicons name="chatbubble-outline" size={64} color="#999" />
        </LinearGradient>
      </View>
      <Text style={styles.emptyStateTitle}>No posts yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Create your first post or wait for nearby devices to share content!
      </Text>
    </View>
  );

  const renderHeader = () => (
    <LinearGradient
      colors={['#4CAF50', '#66BB6A']}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>🍩 Donut Feed</Text>
          <Text style={styles.headerSubtitle}>
            {hasPosts ? `${posts.length} posts` : 'Share and discover posts offline'}
          </Text>
        </View>
        <View style={styles.headerIcon}>
          <LinearGradient
            colors={['#ffffff', '#f0f0f0']}
            style={styles.iconGradient}
          >
            <Text style={styles.iconText}>🍩</Text>
          </LinearGradient>
        </View>
      </View>
    </LinearGradient>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <LinearGradient
            colors={['#4CAF50', '#66BB6A']}
            style={styles.loadingIconGradient}
          >
            <Text style={styles.loadingEmoji}>🍩</Text>
          </LinearGradient>
        </View>
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {renderHeader()}
            <PostCreation onPostCreated={handlePostCreated} />
          </>
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
            progressBackgroundColor="#ffffff"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  loadingIconGradient: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  loadingEmoji: {
    fontSize: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 22,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  iconGradient: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  iconText: {
    fontSize: 32,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
});

export default FeedScreen;