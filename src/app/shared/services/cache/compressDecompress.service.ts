
declare const require: any;
const LZUTF8 = require('lzutf8');

export class CompressDecompressService {

    compress(dataToCompress: any) {
        return LZUTF8.compress(JSON.stringify(dataToCompress)); // string => Uint8Array(489)
    }

    decompress(dataToDeCompress: any) {
        return JSON.parse(LZUTF8.decompress(dataToDeCompress));
    }
}
