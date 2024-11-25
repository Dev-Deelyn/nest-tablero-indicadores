import * as bcrypt from 'bcryptjs'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user.toObject();
        return result;
      } else {
        throw new HttpException('La contraseña ingresada es incorrecta', HttpStatus.UNAUTHORIZED)
      }
    } else {
      throw new HttpException('El usuario de sesión no existe', HttpStatus.UNAUTHORIZED)
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id, profileType: user.profileType };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string, email: string, profileType: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, password: hashedPassword, email, profileType });
    return newUser.save();
  }
}
