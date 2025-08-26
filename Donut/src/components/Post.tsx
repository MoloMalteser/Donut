import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Post as PostType } from '../types';
import { formatRelativeTime, formatHopCount } from '../utils/helpers';

interface PostProps {
  post: PostType;
}

const { width } = Dimensions.get('window');

const Post: React.FC<PostProps> = ({ post }) => {
  const authorInitial = post.authorId.charAt(0).toUpperCase();
  const authorAvatar = `https://ui-avatars.com/api/?name=${authorInitial}&background=random&color=fff&size=40`;

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Image source={{ uri: authorAvatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.authorId}>{post.authorId}</Text>
          <Text style={styles.timestamp}>{formatRelativeTime(post.timestamp)}</Text>
        </View>
        <View style={styles.badges}>
          <LinearGradient
            colors={['#ff6b6b', '#ee5a24']}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>{post.type}</Text>
          </LinearGradient>
          <LinearGradient
            colors={['#4ecdc4', '#44a08d']}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>🍩 {formatHopCount(post.hopCount)}</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.postText}>{post.content}</Text>
        {post.imageUri && (
          <Image source={{ uri: post.imageUri }} style={styles.postImage} />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    padding: 16,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  authorId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    gap: 12,
  },
  postText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  postImage: {
    width: width - 64,
    height: 200,
    borderRadius: 12,
    alignSelf: 'center',
  },
});

export default Post;