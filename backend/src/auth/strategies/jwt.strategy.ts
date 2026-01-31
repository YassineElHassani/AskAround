import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetQuestionsDto {
    @IsNumber()
    @Type(() => Number)
    longitude: number;

    @IsNumber()
    @Type(() => Number)
    latitude: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    maxDistance?: number; // in meters, default 3000 (3km)

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    limit?: number; // default 50
}
