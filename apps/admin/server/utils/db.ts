import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

// Get database URL from runtime config
const config = useRuntimeConfig()

// Create database client
const client = createClient({
  url: config.databaseUrl,
})

export const db = drizzle(client)

// Export types for your database schema
export * as schema from '../db/schema'
