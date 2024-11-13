import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async createNewUser(username: string, password: string, email: string, profileType: string) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new this.userModel({ username, password: hashedPassword, email, profileType });
    return newUser.save();
  }
}
