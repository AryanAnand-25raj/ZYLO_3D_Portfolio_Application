import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface StoredFileInfo {
  fileKey: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  filePath: string;
}

const STORAGE_ROOT = path.join(process.cwd(), ".storage", "private_resumes");

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_ROOT)) {
  fs.mkdirSync(STORAGE_ROOT, { recursive: true });
}

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

/**
 * Validates magic bytes to prevent forged file extensions or malicious payloads.
 */
export function validateMagicBytes(buffer: Buffer): { valid: boolean; detectedMime?: string } {
  if (buffer.length < 4) return { valid: false };

  // PDF Magic Bytes: %PDF (25 50 44 46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return { valid: true, detectedMime: "application/pdf" };
  }

  // DOCX / ZIP Magic Bytes: PK.. (50 4B 03 04)
  if (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  ) {
    return {
      valid: true,
      detectedMime:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  }

  // Plain Text fallback
  let isAsciiText = true;
  for (let i = 0; i < Math.min(buffer.length, 512); i++) {
    const byte = buffer[i];
    if (byte < 0x09 || (byte > 0x0d && byte < 0x20 && byte !== 0x1b)) {
      isAsciiText = false;
      break;
    }
  }

  if (isAsciiText) {
    return { valid: true, detectedMime: "text/plain" };
  }

  return { valid: false };
}

/**
 * Saves uploaded file to private server storage isolated by userId.
 * Never publicly exposes files.
 */
export async function savePrivateFile(
  userId: string,
  fileName: string,
  buffer: Buffer,
  declaredMimeType: string
): Promise<StoredFileInfo> {
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`File exceeds maximum size limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  const magicCheck = validateMagicBytes(buffer);
  if (!magicCheck.valid) {
    throw new Error("Invalid or corrupted file format. Only valid PDF and DOCX files are allowed.");
  }

  const userDir = path.join(STORAGE_ROOT, userId);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  const fileKey = `${crypto.randomUUID()}_${path.basename(fileName).replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(userDir, fileKey);

  fs.writeFileSync(filePath, buffer);

  return {
    fileKey: `${userId}/${fileKey}`,
    fileName,
    mimeType: magicCheck.detectedMime || declaredMimeType,
    sizeBytes: buffer.length,
    filePath,
  };
}

/**
 * Reads a private file from storage. Only accessible by authorized server code.
 */
export function readPrivateFile(fileKey: string): Buffer {
  const safePath = path.resolve(STORAGE_ROOT, fileKey);
  if (!safePath.startsWith(STORAGE_ROOT) || !fs.existsSync(safePath)) {
    throw new Error("File not found or access unauthorized");
  }
  return fs.readFileSync(safePath);
}

/**
 * Deletes a private file from storage.
 */
export function deletePrivateFile(fileKey: string): void {
  const safePath = path.resolve(STORAGE_ROOT, fileKey);
  if (safePath.startsWith(STORAGE_ROOT) && fs.existsSync(safePath)) {
    fs.unlinkSync(safePath);
  }
}
