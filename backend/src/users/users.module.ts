import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsLatitude,
    IsLongitude,
} from 'class-validator';

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsLongitude()
    longitude: number;

    @IsNumber()
    @IsLatitude()
    latitude: number;
}
