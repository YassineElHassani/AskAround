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
import { QuestionsService } from '../questions/questions.service';

@Controller('answers')
export class AnswersController {
    constructor(
        private readonly answersService: AnswersService,
        private readonly questionsService: QuestionsService,
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() createAnswerDto: CreateAnswerDto,
        @GetUser() user: any,
    ) {
        const answer = await this.answersService.create(createAnswerDto, user.userId);
        
        // Add answer ID to question's answers array
        const answerId = (answer as any)._id.toString();
        await this.questionsService.addAnswer(createAnswerDto.questionId, answerId);
        
        return answer;
    }

    @Get('question/:questionId')
    async findByQuestion(@Param('questionId') questionId: string) {
        return this.answersService.findByQuestionId(questionId);
    }
}
