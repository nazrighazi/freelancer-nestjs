import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAdminAuthDto, GetAuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async refreshLocalToken(userId: string, rt: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied, User not found');

    const rtMatches = await bcrypt.compare(rt, user.refreshTokenHash);

    if (!rtMatches)
      throw new ForbiddenException('Access Denied, token not valid');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRTHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logoutLocal(userId: string) {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        refreshTokenHash: {
          not: null,
        },
      },
      data: {
        refreshTokenHash: null,
      },
    });
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'some-at-secret',
          expiresIn: 60 * 30,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'some-rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signUpLocal(dto: CreateAdminAuthDto): Promise<Tokens> {
    const hashData = await this.hashData(dto.password);

    const compareUser = await this.checkExistingUser(dto);

    if (compareUser)
      throw new ForbiddenException('Username or Email already existed');

    const newUser = await this.prismaService.user.create({
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        passwordHash: hashData,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRTHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async updateRTHash(userId: string, rt: string) {
    const hashToken = await this.hashData(rt);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash: hashToken,
      },
    });
  }

  async checkExistingUser(dto: CreateAdminAuthDto) {
    return await this.prismaService.user.findFirst({
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

  async signInLocal(dto: GetAuthDto): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (!user) throw new ForbiddenException('Username not exist');

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) throw new ForbiddenException('Password not match');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRTHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
