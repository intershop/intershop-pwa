import { CopilotEmbeddedUpload } from './copilot-embedded-upload.model';

const THUMBNAIL_MAX_SIZE = 200;

const THUMBNAIL_QUALITY = 0.7;

export class CopilotEmbeddedUploadHelper {
  /**
   * Converts an image data URL to a small JPEG data URL (longest side at most `maxSize` px), so it
   * can be persisted with the chat transcript without filling up localStorage.
   *
   * Resolves `undefined` when the image cannot be decoded or the browser has no canvas support.
   */
  static createImageThumbnail(dataUrl: string, maxSize = THUMBNAIL_MAX_SIZE): Promise<string | undefined> {
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

  /**
   * Reads an image file into a base64 data URL upload for the chatflow, together with a small thumbnail of it.
   */
  static readImageUpload(file: File): Promise<{ upload: CopilotEmbeddedUpload; thumbnail: string }> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result as string;
        CopilotEmbeddedUploadHelper.createImageThumbnail(data).then(thumbnail =>
          resolve({ upload: { data, type: 'file', name: file.name, mime: file.type }, thumbnail })
        );
      };
      reader.readAsDataURL(file);
    });
  }
}
