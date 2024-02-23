import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { exec } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'Please provide a DATABASE_URL environment variable inside .env',
    )
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseUrl

    await new Promise((resolve, reject) =>
      exec('npx prisma migrate deploy', (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else {
          resolve({ stdout, stderr })
        }
      }),
    )

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
