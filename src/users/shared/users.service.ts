import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(user: User) {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  async getUser(query: object): Promise<User> {
    return this.userModel.findOne(query);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }
}
