import SQLite from 'react-native-sqlite-storage';
import { Post } from '../types';

// Enable debugging
SQLite.DEBUG(true);
SQLite.enablePromise(true);

class DatabaseService {
  private database: SQLite.SQLiteDatabase | null = null;

  async initDatabase(): Promise<void> {
    try {
      this.database = await SQLite.openDatabase({
        name: 'DonutDB',
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const createPostsTable = `
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        imageUri TEXT,
        timestamp INTEGER NOT NULL,
        authorId TEXT NOT NULL,
        hopCount INTEGER DEFAULT 0,
        isLocal INTEGER DEFAULT 0
      );
    `;

    try {
      await this.database.executeSql(createPostsTable);
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  async savePost(post: Post): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const insertQuery = `
      INSERT OR REPLACE INTO posts (id, content, type, imageUri, timestamp, authorId, hopCount, isLocal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await this.database.executeSql(insertQuery, [
        post.id,
        post.content,
        post.type,
        post.imageUri || null,
        post.timestamp,
        post.authorId,
        post.hopCount,
        post.isLocal ? 1 : 0,
      ]);
      console.log('Post saved successfully:', post.id);
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  }

  async getPosts(): Promise<Post[]> {
    if (!this.database) throw new Error('Database not initialized');

    const selectQuery = `
      SELECT * FROM posts 
      ORDER BY timestamp DESC
    `;

    try {
      const [results] = await this.database.executeSql(selectQuery);
      const posts: Post[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        posts.push({
          id: row.id,
          content: row.content,
          type: row.type,
          imageUri: row.imageUri,
          timestamp: row.timestamp,
          authorId: row.authorId,
          hopCount: row.hopCount,
          isLocal: row.isLocal === 1,
        });
      }

      return posts;
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  }

  async deleteExpiredPosts(): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const deleteQuery = `
      DELETE FROM posts 
      WHERE timestamp < ?
    `;

    try {
      const result = await this.database.executeSql(deleteQuery, [twentyFourHoursAgo]);
      console.log(`Deleted ${result[0].rowsAffected} expired posts`);
    } catch (error) {
      console.error('Error deleting expired posts:', error);
      throw error;
    }
  }

  async postExists(postId: string): Promise<boolean> {
    if (!this.database) throw new Error('Database not initialized');

    const selectQuery = `
      SELECT COUNT(*) as count FROM posts WHERE id = ?
    `;

    try {
      const [results] = await this.database.executeSql(selectQuery, [postId]);
      const count = results.rows.item(0).count;
      return count > 0;
    } catch (error) {
      console.error('Error checking if post exists:', error);
      return false;
    }
  }

  async getPostsForSync(): Promise<Post[]> {
    if (!this.database) throw new Error('Database not initialized');

    const selectQuery = `
      SELECT * FROM posts 
      WHERE isLocal = 1
      ORDER BY timestamp DESC
    `;

    try {
      const [results] = await this.database.executeSql(selectQuery);
      const posts: Post[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        posts.push({
          id: row.id,
          content: row.content,
          type: row.type,
          imageUri: row.imageUri,
          timestamp: row.timestamp,
          authorId: row.authorId,
          hopCount: row.hopCount,
          isLocal: row.isLocal === 1,
        });
      }

      return posts;
    } catch (error) {
      console.error('Error getting posts for sync:', error);
      throw error;
    }
  }

  async updateHopCount(postId: string, newHopCount: number): Promise<void> {
    if (!this.database) throw new Error('Database not initialized');

    const updateQuery = `
      UPDATE posts 
      SET hopCount = ? 
      WHERE id = ?
    `;

    try {
      await this.database.executeSql(updateQuery, [newHopCount, postId]);
      console.log(`Updated hop count for post ${postId} to ${newHopCount}`);
    } catch (error) {
      console.error('Error updating hop count:', error);
      throw error;
    }
  }

  async closeDatabase(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
      console.log('Database closed');
    }
  }
}

export default new DatabaseService();