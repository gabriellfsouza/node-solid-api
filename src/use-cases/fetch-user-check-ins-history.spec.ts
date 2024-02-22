import { beforeEach, it, describe, expect, vi } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach } from 'node:test'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  it('should be able to fetch check-in history', async () => {
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

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym-01',
        validated_at: new Date(2022, 0, 20, 8, 0, 0),
      }),
      expect.objectContaining({
        gym_id: 'gym-02',
        validated_at: new Date(2022, 0, 21, 8, 0, 0),
      }),
    ])
  })

  it('should be able to fetch paginated user check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      checkInsRepository.items.push({
        id: `check-in-${i}`,
        gym_id: 'gym-01',
        user_id: 'user-01',
        created_at: new Date(2022, 0, 20, i, 0, 0),
        validated_at: new Date(2022, 0, 20, i, 0, 0),
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        id: 'check-in-21',
        validated_at: new Date(2022, 0, 20, 21, 0, 0),
      }),
      expect.objectContaining({
        id: 'check-in-22',
        validated_at: new Date(2022, 0, 20, 22, 0, 0),
      }),
    ])
  })
})
