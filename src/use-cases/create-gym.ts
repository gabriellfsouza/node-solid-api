import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface CreateGymCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymCaseResponse {
  gym: Gym
}

export class CreateGymCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    description,
    title,
    latitude,
    longitude,
    phone,
  }: CreateGymCaseRequest): Promise<CreateGymCaseResponse> {
    const gym = await this.gymsRepository.create({
      description,
      title,
      latitude,
      longitude,
      phone,
    })

    return {
      gym,
    }
  }
}
