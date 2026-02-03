import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    })
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Answer' }], default: [] })
    answers: Types.ObjectId[];

    @Prop({ default: 0 })
    likeCount: number;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

// Create 2dsphere index for geospatial queries
QuestionSchema.index({ location: '2dsphere' });
