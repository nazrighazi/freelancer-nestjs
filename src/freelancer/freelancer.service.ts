import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FreelancerDto } from './dto/freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ok } from 'assert';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class FreelancerService {
  constructor(
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createFreelancer(dto: FreelancerDto) {
    const compareUser = await this.checkExistingUser(dto);

    if (compareUser)
      throw new ForbiddenException(
        'Username / Email / Phone Number already existed',
      );

    const { skillSets } = dto;
    const newUser = await this.prismaService.freelancer.create({
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        hobby: dto.hobby,
        phoneNum: dto.phoneNum,
        skillSets: {
          createMany: {
            data: skillSets,
          },
        },
      },
      include: {
        skillSets: true,
      },
    });

    console.log(newUser);

    if (!newUser) throw new BadRequestException('Error on body request');

    await this.cacheManager.reset();

    return newUser;
  }

  async checkExistingUser(dto: FreelancerDto) {
    return await this.prismaService.freelancer.findFirst({
      where: {
        OR: [
          {
            username: dto.username,
          },
          {
            email: dto.email,
          },
          {
            phoneNum: dto.phoneNum,
          },
        ],
      },
    });
  }

  async getAllFreelancers() {
    return await this.prismaService.freelancer.findMany({
      include: { skillSets: true },
    });
  }

  findOneFreelancer(id: string) {
    const user = this.prismaService.freelancer.findUnique({
      where: {
        id: id,
      },
      include: {
        skillSets: true,
      },
    });

    if (!user) throw new BadRequestException('User not found');

    return user;
  }

  async updateFreelancer(id: string, dto: FreelancerDto) {
    let newSkillSets = [];
    for (let i = 0; i < dto.skillSets.length; i++) {
      newSkillSets.push({
        id: dto.skillSets[i].id,
      });
    }

    // removeSkillSets

    // const toRemoveSkillSets = await Promise.all(
    //   // dto.skillSets.filter((item) => item?.status?.toLowerCase() == 'delete'),

    // );

    // console.log(toRemoveSkillSets);

    const [
      [toRemoveSkillSets, removeSkillSets],
      updateSkillSets,
      [checkUser, updateDetails],
    ] = await Promise.all([
      this.removeSkillSets(id, newSkillSets),
      dto.skillSets.map(async (item) => {
        console.log(item);
        return await this.prismaService.skillset.upsert({
          where: {
            id: item?.id || '',
          },
          update: {
            title: item.title,
          },
          create: {
            title: item.title,
            userId: id,
          },
        });
      }),
      this.updateUserDetails(id, dto),
    ]);

    if (
      !toRemoveSkillSets ||
      !removeSkillSets ||
      !updateSkillSets ||
      !updateDetails ||
      !checkUser
    )
      throw new BadRequestException('Error while updating skillsets');

    // const user = await ;

    // if (!user) throw new BadRequestException('Error while updating the data');

    await this.cacheManager.reset();

    return updateDetails;
  }

  async removeSkillSets(userId: string, newSkillSets: any[]) {
    const toRemoveSkillSets = await this.prismaService.skillset.findMany({
      where: {
        userId: userId,
        NOT: {
          OR: newSkillSets,
        },
      },
    });

    const removeSkillSets = toRemoveSkillSets.map(async (item) => {
      return await this.prismaService.skillset.delete({
        where: {
          id: item?.id,
        },
      });
    });

    if (!removeSkillSets)
      throw new BadRequestException('Error while updating your data');

    return [toRemoveSkillSets, removeSkillSets];
  }
  async updateUserDetails(userId: string, dto: FreelancerDto) {
    const checkUser = await this.prismaService.freelancer.findMany({
      where: {
        NOT: { id: userId },
        OR: [
          {
            username: dto.username,
          },
          {
            phoneNum: dto.phoneNum,
          },
          {
            email: dto.email,
          },
        ],
      },
    });
    if (checkUser)
      throw new ForbiddenException(
        'username / phone number / email are existing value',
      );

    const updateDetails = this.prismaService.freelancer.update({
      where: {
        id: userId,
      },
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        hobby: dto.hobby,
        phoneNum: dto.phoneNum,
      },
      include: {
        skillSets: true,
      },
    });

    return [checkUser, updateDetails];
  }

  async removeFreelancer(id: string) {
    const checkUser = await this.prismaService.freelancer.findUnique({
      where: {
        id,
      },
    });

    if (!checkUser) throw new BadRequestException('User not exist');
    const deleteUser = await this.prismaService.freelancer.delete({
      where: {
        id: id,
      },
    });

    if (!deleteUser) throw new BadRequestException('Error while deleting user');

    await this.cacheManager.reset();

    return { message: 'User deleted successfully!', statusCode: 200 };
  }
}
