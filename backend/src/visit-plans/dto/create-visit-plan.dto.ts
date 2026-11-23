import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateVisitPlanDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  destinationId: string;

  @IsString()
  @IsNotEmpty()
  destinationName: string;

  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'visitDate harus berformat YYYY-MM-DD',
  })
  visitDate: string;

  @IsInt()
  @Min(1)
  participantCount: number;

  @IsBoolean()
  isCompleted: boolean;
}
