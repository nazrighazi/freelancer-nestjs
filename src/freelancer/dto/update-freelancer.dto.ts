import { PartialType } from '@nestjs/mapped-types';
import { FreelancerDto } from './freelancer.dto';

export class UpdateFreelancerDto extends PartialType(FreelancerDto) {}
