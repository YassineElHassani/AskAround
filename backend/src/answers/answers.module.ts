import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { Answer, AnswerSchema } from './schemas/answer.schema';
import { QuestionsModule } from '../questions/questions.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
        QuestionsModule,
    ],
    controllers: [AnswersController],
    providers: [AnswersService],
    exports: [AnswersService],
})
export class AnswersModule { }
