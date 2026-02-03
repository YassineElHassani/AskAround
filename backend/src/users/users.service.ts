import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GetQuestionsDto } from './dto/get-questions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createQuestionDto: CreateQuestionDto, @Request() req) {
        return this.questionsService.create(createQuestionDto, req.user.userId);
    }

    @Get()
    async findNearby(@Query() getQuestionsDto: GetQuestionsDto) {
        return this.questionsService.findNearby(getQuestionsDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.questionsService.findById(id);
    }
}
