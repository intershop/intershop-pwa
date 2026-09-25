import { createImageThumbnail } from './copilot-embedded-image.helper';

class FakeImage {
  static width = 800;
  static height = 400;
  static fail = false;

  width = FakeImage.width;
  height = FakeImage.height;
  onload: () => void;
  onerror: () => void;

  set src(value: string) {
    setTimeout(() => (FakeImage.fail || !value ? this.onerror() : this.onload()));
  }
}

describe('Copilot Embedded Image Helper', () => {
  const originalImage = window.Image;
  let context: { fillRect: jest.Mock; drawImage: jest.Mock; fillStyle: string };

  beforeEach(() => {
    Object.defineProperty(window, 'Image', { value: FakeImage, writable: true });
    FakeImage.width = 800;
    FakeImage.height = 400;
    FakeImage.fail = false;
    context = { fillRect: jest.fn(), drawImage: jest.fn(), fillStyle: '' };
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(context as unknown as CanvasRenderingContext2D);
    jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,THUMB');
  });

  afterEach(() => {
    Object.defineProperty(window, 'Image', { value: originalImage, writable: true });
    jest.restoreAllMocks();
  });

  it('should downscale to a JPEG thumbnail keeping the aspect ratio', async () => {
    const thumbnail = await createImageThumbnail('data:image/png;base64,AAAA');

    expect(thumbnail).toBe('data:image/jpeg;base64,THUMB');
    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 200, 100);
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.7);
  });

  it('should fill a white background so transparent areas do not turn black', async () => {
    await createImageThumbnail('data:image/png;base64,AAAA');

    expect(context.fillStyle).toBe('#fff');
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 200, 100);
  });

  it('should not upscale images that are already small', async () => {
    FakeImage.width = 120;
    FakeImage.height = 80;

    await createImageThumbnail('data:image/png;base64,AAAA');

    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 120, 80);
  });

  it('should resolve undefined when the image cannot be decoded', async () => {
    FakeImage.fail = true;

    expect(await createImageThumbnail('data:image/png;base64,broken')).toBeUndefined();
  });

  it('should resolve undefined when canvas is not supported', async () => {
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(undefined);

    expect(await createImageThumbnail('data:image/png;base64,AAAA')).toBeUndefined();
  });
});
