export interface IStorageService {
  upload(key: string, buffer: Buffer, contentType?: string): Promise<{ key: string }>;
  getPublicUrl(key: string): string;
}
export interface IStorageService {
  upload(key: string, buffer: Buffer, contentType?: string): Promise<{ key: string }>;
  getPublicUrl(key: string): string;
  delete(key: string): Promise<void>; // ⬅️ novo
}