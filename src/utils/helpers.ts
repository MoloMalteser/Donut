// Format timestamp to relative time (e.g., "2 minutes ago")
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
};

// Format timestamp to readable date
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format hop count with emoji
export const formatHopCount = (hopCount: number): string => {
  if (hopCount === 0) {
    return '🍩 Direct';
  } else if (hopCount === 1) {
    return '🍩 1 hop';
  } else {
    return `🍩 ${hopCount} hops`;
  }
};

// Check if post is expired (older than 24 hours)
export const isPostExpired = (timestamp: number): boolean => {
  const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
  return timestamp < twentyFourHoursAgo;
};

// Generate random device name
export const generateDeviceName = (): string => {
  const adjectives = ['Cool', 'Amazing', 'Awesome', 'Epic', 'Fantastic', 'Incredible'];
  const nouns = ['Phone', 'Device', 'Gadget', 'Machine', 'Thing'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective} ${randomNoun}`;
};

// Truncate text to specified length
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Validate post content
export const validatePostContent = (content: string, maxLength: number = 200): string | null => {
  if (!content.trim()) {
    return 'Post content cannot be empty';
  }
  
  if (content.length > maxLength) {
    return `Post content cannot exceed ${maxLength} characters`;
  }
  
  return null;
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};