// interface Album {
//   id: string
//   title: string
//   artist: string
//   cover: string
//   spotifyUrl: string
// }

// type CacheEntry<T> = {
//   data: T;
//   timestamp: number;
// };

// const cache = new Map<string, CacheEntry<any>>();
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// export async function getCachedData<T>(
//   key: string,
//   fetcher: () => Promise<T>
// ): Promise<T> {
//   const cached = cache.get(key);
//   const now = Date.now();

//   if (cached && now - cached.timestamp < CACHE_DURATION) {
//     return cached.data;
//   }

//   const data = await fetcher();
//   cache.set(key, { data, timestamp: now });
//   return data;
// }
