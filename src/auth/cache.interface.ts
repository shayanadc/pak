export default interface CacheInterface {
  set(key, values): Promise<void>;
}
