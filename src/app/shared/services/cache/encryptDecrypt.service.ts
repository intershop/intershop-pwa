
export class EncryptDecryptService {
    encrypt(dataToEncrypt) {
        return btoa(String(dataToEncrypt)); // string => encrypted string
    }

    decrypt(dataToDecrypt: string) {
        return new Uint8Array(atob(dataToDecrypt).split(',').map(t => Number(t)))
    }
}

