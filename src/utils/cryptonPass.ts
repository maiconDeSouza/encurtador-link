import { createHmac } from 'node:crypto'
import dotenv from 'dotenv'
dotenv.config()

const x: string =
  process.env.CRYPTO_PASS ?? `95897fc2-cc7a-4f6d-80ae-208c920e109b`

export async function cryptoPass(pass: string) {
  const hash = createHmac('sha256', pass).update(x).digest('hex')

  return hash
}
