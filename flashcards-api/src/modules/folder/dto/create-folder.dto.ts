import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateFolderDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(3)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MaxLength(50)
  name: string;
}
