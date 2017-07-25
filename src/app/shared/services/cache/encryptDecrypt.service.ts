import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptDecryptService {

    /**
     * Encrpt secure data
     * @param  {any} dataToEncrypt
     */
    encrypt(dataToEncrypt: any, key: string): string {
        return CryptoJS.AES.encrypt(JSON.stringify(dataToEncrypt), key).toString();
    };


    /**
     * Decrypt secure data
     * @param  {string} dataToDecrypt
     */
    decrypt(dataToDecrypt: any, key: string): any {
        // Decrypt 
        var bytes = CryptoJS.AES.decrypt(dataToDecrypt, key);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
}

