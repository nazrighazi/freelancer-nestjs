import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { FreelancerDto } from './dto/freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ok } from 'assert';

@Injectable()
export class FreelancerService {
  constructor(private prismaService: PrismaService) {}

  async createFreelancer(dto: FreelancerDto) {
    const compareUser = await this.checkExistingUser(dto);

    if (compareUser)
      throw new ForbiddenException('Username or Email already existed');

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

    const toRemoveSkillSets = await Promise.all(
      // dto.skillSets.filter((item) => item?.status?.toLowerCase() == 'delete'),
      await this.prismaService.skillset.findMany({
        where: {
          userId: id,
          NOT: {
            OR: newSkillSets,
          },
        },
      }),
    );

    console.log(toRemoveSkillSets);

    if (toRemoveSkillSets) {
      const removeSkillSets = await Promise.all(
        toRemoveSkillSets.map(async (item) => {
          return await this.prismaService.skillset.delete({
            where: {
              id: item?.id,
            },
          });
        }),
      );

      if (!removeSkillSets)
        throw new BadRequestException('Error while updating your data');
    }

    const updateSkillSets = await Promise.all(
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
    );

    if (!updateSkillSets)
      throw new BadRequestException('Error while updating skillsets');

    const user = await this.prismaService.freelancer.update({
      where: {
        id: id,
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

    if (!user) throw new BadRequestException('Error while updating the data');

    return user;
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

    return { message: 'User deleted successfully!', statusCode: 200 };
  }
}
