import {Injectable, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {CacheService, CacheStoragesEnum} from 'ng2-cache/ng2-cache';
import {EncryptDecryptService} from './encryptDecrypt.service';
import {CompressDecompressService} from './compressDecompress.service';


@Injectable()
export class CacheCustomService implements OnInit {
  private key: string;
  private maximumAge: number = 5 * 60; // Maximum age of cache
  constructor(private http: Http,
              private cacheService: CacheService,
              private encryptDecryptService: EncryptDecryptService,
              private compressDecompressService: CompressDecompressService) {
  }

  ngOnInit() {
    this.cacheService.useStorage(CacheStoragesEnum.LOCAL_STORAGE); // Use local storage
  }

  CacheKeyExists(keyToCheck) { // To check whether data key already exists or not
    if (this.cacheService.exists(keyToCheck) && this.cacheService.get(keyToCheck) != null) {
      return true;
    } else {
      return false;
    }
  }

  StoreDataToCache(storeData: any, storekey: string, toBeEnrypted: Boolean) {
    if (!this.CacheKeyExists(storekey)) {
      const compressedData = this.compressDecompressService.compress(storeData);  // Takes JSON Data and returns Uint8Array
      let encryptedData;
      if (toBeEnrypted) {
        // .encrypt function takes Uint8Array and returns base-64:Encrypted string
        encryptedData = this.encryptDecryptService.encrypt(compressedData);
      }
      // To save cache and set maximum age of cache
      this.cacheService.set(storekey, encryptedData || compressedData, {maxAge: this.maximumAge});
    }
  }

  DeleteCacheKey(deleteKey: string) { // Make data in the Key as null
    if (this.CacheKeyExists(deleteKey)) {
      this.cacheService.set(deleteKey, null, {maxAge: this.maximumAge});
    }
  }

  GetCachedData(userKey: string) {
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

  getCompressedArray(cahcedData) {
    // convert the object to an array as Uint8Array.from() requires an array to convert it to unit8Array
    const temporaryArray = [];
    for (const i in cahcedData) {
      if (cahcedData.hasOwnProperty(i)) {
        temporaryArray[i] = cahcedData[i];
      }
    }
    return temporaryArray;
  }
}
