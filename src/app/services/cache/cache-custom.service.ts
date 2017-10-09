import { Injectable } from '@angular/core';

@Injectable()
export class CacheCustomService {


  /**
   * Constructor
   */
  constructor() {
  }

  /**
    * Checks if the passed key exists in cache
    * @param  {} keyToCheck
    * @returns Boolean
    */
  cacheKeyExists(keyToCheck): boolean { // To check whether data key already exists or not
    return false;
  }

  /**
   * Stores data to cache on the key specified
   * @param  {any} storeData
   * @param  {string} storekey
   * @param  {Boolean} isEnrypted
   * @returns void
   */
  storeDataToCache(storeData: any, storekey: string, isEnrypted: Boolean = false): void {
  }

  /**
   * Deletes the key specified from the cache
   * @param  {string} deleteKey
   * @returns void
   */
  deleteCacheKey(deleteKey: string): void {
  }

  /**
   * Fetches the data stored on the key passed
   * @param  {string} userKey
   *  * @param  {Boolean} isDecrypted
   */
  getCachedData(userKey: string, isDecrypted: Boolean = false) {
    return null;
  }


  /**
   * Remove all cache data
   * @returns void
   */
  removeAllCacheData(): void {
  }

}

