const THUMBNAIL_MAX_SIZE = 200;

const THUMBNAIL_QUALITY = 0.7;

/**
 * Downscales an image data URL to a small JPEG data URL (longest side at most `maxSize` px), so it
 * can be persisted with the chat transcript without filling up localStorage.
 *
 * Resolves `undefined` when the image cannot be decoded or the browser has no canvas support.
 */
export function createImageThumbnail(dataUrl: string, maxSize = THUMBNAIL_MAX_SIZE): Promise<string | undefined> {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        resolve(undefined);
        return;
      }
      // JPEG has no alpha channel; without a background transparent areas turn black
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', THUMBNAIL_QUALITY));
    };
    image.onerror = () => resolve(undefined);
    image.src = dataUrl;
  });
}
