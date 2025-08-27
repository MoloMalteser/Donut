import { Post } from '../types';

export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const formatHopCount = (hopCount: number): string => {
  if (hopCount === 0) return 'Original';
  if (hopCount === 1) return '1 hop';
  return `${hopCount} hops`;
};

export const isPostExpired = (timestamp: number, maxAgeHours: number = 24): boolean => {
  const now = Date.now();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  return (now - timestamp) > maxAgeMs;
};

export const validatePostContent = (content: string): { isValid: boolean; error?: string } => {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: 'Post content cannot be empty' };
  }
  
  if (content.length > 500) {
    return { isValid: false, error: 'Post content must be less than 500 characters' };
  }
  
  return { isValid: true };
};