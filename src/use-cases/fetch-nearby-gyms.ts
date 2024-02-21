import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

export type FetchNearbyGymsUseCaseRequest = {
  userLatitude: number
  userLongitude: number
}

export type FetchNearbyGymsUseCaseResponse = {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
