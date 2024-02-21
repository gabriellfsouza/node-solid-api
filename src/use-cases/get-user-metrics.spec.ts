import { beforeEach, it, describe, expect, vi } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach } from 'node:test'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  it('should be able to get check-ins count from metrics', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    checkInsRepository.items.push({
      id: 'check-in-01',
      gym_id: 'gym-01',
      user_id: 'user-01',
      created_at: new Date(2022, 0, 20, 8, 0, 0),
      validated_at: new Date(2022, 0, 20, 8, 0, 0),
    })

    checkInsRepository.items.push({
      id: 'check-in-02',
      gym_id: 'gym-02',
      user_id: 'user-01',
      created_at: new Date(2022, 0, 21, 8, 0, 0),
      validated_at: new Date(2022, 0, 21, 8, 0, 0),
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
