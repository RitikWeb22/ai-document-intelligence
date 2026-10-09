import fs from 'fs/promises';
import path from 'path';
import { env } from '../../config/env.js';

class StorageService {
  constructor() {
    this.localPath = env.STORAGE_LOCAL_PATH;
    this.ensureDirectory();
  }

  async ensureDirectory() {
    try {
      await fs.mkdir(this.localPath, { recursive: true });
    } catch (err) {
      // Directory exists or created
    }
  }

  async saveFile(buffer, filename) {
    await this.ensureDirectory();
    const uniqueKey = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(this.localPath, uniqueKey);
    await fs.writeFile(filePath, buffer);
    return {
      storageKey: uniqueKey,
      path: filePath
    };
  }

  async getFileBuffer(storageKey) {
    const filePath = path.join(this.localPath, storageKey);
    return await fs.readFile(filePath);
  }

  async deleteFile(storageKey) {
    try {
      const filePath = path.join(this.localPath, storageKey);
      await fs.unlink(filePath);
      return true;
    } catch (err) {
      // Silently ignore if file already removed
      return false;
    }
  }
}

export const storageService = new StorageService();
