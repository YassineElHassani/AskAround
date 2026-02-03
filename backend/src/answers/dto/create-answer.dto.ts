import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async addFavoriteQuestion(
    userId: string,
    questionId: string,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const questionObjectId = new Types.ObjectId(questionId);
    
    if (user.favoriteQuestions.some((id) => id.equals(questionObjectId))) {
      throw new ConflictException('Question already in favorites');
    }

    user.favoriteQuestions.push(questionObjectId);
    return user.save();
  }

  async removeFavoriteQuestion(
    userId: string,
    questionId: string,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const questionObjectId = new Types.ObjectId(questionId);
    user.favoriteQuestions = user.favoriteQuestions.filter(
      (id) => !id.equals(questionObjectId),
    );

    return user.save();
  }

  async getFavoriteQuestions(userId: string): Promise<UserDocument> {
    const user = await this.userModel
      .findById(userId)
      .populate('favoriteQuestions')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
