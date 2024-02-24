import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

describe('CheckIns History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the history of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        description: 'Some description.',
        phone: '11999999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    })
    const tokenSchema = z.object({ sub: z.string() })
    const decodedToken = tokenSchema.parse(app.jwt.decode(token))

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: decodedToken.sub,
        },
        {
          gym_id: gym.id,
          user_id: decodedToken.sub,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: decodedToken.sub,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: decodedToken.sub,
      }),
    ])
  })
})
