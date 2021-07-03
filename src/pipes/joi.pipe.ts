import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import { ArraySchema, ObjectSchema } from 'joi';

@Injectable()
export class JoiObjectPipe implements PipeTransform {
  constructor(private readonly objectSchema: ObjectSchema) {}
  async transform(data: any): Promise<void> {
    try {
      const result = await this.objectSchema.validateAsync(data);
      return result;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
@Injectable()
export class JoiArrayPipe implements PipeTransform {
  constructor(private readonly objectSchema: ArraySchema) {}
  async transform(data: any): Promise<void> {
    try {
      const result = await this.objectSchema.validateAsync(data);
      return result;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
