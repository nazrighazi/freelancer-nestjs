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
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminAuthDto, GetAuthDto } from './dto/auth.dto';
import { Tokens } from './types/tokens.type';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user.decorator-id';
import { AtGuard } from 'src/common/guards/at.guard';
import { RtGuard } from 'src/common/guards/rt.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('admin/signup')
  @HttpCode(HttpStatus.CREATED)
  signUpLocal(@Body() createAdminAuthDto: CreateAdminAuthDto): Promise<Tokens> {
    return this.authService.signUpLocal(createAdminAuthDto);
  }

  @Public()
  @Post('admin/signin')
  @HttpCode(HttpStatus.OK)
  signInLocal(@Body() getAuthDto: GetAuthDto): Promise<Tokens> {
    return this.authService.signInLocal(getAuthDto);
  }

  @Post('admin/logout')
  @HttpCode(HttpStatus.OK)
  logoutLocal(@GetCurrentUserId() userId: string) {
    // const user = req.user;
    return this.authService.logoutLocal(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('admin/refresh')
  @HttpCode(HttpStatus.OK)
  refreshLocalToken(
    @GetCurrentUserId() sub: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    // const user = req.user;
    return this.authService.refreshLocalToken(sub, refreshToken);
    // return this.authService.refreshLocalToken(getAuthDto);
  }
}
