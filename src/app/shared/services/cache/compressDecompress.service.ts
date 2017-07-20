
declare const require: any;
const LZUTF8 = require('lzutf8');

export class CompressDecompressService {

    /**
     * Compress data
     * @param  {any} dataToCompress
     */
    compress(dataToCompress: any) {
        return LZUTF8.compress(JSON.stringify(dataToCompress)); // string => Uint8Array(489)
    };

    
    /**
     * Decompress data
     * @param  {any} dataToDeCompress
     */
    decompress(dataToDeCompress: any) {
        return JSON.parse(LZUTF8.decompress(dataToDeCompress));
    };
}

