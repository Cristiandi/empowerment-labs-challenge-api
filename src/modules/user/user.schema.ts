import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user' })
export class User {
  @ApiProperty({
    type: String,
    example: 'auth0|1234567890',
  })
  @Prop({ required: true, unique: true })
  authUid: string;

  @ApiProperty({
    type: String,
    example: 'test@test.com',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    type: String,
    example: 'Test',
  })
  @Prop({ required: true })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
