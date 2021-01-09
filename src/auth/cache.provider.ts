import CacheInterface from './cache.interface';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

export class CacheProvider implements CacheInterface {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key, values): Promise<void> {
    const set = await this.cacheManager.set(key, values, { ttl: 136000 });
  }
  async get(key): Promise<string> {
    const set = await this.cacheManager.get(key);
    return set;
  }
}
