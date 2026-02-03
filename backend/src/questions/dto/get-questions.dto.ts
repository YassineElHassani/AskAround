import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetQuestionsDto {
    @IsNumber()
    @Type(() => Number)
    latitude: number;

    @IsNumber()
    @Type(() => Number)
    longitude: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    radius?: number = 5000; // Default radius in meters
}
