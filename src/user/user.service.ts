import { UserProfileOutput } from './dtos/user-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'password'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        throw new UnauthorizedException('Wrong password');
      }

      const token = this.jwtService.sign({ id: user.id });

      return {
        success: true,
        statusCode: 200,
        token,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (user) {
        return {
          success: true,
          statusCode: 200,
          user,
        };
      }
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
