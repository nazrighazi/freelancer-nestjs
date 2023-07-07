import { Module } from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { FreelancerController } from './freelancer.controller';

@Module({
  controllers: [FreelancerController],
  providers: [FreelancerService]
})
export class FreelancerModule {}
