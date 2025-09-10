function bytesToBase64(uint8) {
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < uint8.length; i += chunk) {
    bin += String.fromCharCode.apply(null, uint8.subarray(i, i + chunk));
  }
  return btoa(bin);
}

export function toDataUrl(input, mime = 'image/png') {
  if (!input) return null;
  if (typeof input === 'string' && input.startsWith('data:')) return input;      // já é data URL
  if (typeof input === 'string' && /^https?:\/\//i.test(input)) return input;    // já é URL
  if (typeof input === 'string') return `data:${mime};base64,${input}`;          // base64 crua

  if (input instanceof ArrayBuffer) {
    return `data:${mime};base64,${bytesToBase64(new Uint8Array(input))}`;
  }
  if (ArrayBuffer.isView(input)) {
    const view = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    return `data:${mime};base64,${bytesToBase64(view)}`;
  }
  if (input?.type === 'Buffer' && Array.isArray(input.data)) {
    return `data:${mime};base64,${bytesToBase64(new Uint8Array(input.data))}`;
  }
  return null;
}
