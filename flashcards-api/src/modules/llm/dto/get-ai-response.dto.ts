import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class GenerateFlashcardsDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  topic: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Min(1)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Max(20) // Limit to 20 flashcards max per request
  count: number = 5;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNumber()
  folderId: number;
}
