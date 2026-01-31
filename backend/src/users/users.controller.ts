import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuestionsService } from '../questions/questions.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly questionsService: QuestionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('favorites/:questionId')
  async addToFavorites(
    @Request() req,
    @Param('questionId') questionId: string,
  ) {
    const user = await this.usersService.addFavoriteQuestion(
      req.user.userId,
      questionId,
    );
    await this.questionsService.incrementLikeCount(questionId);
    return { message: 'Question added to favorites', user };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:questionId')
  async removeFromFavorites(
    @Request() req,
    @Param('questionId') questionId: string,
  ) {
    const user = await this.usersService.removeFavoriteQuestion(
      req.user.userId,
      questionId,
    );
    await this.questionsService.decrementLikeCount(questionId);
    return { message: 'Question removed from favorites', user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavorites(@Request() req) {
    const user = await this.usersService.getFavoriteQuestions(req.user.userId);
    return { favorites: user.favoriteQuestions };
  }
}
