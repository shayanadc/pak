import { EntityRepository, Repository } from 'typeorm';
import { BannerEntity } from './banner.entity';

@EntityRepository(BannerEntity)
export class BannerRepository extends Repository<BannerEntity> {
  async index(): Promise<BannerEntity[]> {
    return await this.find();
  }
}
