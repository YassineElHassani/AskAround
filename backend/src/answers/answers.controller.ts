import {
    Controller,
    Post,
    Body,
    UseGuards,
    Param,
    Get,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('answers')
export class AnswersController {
    constructor(private readonly answersService: AnswersService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() createAnswerDto: CreateAnswerDto,
        @GetUser() user: any,
    ) {
        return this.answersService.create(createAnswerDto, user.userId);
    }

    @Get('question/:questionId')
    async findByQuestion(@Param('questionId') questionId: string) {
        return this.answersService.findByQuestionId(questionId);
    }
}
