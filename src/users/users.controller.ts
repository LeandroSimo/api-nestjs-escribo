import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './shared/users.service';
import { User } from './shared/user.model';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/shared/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async create(
    @Body() user: User,
    @Body('password') password: string,
  ): Promise<any> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const createdUser: User = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      phones: user.phones,
      created_at: new Date(),
      updated_at: new Date(),
      last_login: new Date(),
      token: '',
    };
    const savedUser = await this.usersService.createUser(createdUser);
    return {
      created_at: savedUser.created_at,
      updated_at: savedUser.updated_at,
      last_login: savedUser.last_login,
      token: savedUser.token,
      _id: savedUser._id,
    };
  }
}
