import * as SQLite from 'expo-sqlite';
import { Post } from '../types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabase('donut.db');
    this.initDatabase();
  }

  private initDatabase(): void {
    this.db.transaction(tx => {
      // Create posts table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS posts (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          type TEXT NOT NULL,
          imageUri TEXT,
          timestamp INTEGER NOT NULL,
          authorId TEXT NOT NULL,
          hopCount INTEGER DEFAULT 0,
          isLocal INTEGER DEFAULT 0
        );`
      );

      // Create users table for device tracking
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          deviceName TEXT NOT NULL,
          lastSeen INTEGER NOT NULL
        );`
      );
    });
  }

  // Save a new post
  async savePost(post: Post): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `INSERT OR REPLACE INTO posts (id, content, type, imageUri, timestamp, authorId, hopCount, isLocal)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            post.id,
            post.content,
            post.type,
            post.imageUri || null,
            post.timestamp,
            post.authorId,
            post.hopCount,
            post.isLocal ? 1 : 0
          ],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Get all posts (local and received)
  async getAllPosts(): Promise<Post[]> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM posts ORDER BY timestamp DESC`,
          [],
          (_, { rows }) => {
            const posts: Post[] = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              posts.push({
                ...row,
                isLocal: Boolean(row.isLocal),
                imageUri: row.imageUri || undefined
              });
            }
            resolve(posts);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Get posts that don't exist on another device
  async getPostsForSync(existingIds: string[]): Promise<Post[]> {
    if (existingIds.length === 0) {
      return this.getAllPosts();
    }

    const placeholders = existingIds.map(() => '?').join(',');
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM posts WHERE id NOT IN (${placeholders})`,
          existingIds,
          (_, { rows }) => {
            const posts: Post[] = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              posts.push({
                ...row,
                isLocal: Boolean(row.isLocal),
                imageUri: row.imageUri || undefined
              });
            }
            resolve(posts);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Delete expired posts (older than 24 hours)
  async deleteExpiredPosts(): Promise<void> {
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM posts WHERE timestamp < ?`,
          [twentyFourHoursAgo],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Check if post exists
  async postExists(postId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `SELECT COUNT(*) as count FROM posts WHERE id = ?`,
          [postId],
          (_, { rows }) => {
            resolve(rows.item(0).count > 0);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Update hop count for a post
  async updateHopCount(postId: string, newHopCount: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `UPDATE posts SET hopCount = ? WHERE id = ?`,
          [newHopCount, postId],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }
}

export default new DatabaseService();