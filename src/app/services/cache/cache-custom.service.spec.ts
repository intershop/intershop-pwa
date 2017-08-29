import { CacheService } from 'ng2-cache/ng2-cache';
import { EncryptDecryptService } from './encrypt-decrypt.service';
import { TestBed } from '@angular/core/testing'
import { CacheCustomService } from './cache-custom.service';
import { ReflectiveInjector } from '@angular/core';

describe('CacheCustom Service', () => {
    let mockCache;
    let mockEncrypt;
    let customCacheService: CacheCustomService;
    beforeEach(() => {
       const injector = ReflectiveInjector.resolveAndCreate([CacheService]);
        mockCache = injector.get(CacheService);
        mockEncrypt = new EncryptDecryptService();
        customCacheService = new CacheCustomService(mockCache, mockEncrypt);
    })

    TestBed.configureTestingModule({
        providers: [
            CacheService, EncryptDecryptService
        ]
    });

    it('should cache data with encryption', () => {
        customCacheService.storeDataToCache('My task is testing', 'task', true);
        expect(customCacheService.cacheKeyExists('task')).toBeTruthy();
    });

    it('should get Cached Data after decryption', () => {
        const cachedData = customCacheService.getCachedData('task', true);
        expect(cachedData).toContain('My task is testing');
    });

    it('should delete the key from cache', () => {
        customCacheService.deleteCacheKey('task');
        expect(customCacheService.cacheKeyExists('task')).toBeFalsy();
    });

    it('should cache data without encryption', () => {
        customCacheService.storeDataToCache('My task is testing and implementation', 'myTask', false);
        expect(customCacheService.cacheKeyExists('myTask')).toBeTruthy();
    });

    it('should get Cached Data', () => {
        const cachedData = customCacheService.getCachedData('myTask');
        expect(cachedData).toContain('My task is testing and implementation');
    });

    it('should try to delete the key from cache that doent exists', () => {
        customCacheService.deleteCacheKey('anyKey');
        expect(customCacheService.cacheKeyExists('anyKey')).toBeFalsy();
    });

    it('should  try to cache data with same key again', () => {
        customCacheService.storeDataToCache('Rewrite data to existing key', 'myTask', false);
        const cachedData = customCacheService.getCachedData('myTask');
        expect(cachedData).toContain('Rewrite data to existing key');
    });

    it('should  call removeAllCacheData method', () => {
        customCacheService.removeAllCacheData();
        const cachedData = customCacheService.getCachedData('myTask');
        expect(cachedData).toBeNull();
    });
});
