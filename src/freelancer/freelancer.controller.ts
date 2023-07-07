import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { FreelancerDto } from './dto/freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('freelancer')
export class FreelancerController {
  constructor(private readonly freelancerService: FreelancerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createFreelancer(@Body() createFreelancerDto: FreelancerDto) {
    return this.freelancerService.createFreelancer(createFreelancerDto);
  }

  @Public()
  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAllFreelancers() {
    return this.freelancerService.getAllFreelancers();
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOneFreelancer(@Param('id') id: string) {
    return this.freelancerService.findOneFreelancer(id);
  }

  @Patch(':id')
  updateFreelancer(
    @Param('id') id: string,
    @Body() updateFreelancerDto: FreelancerDto,
  ) {
    return this.freelancerService.updateFreelancer(id, updateFreelancerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  removeFreelancer(@Param('id') id: string) {
    return this.freelancerService.removeFreelancer(id);
  }
}
