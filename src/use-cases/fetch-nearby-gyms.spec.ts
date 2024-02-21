import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    })
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: new Decimal(-27.0610928),
      longitude: new Decimal(-49.5229501),
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ id: 'gym-01', title: 'Near Gym' }),
    ])
  })
})
