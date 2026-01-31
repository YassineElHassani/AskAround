import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Answer, AnswerDocument } from './schemas/answer.schema';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class AnswersService {
    constructor(
        @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
    ) { }

    async create(
        createAnswerDto: CreateAnswerDto,
        userId: string,
    ): Promise<Answer> {
        const newAnswer = new this.answerModel({
            content: createAnswerDto.content,
            author: new Types.ObjectId(userId),
            question: new Types.ObjectId(createAnswerDto.questionId),
        });

        return newAnswer.save();
    }

    async findByQuestionId(questionId: string): Promise<Answer[]> {
        return this.answerModel
            .find({ question: new Types.ObjectId(questionId) })
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findById(id: string): Promise<AnswerDocument> {
        const answer = await this.answerModel
            .findById(id)
            .populate('author', 'name email')
            .exec();

        if (!answer) {
            throw new NotFoundException('Answer not found');
        }

        return answer;
    }
}
