import { users } from '../db/schema'
import { db } from '../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const newUser = await db
      .insert(users)
      .values({
        name: body.name,
        email: body.email,
      })
      .returning()

    return { success: true, data: newUser }
  } catch (error) {
    console.error('Error creating user:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not create user',
    })
  }
})
