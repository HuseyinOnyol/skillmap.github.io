// SQLite entegrasyonu devre dışı bırakıldı. Bu dosya boş bırakıldı.
export const sqlite = null as unknown as any
export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}
