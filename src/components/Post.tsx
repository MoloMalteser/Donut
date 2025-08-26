import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
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
      style={[styles.container, post.isLocal && styles.localPost]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Post Header */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorId}>
            {post.isLocal ? 'You' : `Device ${post.authorId.slice(-4)}`}
          </Text>
          <Text style={styles.timestamp}>{formatRelativeTime(post.timestamp)}</Text>
        </View>
        <View style={styles.hopCount}>
          <Text style={styles.hopCountText}>{formatHopCount(post.hopCount)}</Text>
        </View>
      </View>

      {/* Post Content */}
      <View style={styles.content}>
        {post.type === 'text' ? (
          <Text style={styles.textContent}>{post.content}</Text>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: post.imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.imageCaption}>{post.content}</Text>
          </View>
        )}
      </View>

      {/* Post Footer */}
      <View style={styles.footer}>
        <View style={styles.postType}>
          <Text style={styles.postTypeText}>
            {post.type === 'text' ? '📝' : '📸'} {post.type}
          </Text>
        </View>
        {post.isLocal && (
          <View style={styles.localBadge}>
            <Text style={styles.localBadgeText}>Local</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  localPost: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#f8fff8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  hopCount: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hopCountText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  content: {
    marginBottom: 12,
  },
  textContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: width - 64,
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  imageCaption: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postType: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postTypeText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  localBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  localBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default PostComponent;