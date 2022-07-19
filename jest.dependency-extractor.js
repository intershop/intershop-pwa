const crypto = require('crypto');
const fs = require('fs');

module.exports = {
  extract(code, filePath, defaultExtract) {
    if (/\.(module|facade)\.ts$/.test(filePath) && !/(store|shared)\.module\.ts$/.test(filePath)) {
      return new Set();
    }
    return defaultExtract(code, filePath);
  },

  getCacheKey() {
    return crypto.createHash('md5').update(fs.readFileSync(__filename)).digest('hex');
  },
};
