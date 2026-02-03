import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnswerDocument = Answer & Document;

@Schema({ timestamps: true })
export class Answer {
    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
    questionId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
