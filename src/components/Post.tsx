import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Post as PostType } from '../types';
import { formatRelativeTime, formatHopCount, isPostExpired } from '../utils/helpers';

interface PostProps {
  post: PostType;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

const PostComponent: React.FC<PostProps> = ({ post, onPress }) => {
  const isExpired = isPostExpired(post.timestamp);

  if (isExpired) {
    return null; // Don't render expired posts
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Modern Card with Gradient Border */}
      <LinearGradient
        colors={post.isLocal ? ['#4CAF50', '#66BB6A'] : ['#2196F3', '#42A5F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View style={[styles.card, post.isLocal && styles.localPost]}>
          {/* Post Header */}
          <View style={styles.header}>
            <View style={styles.authorInfo}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorInitial}>
                  {post.isLocal ? '🍩' : '📱'}
                </Text>
              </View>
              <View style={styles.authorDetails}>
                <Text style={styles.authorId}>
                  {post.isLocal ? 'You' : `Device ${post.authorId.slice(-4)}`}
                </Text>
                <Text style={styles.timestamp}>{formatRelativeTime(post.timestamp)}</Text>
              </View>
            </View>
            <View style={styles.hopCount}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.hopCountGradient}
              >
                <Text style={styles.hopCountText}>{formatHopCount(post.hopCount)}</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Post Content */}
          <View style={styles.content}>
            {post.type === 'text' ? (
              <Text style={styles.textContent}>{post.content}</Text>
            ) : (
              <View style={styles.imageContainer}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: post.imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.imageCaption}>{post.content}</Text>
              </View>
            )}
          </View>

          {/* Post Footer */}
          <View style={styles.footer}>
            <View style={styles.postType}>
              <LinearGradient
                colors={post.type === 'text' ? ['#9C27B0', '#BA68C8'] : ['#FF9800', '#FFB74D']}
                style={styles.postTypeGradient}
              >
                <Text style={styles.postTypeText}>
                  {post.type === 'text' ? '📝' : '📸'} {post.type}
                </Text>
              </LinearGradient>
            </View>
            {post.isLocal && (
              <View style={styles.localBadge}>
                <LinearGradient
                  colors={['#4CAF50', '#66BB6A']}
                  style={styles.localBadgeGradient}
                >
                  <Text style={styles.localBadgeText}>Local</Text>
                </LinearGradient>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  gradientBorder: {
    borderRadius: 24,
    padding: 2,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  localPost: {
    backgroundColor: '#f8fff8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authorInitial: {
    fontSize: 20,
  },
  authorDetails: {
    flex: 1,
  },
  authorId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  hopCount: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  hopCountGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hopCountText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  content: {
    marginBottom: 16,
  },
  textContent: {
    fontSize: 17,
    color: '#1a1a1a',
    lineHeight: 24,
    fontWeight: '500',
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: width - 80,
    height: 220,
    borderRadius: 20,
  },
  imageCaption: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postType: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  postTypeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  postTypeText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '700',
  },
  localBadge: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  localBadgeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  localBadgeText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '700',
  },
});

export default PostComponent;