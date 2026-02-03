import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from '../schemas/question.schema';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { GetQuestionsDto } from '../dto/get-questions.dto';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    ) { }

    async create(
        createQuestionDto: CreateQuestionDto,
        userId: string,
    ): Promise<Question> {
        const newQuestion = new this.questionModel({
            title: createQuestionDto.title,
            content: createQuestionDto.content,
            location: {
                type: 'Point',
                coordinates: [
                    createQuestionDto.longitude,
                    createQuestionDto.latitude,
                ],
            },
            author: new Types.ObjectId(userId),
        });

        return newQuestion.save();
    }

    async findNearby(getQuestionsDto: GetQuestionsDto): Promise<Question[]> {
        const maxDistance = getQuestionsDto.maxDistance || 3000; // 3km default
        const limit = getQuestionsDto.limit || 50;

        return this.questionModel
            .find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [
                                getQuestionsDto.longitude,
                                getQuestionsDto.latitude,
                            ],
                        },
                        $maxDistance: maxDistance,
                    },
                },
            })
            .limit(limit)
            .populate('author', 'name email')
            .populate('answers')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findById(id: string): Promise<QuestionDocument> {
        const question = await this.questionModel
            .findById(id)
            .populate('author', 'name email')
            .populate({
                path: 'answers',
                populate: {
                    path: 'author',
                    select: 'name email',
                },
            })
            .exec();

        if (!question) {
            throw new NotFoundException('Question not found');
        }

        return question;
    }

    async addAnswer(questionId: string, answerId: string): Promise<Question> {
        const question = await this.questionModel.findById(questionId);

        if (!question) {
            throw new NotFoundException('Question not found');
        }

        question.answers.push(new Types.ObjectId(answerId));
        return question.save();
    }

    async incrementLikeCount(questionId: string): Promise<Question> {
        const question = await this.questionModel.findByIdAndUpdate(
            questionId,
            { $inc: { likeCount: 1 } },
            { new: true },
        );

        if (!question) {
            throw new NotFoundException('Question not found');
        }

        return question;
    }

    async decrementLikeCount(questionId: string): Promise<Question> {
        const question = await this.questionModel.findByIdAndUpdate(
            questionId,
            { $inc: { likeCount: -1 } },
            { new: true },
        );

        if (!question) {
            throw new NotFoundException('Question not found');
        }

        return question;
    }

    async findByIds(ids: string[]): Promise<Question[]> {
        return this.questionModel
            .find({ _id: { $in: ids } })
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }
}
