export class EncryptDecryptService {

    /**
     * Encrpt secure data
     * @param  {any} dataToEncrypt
     */
    encrypt(dataToEncrypt: any) {
        return btoa(String(dataToEncrypt)); 
    };

    
    /**
     * Decrypt secure data
     * @param  {string} dataToDecrypt
     */
    decrypt(dataToDecrypt: string) {
        return new Uint8Array(atob(dataToDecrypt).split(',').map(t => Number(t)))
    }
}

