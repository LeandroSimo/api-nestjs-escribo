import {
  Injectable,
  NotAcceptableException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/shared/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/shared/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUser({ email });
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotAcceptableException('Não foi possível encontrar o usuário');
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(user: User): Promise<any> {
    const existingUser = await this.usersService.findByEmail(user.email);

    if (existingUser) {
      throw new ConflictException('E-mail já existente');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);

    const createdUser: User = {
      ...user,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
      last_login: new Date(),
    };

    const savedUser = await this.usersService.createUser(createdUser);

    const token = this.generateToken(savedUser);

    savedUser.token = token;
    await savedUser.save();

    return {
      created_at: savedUser.created_at,
      updated_at: savedUser.updated_at,
      last_login: savedUser.last_login,
      token: savedUser.token,
      _id: savedUser._id,
    };
  }

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException({
        message: 'Usuário e/ou senha inválidos',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuário e/ou senha inválidos');
    }

    user.last_login = new Date();
    await user.save();

    const token = this.generateToken(user);

    return {
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
      token: token,
      _id: user._id,
    };
  }

  generateToken(user: User): string {
    const payload = { sub: user._id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
