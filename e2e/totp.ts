/**
 * Implementação TOTP (RFC 6238) mínima usando apenas Node.js built-ins.
 * Algoritmo: HMAC-SHA1, janela de 30s, 6 dígitos — compatível com
 * Supabase Auth e apps autenticadores padrão (Google Authenticator etc.).
 */
import { createHmac } from 'node:crypto'

function base32Decode(input: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const s = input.replace(/=+$/, '').toUpperCase()
  const bytes: number[] = []
  let bits = 0
  let value = 0
  for (const char of s) {
    const idx = alphabet.indexOf(char)
    if (idx === -1) throw new Error(`Caractere inválido em base32: '${char}'`)
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Buffer.from(bytes)
}

/**
 * Gera o código TOTP atual para o secret fornecido (base32).
 * `window` pode deslocar o tempo em múltiplos de 30s (0 = atual).
 */
export function generateTOTP(secret: string, window = 0): string {
  const counter = Math.floor(Date.now() / 1000 / 30) + window
  const buf = Buffer.alloc(8)
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0)
  buf.writeUInt32BE(counter >>> 0, 4)

  const key = base32Decode(secret)
  const hmac = createHmac('sha1', key).update(buf).digest()

  const offset = hmac[hmac.length - 1] & 0x0f
  const code =
    (((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)) %
    1_000_000

  return code.toString().padStart(6, '0')
}

/** Janela TOTP atual (inteiro que muda a cada 30 segundos). */
export function totpWindow(): number {
  return Math.floor(Date.now() / 1000 / 30)
}
