import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

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
