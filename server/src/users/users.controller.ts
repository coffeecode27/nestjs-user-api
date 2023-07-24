import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async getAll() {
    const users = await this.usersService.getAllUsers();
    // console.log(users);
    return users;
  }

  @Post('signup')
  public async signUp(@Body() fields: any) {
    return this.usersService.signup(fields);
  }

  @Post('signup/employee')
  public async signUpEmployee(@Body() fields: any) {
    return this.usersService.signUpEmployee(fields);
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  public async signIn(@Request() req: any) {
    // console.log(req.user);
    return this.usersService.signin(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  public async getProfile(@Request() req: any) {
    // console.log(req.user);
    return req.user;
  }
}
