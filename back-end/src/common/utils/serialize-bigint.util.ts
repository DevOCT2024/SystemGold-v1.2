// src/common/utils/serialize-bigint.util.ts
export function serializeBigInt(value: unknown): any {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(serializeBigInt);
  }
  if (value && typeof value === 'object') {
    // Evita transformar Date/Buffer/etc
    if (value instanceof Date || value instanceof Buffer) return value;
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, serializeBigInt(v)])
    );
  }
  return value;
}
