import { Injectable } from '@nestjs/common';
import { BannerEntity } from './banner.entity';
import { BannerRepository } from './banner.repository';

@Injectable()
export class BannerService {
  constructor(private bannerRepo: BannerRepository) {}
  async index(): Promise<BannerEntity[]> {
    return await this.bannerRepo.index();
  }
}
