import CacheInterface from './cache.interface';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

export class CacheProvider implements CacheInterface {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key, values): Promise<void> {
    await this.cacheManager.set(key, values, { ttl: 36000 });
  }
  async get(key): Promise<string> {
    return await this.cacheManager.get(key);
  }
}
