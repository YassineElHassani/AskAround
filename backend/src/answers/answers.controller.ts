import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuestionsService } from '../questions/questions.service';

@Controller('answers')
export class AnswersController {
    constructor(
        private readonly answersService: AnswersService,
        private readonly questionsService: QuestionsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createAnswerDto: CreateAnswerDto, @Request() req) {
        const answer = await this.answersService.create(
            createAnswerDto,
            req.user.userId,
        );

        // Add answer to question's answers array
        const answerId = (answer as any)._id.toString();
        await this.questionsService.addAnswer(
            createAnswerDto.questionId,
            answerId,
        );

        return answer;
    }

    @Get('question/:questionId')
    async findByQuestion(@Param('questionId') questionId: string) {
        return this.answersService.findByQuestionId(questionId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.answersService.findById(id);
    }
}
