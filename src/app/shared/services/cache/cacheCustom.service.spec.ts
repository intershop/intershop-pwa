import { CacheService, CacheStorageAbstract } from 'ng2-cache/ng2-cache';
import { EncryptDecryptService } from './encryptDecrypt.service';
import { TestBed, async, ComponentFixture } from '@angular/core/testing'
import { CompressDecompressService } from "./compressDecompress.service";
import { CacheCustomService } from "./cacheCustom.service";

describe('Cache Service', () => {
    let mockCache, mockEncrypt, mockCompress;
    let customCacheService: CacheCustomService;
    let cacheStorageAbstract : CacheStorageAbstract
    beforeEach(() => {
        mockCache = new CacheService(cacheStorageAbstract);
        mockCompress = new CompressDecompressService();
        mockEncrypt = new EncryptDecryptService();
        customCacheService = new CacheCustomService(mockCache, mockEncrypt, mockCompress);
    })

    TestBed.configureTestingModule({
        providers: [
            CacheService, EncryptDecryptService, CompressDecompressService
        ]
    });

    it('should cache data with encryption', () => {
        customCacheService.storeDataToCache("My task is testing", 'task', true);
        expect(customCacheService.cacheKeyExists('task')).toBeTruthy();
    });

    it('should get Cached Data after decryption', () => {
       let cachedData = customCacheService.getCachedData('task');
        expect(cachedData).toContain('My task is testing');
    });

     it('should delete the key from cache', () => {
        customCacheService.deleteCacheKey('task');
        expect(customCacheService.cacheKeyExists('task')).toBeFalsy();
    });

    it('should return an array', () => {
        let myObj = { 'name': 'intershop', 'id': 1 }
        let result = customCacheService.getCompressedArray(myObj)
        expect(result).not.toBeNull;
    });

    it('should cache data without encryption', () => {
        customCacheService.storeDataToCache("My task is testing and implementation", 'myTask', false);
        expect(customCacheService.cacheKeyExists('myTask')).toBeTruthy();
    });

    it('should get Cached Data', () => {
       let cachedData = customCacheService.getCachedData('myTask');
        expect(cachedData).toContain('My task is testing and implementation');
    });

    it('should try to delete the key from cache that doent exists', () => {
        customCacheService.deleteCacheKey('anyKey');
        expect(customCacheService.cacheKeyExists('anyKey')).toBeFalsy();
    });

    it('should  try to cache data with same key again', () => {
        customCacheService.storeDataToCache("Rewrite data to existing key", 'myTask', false);
        let cachedData = customCacheService.getCachedData('myTask');
        expect(cachedData).toContain('My task is testing and implementation');
    });
})





