import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignUpUserInput {
  @ApiProperty({
    example: 'test@test.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'test1234',
  })
  @IsString()
  readonly password: string;

  @ApiProperty({
    example: 'Test User',
  })
  @IsString()
  readonly name: string;
}
