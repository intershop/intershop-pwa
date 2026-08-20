/** Error thrown when the ICM backend rejects a request. */
export class IcmError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown
  ) {
    super(message);
    this.name = 'IcmError';
  }
}
