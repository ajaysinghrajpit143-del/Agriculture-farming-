export interface GeneratedImage {
  mimeType: string;
  data: string; // Base64 string
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ImageEditRequest {
  imageBase64: string;
  mimeType: string;
  prompt: string;
}