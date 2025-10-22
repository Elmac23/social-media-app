import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { querySchema } from 'src/schemas/query.schema';

export class QueryPipe implements PipeTransform {
  constructor() {}

  async transform(value: unknown, metadata: ArgumentMetadata) {
    const result = await querySchema.safeParseAsync(value);

    if (!result.success) throw new BadRequestException(result.error);

    return result.data;
  }
}
