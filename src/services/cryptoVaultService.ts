import { getUsers, getActiveUser } from './userService.ts';

interface EncryptedPayload {
  version: string;
  timestamp: string;
  salt: string; // hex
  iv: string; // hex
  ciphertext: string; // base64
}

// Convert ArrayBuffer to Hex String
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Convert Hex String to Uint8Array
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Convert ArrayBuffer to Base64
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to Uint8Array
function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Derive AES-256 Key from Passphrase + Salt using PBKDF2
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function exportEncryptedVault(passphrase: string): Promise<void> {
  const allData: Record<string, string | null> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('healthlens_') || key === 'healthlens_users_v1' || key === 'gemini_api_key')) {
      allData[key] = localStorage.getItem(key);
    }
  }

  const jsonString = JSON.stringify({
    exportedAt: new Date().toISOString(),
    data: allData
  });

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const enc = new TextEncoder();
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource
    },
    key,
    enc.encode(jsonString)
  );

  const payload: EncryptedPayload = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    salt: bufferToHex(salt.buffer),
    iv: bufferToHex(iv.buffer),
    ciphertext: bufferToBase64(encryptedContent)
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `HealthLens-Backup-${new Date().toISOString().split('T')[0]}.healthvault`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function restoreEncryptedVault(file: File, passphrase: string): Promise<void> {
  const text = await file.text();
  const payload: EncryptedPayload = JSON.parse(text);

  if (!payload.salt || !payload.iv || !payload.ciphertext) {
    throw new Error('Invalid .healthvault file format.');
  }

  const salt = hexToBuffer(payload.salt);
  const iv = hexToBuffer(payload.iv);
  const ciphertext = base64ToBuffer(payload.ciphertext);

  const key = await deriveKey(passphrase, salt);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource
    },
    key,
    ciphertext as BufferSource
  );

  const dec = new TextDecoder();
  const decryptedJson = dec.decode(decryptedBuffer);
  const parsed = JSON.parse(decryptedJson);

  if (parsed.data) {
    for (const [k, v] of Object.entries(parsed.data)) {
      if (typeof v === 'string') {
        localStorage.setItem(k, v);
      }
    }
  }
}
