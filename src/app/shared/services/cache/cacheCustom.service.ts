import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';
import { EncryptDecryptService } from './encryptDecrypt.service';
import { CompressDecompressService } from './compressDecompress.service';


@Injectable()
export class CacheCustomService {
  private key: string;
  private maximumAge: number = 5 * 60; // Maximum age of cache
  constructor(
    private cacheService: CacheService,
    private encryptDecryptService: EncryptDecryptService,
    private compressDecompressService: CompressDecompressService) {
    this.cacheService.useStorage(CacheStoragesEnum.LOCAL_STORAGE); // Use local storage
  }

  /**
   * Checks if the passed key exists in cache
   * @param  {} keyToCheck
   * @returns Boolean
   */
  cacheKeyExists(keyToCheck): Boolean { // To check whether data key already exists or not
    if (this.cacheService.exists(keyToCheck) && this.cacheService.get(keyToCheck) != null) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Stores data to cache on the key specified
   * @param  {any} storeData
   * @param  {string} storekey
   * @param  {Boolean} toBeEnrypted
   * @returns void
   */
  storeDataToCache(storeData: any, storekey: string, toBeEnrypted: Boolean): void {
    if (!this.cacheKeyExists(storekey)) {
      const compressedData = this.compressDecompressService.compress(storeData);  // Takes JSON Data and returns Uint8Array
      let encryptedData;
      if (toBeEnrypted) {
        // .encrypt function takes Uint8Array and returns base-64:Encrypted string
        encryptedData = this.encryptDecryptService.encrypt(compressedData);
      }
      // To save cache and set maximum age of cache
      this.cacheService.set(storekey, encryptedData || compressedData, { maxAge: this.maximumAge });
    }
    else {
      return
    }
  }


  /**
   * Deletes the key specified from the cache
   * @param  {string} deleteKey
   * @returns void
   */
  deleteCacheKey(deleteKey: string): void { // Make data in the Key as null
    if (this.cacheKeyExists(deleteKey)) {
      this.cacheService.set(deleteKey, null, { maxAge: this.maximumAge });
    }
    else {
      return
    }
  }

  /**
   * Fetches the data stored on the key passed
   * @param  {string} userKey
   */
  getCachedData(userKey: string) {
    let cachedCompressedDecrypted, cahcedCompressed;
    if (typeof this.cacheService.get(userKey) === 'string') { // cached data was compressed and  encrypted as well
      cachedCompressedDecrypted = this.encryptDecryptService.decrypt(this.cacheService.get(userKey));
    } else {
      // cahched data was only compressed, not encrypted
      cahcedCompressed = this.cacheService.get(userKey);
    }
    const dataToDecompress = cachedCompressedDecrypted || Uint8Array.from(this.getCompressedArray(cahcedCompressed));
    return this.compressDecompressService.decompress(dataToDecompress);
  }

  /**
   * Returns compressed array
   * @param  {} cachedData
   * @returns number
   */
  getCompressedArray(cachedData): number[] {
    // convert the object to an array as Uint8Array.from() requires an array to convert it to unit8Array
    const temporaryArray: number[] = [];
    for (const i in cachedData) {
      if (cachedData.hasOwnProperty(i)) {
        temporaryArray[i] = cachedData[i];
      }
    }
    return temporaryArray;
  }
}
