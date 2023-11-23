import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phones: { number: string; ddd: string }[];

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  last_login: Date;

  @Prop()
  token?: string;

  _id?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
