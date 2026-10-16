/**
 * An image (or file) attachment sent with a prediction request. The shape matches the
 * `uploads` entries the Flowise Prediction API expects for vision-enabled chat flows.
 */
export interface CopilotEmbeddedUpload {
  /** Base64-encoded data URL, e.g. `data:image/png;base64,...`. */
  data: string;
  type: 'file';
  name: string;
  mime: string;
}
