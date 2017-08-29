import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CacheService } from 'ng2-cache/ng2-cache';
import { EncryptDecryptService } from './encrypt-decrypt.service';

@Injectable()
export class CacheCustomService {


  /**
   * Constructor
   * @param  {CacheService} privatecacheService
   * @param  {EncryptDecryptService} privateencryptDecryptService
   */
  constructor(
    private cacheService: CacheService,
    private encryptDecryptService: EncryptDecryptService,
  ) {
    this.cacheService.setGlobalPrefix('');
  }

  /**
    * Checks if the passed key exists in cache
    * @param  {} keyToCheck
    * @returns Boolean
    */
  cacheKeyExists(keyToCheck): boolean { // To check whether data key already exists or not


    return (this.cacheService.exists(keyToCheck));

  };

  /**
   * Stores data to cache on the key specified
   * @param  {any} storeData
   * @param  {string} storekey
   * @param  {Boolean} isEnrypted
   * @returns void
   */
  storeDataToCache(storeData: any, storekey: string, isEnrypted: Boolean = false): void {
    if (isEnrypted) {
      storeData = this.encryptDecryptService.encrypt(storeData, storekey);
    }
    this.cacheService.set(storekey, storeData);
  }

  /**
   * Deletes the key specified from the cache
   * @param  {string} deleteKey
   * @returns void
   */
  deleteCacheKey(deleteKey: string): void { // Make data in the Key as null
    this.cacheService.set(deleteKey, null);
  };

  /**
   * Fetches the data stored on the key passed
   * @param  {string} userKey
   *  * @param  {Boolean} isDecrypted
   */
  getCachedData(userKey: string, isDecrypted: Boolean = false) {

    return (isDecrypted ?
      this.encryptDecryptService.decrypt(this.cacheService.get(userKey), userKey) :
      this.cacheService.get(userKey));
  };


  /**
   * Remove all cache data
   * @returns void
   */
  removeAllCacheData(): void {
    this.cacheService.removeAll();
  }

}

