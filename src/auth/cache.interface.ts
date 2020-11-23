export default interface CacheInterface {
  set(key, values): Promise<void>;
  get(key): Promise<string>;
}
