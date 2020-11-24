import { Injectable } from '@nestjs/common';
import { MaterialEntity } from './material.entity';
import { MaterialRepository } from './material.repository';

@Injectable()
export class MaterialService {
  constructor(private materialRepo: MaterialRepository) {}

  async index(): Promise<MaterialEntity[]> {
    return await this.materialRepo.find();
  }
}
