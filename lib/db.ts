import { neon } from '@neondatabase/serverless'

const DB_URL = process.env.DATABASE_URL

export const DB_ENABLED = !!DB_URL
export const sql = DB_URL ? neon(DB_URL) : null
